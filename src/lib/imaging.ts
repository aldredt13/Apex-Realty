import imageCompression from "browser-image-compression";
import { supabase, LISTINGS_BUCKET } from "./supabase";

/**
 * Compression tuned to shrink file size hard while keeping images visually
 * crisp: cap the longest edge at 2000px (plenty for full-screen viewing),
 * keep quality high (0.82) and re-encode to WebP, which is typically 25–35%
 * smaller than JPEG at the same perceived quality.
 */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 2000,
  initialQuality: 0.82,
  useWebWorker: true,
  fileType: "image/webp" as const,
};

export type CompressResult = {
  file: File;
  beforeKB: number;
  afterKB: number;
};

export async function compressImage(file: File): Promise<CompressResult> {
  const beforeKB = Math.round(file.size / 1024);
  const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
  // Give it a clean .webp name
  const base = file.name.replace(/\.[^.]+$/, "");
  const out = new File([compressed], `${base}.webp`, { type: "image/webp" });
  return { file: out, beforeKB, afterKB: Math.round(out.size / 1024) };
}

// Always returns a valid RFC-4122 v4 UUID (the listings.id column is `uuid`).
// crypto.randomUUID() only exists in secure contexts, so fall back to a proper
// v4 built from getRandomValues (or Math.random as a last resort).
function randomId(): string {
  const c = typeof crypto !== "undefined" ? crypto : undefined;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === "function") {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
}

export type UploadResult = {
  url: string;
  beforeKB: number;
  afterKB: number;
};

/**
 * Compress then upload a single image to the listing's storage folder.
 * Returns the public URL plus before/after sizes for UI feedback.
 */
export async function uploadListingImage(
  file: File,
  listingId: string
): Promise<UploadResult> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { file: compressed, beforeKB, afterKB } = await compressImage(file);
  const path = `${listingId}/${randomId()}.webp`;

  const { error } = await supabase.storage
    .from(LISTINGS_BUCKET)
    .upload(path, compressed, {
      cacheControl: "31536000",
      contentType: "image/webp",
      upsert: false,
    });
  if (error) throw error;

  const { data } = supabase.storage.from(LISTINGS_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, beforeKB, afterKB };
}

// Extract the storage path (e.g. "<listingId>/<file>.webp") from a public URL.
function pathFromUrl(url: string): string | null {
  const marker = `/object/public/${LISTINGS_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

/** Remove a single uploaded image from storage given its public URL. */
export async function deleteListingImage(url: string): Promise<void> {
  if (!supabase) return;
  const path = pathFromUrl(url);
  if (!path) return;
  const { error } = await supabase.storage.from(LISTINGS_BUCKET).remove([path]);
  if (error) throw error;
}

/**
 * Delete every file in a listing's folder. This is the reliable way to clean up
 * on listing delete — it lists the actual objects rather than trusting the URL
 * list, so nothing is left orphaned. Storage objects can only be removed through
 * the Storage API (direct SQL deletion is blocked by Supabase), so this must run
 * client-side while signed in as an admin.
 */
export async function deleteListingFolder(listingId: string): Promise<void> {
  if (!supabase) return;
  const { data: files, error: listError } = await supabase.storage
    .from(LISTINGS_BUCKET)
    .list(listingId, { limit: 1000 });
  if (listError) throw listError;
  if (!files || files.length === 0) return;

  const paths = files.map((f) => `${listingId}/${f.name}`);
  const { error: removeError } = await supabase.storage
    .from(LISTINGS_BUCKET)
    .remove(paths);
  if (removeError) throw removeError;
}

/** Compress + upload a profile picture. Returns the public URL. */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured.");
  // Avatars are small — square-ish and tightly compressed.
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 512,
    initialQuality: 0.85,
    useWebWorker: true,
    fileType: "image/webp",
  });
  const path = `${userId}/${randomId()}.webp`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, compressed, {
      cacheControl: "31536000",
      contentType: "image/webp",
      upsert: true,
    });
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export { randomId as newListingId };
