import { supabase } from "./supabase";
import type { SubmissionType } from "./types";

export type SubmissionPayload = {
  type: SubmissionType;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  listing_id?: string | null;
  listing_title?: string | null;
  meta?: Record<string, string>;
};

/** Store a form submission. Returns { ok: false } when Supabase isn't configured. */
export async function submitForm(
  p: SubmissionPayload
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: "not-configured" };
  const { error } = await supabase.from("form_submissions").insert({
    type: p.type,
    name: p.name,
    email: p.email ?? null,
    phone: p.phone ?? null,
    message: p.message ?? null,
    listing_id: p.listing_id ?? null,
    listing_title: p.listing_title ?? null,
    meta: p.meta ?? null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}
