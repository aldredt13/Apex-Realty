import { supabase } from "./supabase";

// Default Supabase free-tier file-storage quota. Change this to match your plan
// (e.g. Pro = 100 GB) so the "free" figure is accurate.
export const STORAGE_LIMIT_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB

export type StorageStats = { bytes: number; files: number };

/**
 * Reads total storage used in the listing-images bucket via the storage_stats()
 * RPC. Returns null if the RPC hasn't been created yet (see supabase/schema.sql).
 */
export async function getStorageStats(): Promise<StorageStats | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("storage_stats");
  if (error) return null;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { bytes: 0, files: 0 };
  return { bytes: Number(row.bytes) || 0, files: Number(row.files) || 0 };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
