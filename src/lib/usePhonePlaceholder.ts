import { useEffect, useState } from "react";
import { detectCountry, formatFor, type PhoneFormat } from "./geo";

// Module-level cache so multiple forms share a single lookup per page load.
let cached: PhoneFormat | null = null;
let inFlight: Promise<PhoneFormat> | null = null;

function resolve(): Promise<PhoneFormat> {
  if (cached) return Promise.resolve(cached);
  if (!inFlight) {
    inFlight = detectCountry().then((country) => {
      cached = formatFor(country);
      return cached;
    });
  }
  return inFlight;
}

/**
 * Returns a phone placeholder matching the visitor's region, e.g.
 * "+27 82 123 4567" in South Africa or "+44 7400 123456" in the UK.
 * Starts with the South African default and updates once detection completes.
 */
export function usePhonePlaceholder(): PhoneFormat {
  const [format, setFormat] = useState<PhoneFormat>(cached ?? formatFor("ZA"));

  useEffect(() => {
    let alive = true;
    resolve().then((f) => {
      if (alive) setFormat(f);
    });
    return () => {
      alive = false;
    };
  }, []);

  return format;
}
