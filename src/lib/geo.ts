// Detects the visitor's country (IP geolocation, with graceful fallbacks) so we
// can show a phone placeholder that starts with their own dialling code.

export type PhoneFormat = {
  /** e.g. "+27 82 123 4567" */
  placeholder: string;
  /** e.g. "+27" */
  dialCode: string;
  /** ISO-2, e.g. "ZA" */
  country: string;
};

// Sample national number patterns per country, so the placeholder looks real.
const FORMATS: Record<string, { dial: string; sample: string }> = {
  ZA: { dial: "+27", sample: "82 123 4567" },
  NA: { dial: "+264", sample: "81 123 4567" },
  BW: { dial: "+267", sample: "71 123 456" },
  ZW: { dial: "+263", sample: "71 234 5678" },
  MZ: { dial: "+258", sample: "82 123 4567" },
  GB: { dial: "+44", sample: "7400 123456" },
  US: { dial: "+1", sample: "(555) 123-4567" },
  CA: { dial: "+1", sample: "(555) 123-4567" },
  AU: { dial: "+61", sample: "412 345 678" },
  NZ: { dial: "+64", sample: "21 123 4567" },
  IE: { dial: "+353", sample: "85 123 4567" },
  DE: { dial: "+49", sample: "151 23456789" },
  FR: { dial: "+33", sample: "6 12 34 56 78" },
  NL: { dial: "+31", sample: "6 12345678" },
  ES: { dial: "+34", sample: "612 34 56 78" },
  PT: { dial: "+351", sample: "912 345 678" },
  IT: { dial: "+39", sample: "312 345 6789" },
  AE: { dial: "+971", sample: "50 123 4567" },
  IN: { dial: "+91", sample: "98765 43210" },
  NG: { dial: "+234", sample: "802 123 4567" },
  KE: { dial: "+254", sample: "712 345 678" },
};

// The site is South African — sensible default if detection fails.
const DEFAULT_COUNTRY = "ZA";

export function formatFor(country: string): PhoneFormat {
  const code = country?.toUpperCase();
  const entry = FORMATS[code] ?? FORMATS[DEFAULT_COUNTRY];
  return {
    placeholder: `${entry.dial} ${entry.sample}`,
    dialCode: entry.dial,
    country: FORMATS[code] ? code : DEFAULT_COUNTRY,
  };
}

/** Guess the country from the browser locale (e.g. "en-ZA" -> "ZA"). */
function countryFromLocale(): string | null {
  if (typeof navigator === "undefined") return null;
  const langs = [navigator.language, ...(navigator.languages ?? [])];
  for (const l of langs) {
    const region = l?.split("-")[1];
    if (region && FORMATS[region.toUpperCase()]) return region.toUpperCase();
  }
  return null;
}

const CACHE_KEY = "apex_geo_country";

/**
 * Resolve the visitor's country. Tries a cached value, then the browser locale
 * (instant, no network), then a free IP-geolocation lookup. Always resolves —
 * never throws — falling back to the site's home country.
 */
export async function detectCountry(): Promise<string> {
  // 1. cached from a previous visit
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return cached;
  } catch {
    /* storage unavailable — ignore */
  }

  // 2. IP geolocation (most accurate for "where are you actually browsing from")
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const code = (data?.country_code as string | undefined)?.toUpperCase();
      if (code) {
        try {
          sessionStorage.setItem(CACHE_KEY, code);
        } catch {
          /* ignore */
        }
        return code;
      }
    }
  } catch {
    /* offline / blocked / timed out — fall through */
  }

  // 3. browser locale, else the default
  return countryFromLocale() ?? DEFAULT_COUNTRY;
}
