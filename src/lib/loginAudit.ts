import { supabase } from "./supabase";
import { detectCountry } from "./geo";

export type LoginEvent = {
  id: string;
  user_id: string | null;
  email: string | null;
  ip: string | null;
  user_agent: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  created_at: string;
  success: boolean;
  /** first time this account was seen from this IP */
  is_new_device?: boolean;
};

const DEVICE_KEY = "apex_device_token";

/**
 * Per-browser token. Issued locally, then bound to a real sign-in server-side.
 * The server only ever stores its SHA-256 hash, and the navbar shortcut is
 * shown only when this exact token was recorded during a successful login.
 */
function deviceToken(): string {
  try {
    let t = localStorage.getItem(DEVICE_KEY);
    if (!t || t.length < 20) {
      const b = new Uint8Array(24);
      (globalThis.crypto ?? ({} as Crypto)).getRandomValues?.(b);
      t = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
      if (t.length < 20) t = `${Date.now()}${Math.random()}`.replace(/\D/g, "").padEnd(32, "0");
      localStorage.setItem(DEVICE_KEY, t);
    }
    return t;
  } catch {
    return "";
  }
}

/**
 * Record a dashboard sign-in. The IP and user agent are read from the request
 * headers server-side (can't be faked by the browser); city/country are best
 * effort context from the geo lookup.
 */
export async function recordLogin(): Promise<void> {
  if (!supabase) return;
  let city: string | null = null;
  let region: string | null = null;
  let country: string | null = null;
  let ip: string | null = null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      city = d.city ?? null;
      region = d.region ?? null;
      country = d.country_code ?? null;
      ip = d.ip ?? null;
    }
  } catch {
    /* geo is optional */
  }
  if (!country) country = await detectCountry().catch(() => null);

  await supabase.rpc("record_login", {
    p_city: city,
    p_region: region,
    p_country: country,
    p_ip_fallback: ip,
    p_device_token: deviceToken(),
  });
}

/**
 * Has anyone signed in from this device/IP before? Used to reveal the
 * dashboard shortcut in the navbar. Checks a local flag first (instant),
 * then asks the server, which compares the request's real IP.
 */
export async function isKnownDevice(): Promise<boolean> {
  if (!supabase) return false;
  const token = deviceToken();
  if (!token) return false;

  const { data, error } = await supabase.rpc("is_known_device", {
    p_device_token: token,
  });
  return !error && data === true;
}

export async function listLoginEvents(limit = 500): Promise<LoginEvent[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("login_events_view")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as LoginEvent[]) ?? [];
}

export async function clearLoginEvent(id: string) {
  if (!supabase) return;
  await supabase.from("login_events").delete().eq("id", id);
}

/** Delete every failed attempt, or the whole log. Super admin only (RLS). */
export async function clearLoginEvents(onlyFailed: boolean) {
  if (!supabase) return;
  const q = supabase.from("login_events").delete();
  if (onlyFailed) await q.eq("success", false);
  else await q.not("id", "is", null);
}

/**
 * Log a failed sign-in attempt so brute-force tries are visible in the audit.
 * Rate-guarded server side; never throws (must not disrupt the login screen).
 */
export async function recordFailedLogin(email: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.rpc("record_failed_login", { p_email: email });
  } catch {
    /* auditing is best effort */
  }
}

/** Rows -> CSV for record keeping. */
export function toCsv(rows: LoginEvent[]): string {
  const head = ["When", "Result", "Account", "IP", "Location", "Device", "New device", "User agent"];
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) => {
    const d = describeDevice(r.user_agent);
    return [
      new Date(r.created_at).toISOString(),
      r.success ? "Success" : "Failed",
      r.email ?? "",
      r.ip ?? "",
      [r.city, r.region, r.country].filter(Boolean).join(" / "),
      `${d.browser} ${d.os} ${d.device}`,
      r.is_new_device ? "yes" : "no",
      r.user_agent ?? "",
    ].map(esc).join(",");
  });
  return [head.map(esc).join(","), ...lines].join("\n");
}

/** Turn a raw user-agent string into "Chrome on Windows" style text. */
export function describeDevice(ua: string | null): { browser: string; os: string; device: string } {
  if (!ua) return { browser: "Unknown", os: "Unknown", device: "Unknown" };

  const os =
    /Windows NT 10/.test(ua) ? "Windows" :
    /Windows/.test(ua) ? "Windows" :
    /iPhone|iPad|iPod/.test(ua) ? "iOS" :
    /Android/.test(ua) ? "Android" :
    /Mac OS X/.test(ua) ? "macOS" :
    /Linux/.test(ua) ? "Linux" : "Unknown";

  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) ? "Safari" : "Unknown";

  const device =
    /iPad|Tablet/.test(ua) ? "Tablet" :
    /Mobi|iPhone|Android/.test(ua) ? "Mobile" : "Desktop";

  return { browser, os, device };
}
