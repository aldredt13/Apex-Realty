import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { site as defaults } from "../data/site";
import { supabase } from "../lib/supabase";

// Runtime site info in the same shape the components already use.
export type SiteInfo = {
  name: string;
  legalName: string;
  tagline: string;
  domain: string;
  whatsapp: { display: string; link: string };
  phone: { display: string; link: string };
  email: string;
  social: { facebook: string; instagram: string; linkedin: string };
  about: string;
};

export const DEFAULT_ABOUT =
  "Team APEX powered by Real Estate Services is a results-driven real estate team helping homeowners buy, sell and rent — and guiding agents to successful careers across South Africa.";

const fallback: SiteInfo = {
  name: defaults.name,
  legalName: defaults.legalName,
  tagline: defaults.tagline,
  domain: defaults.domain,
  whatsapp: { ...defaults.whatsapp },
  phone: { ...defaults.phone },
  email: defaults.email,
  social: { ...defaults.social },
  about: DEFAULT_ABOUT,
};

type Ctx = { settings: SiteInfo; refresh: () => Promise<void> };

const SettingsContext = createContext<Ctx>({
  settings: fallback,
  refresh: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteInfo>(fallback);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return;
    setSettings({
      name: fallback.name,
      legalName: fallback.legalName,
      tagline: data.tagline || fallback.tagline,
      domain: data.domain || fallback.domain,
      whatsapp: {
        display: data.whatsapp_display || fallback.whatsapp.display,
        link: data.whatsapp_link || fallback.whatsapp.link,
      },
      phone: {
        display: data.phone_display || fallback.phone.display,
        link: data.phone_link || fallback.phone.link,
      },
      email: data.email || fallback.email,
      social: {
        facebook: data.facebook || "",
        instagram: data.instagram || "",
        linkedin: data.linkedin || "",
      },
      about: data.about || fallback.about,
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SiteInfo {
  return useContext(SettingsContext).settings;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettingsRefresh(): () => Promise<void> {
  return useContext(SettingsContext).refresh;
}
