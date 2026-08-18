import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { useSettingsRefresh } from "../../context/SettingsContext";
import Icon from "../../components/Icon";

type Form = {
  whatsapp_display: string;
  whatsapp_link: string;
  phone_display: string;
  phone_link: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  domain: string;
  tagline: string;
  about: string;
};

const empty: Form = {
  whatsapp_display: "",
  whatsapp_link: "",
  phone_display: "",
  phone_link: "",
  email: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  domain: "",
  tagline: "",
  about: "",
};

export default function DashSettings() {
  const refreshSettings = useSettingsRefresh();
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!supabase) return;
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        setForm({
          whatsapp_display: data.whatsapp_display ?? "",
          whatsapp_link: data.whatsapp_link ?? "",
          phone_display: data.phone_display ?? "",
          phone_link: data.phone_link ?? "",
          email: data.email ?? "",
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
          linkedin: data.linkedin ?? "",
          domain: data.domain ?? "",
          tagline: data.tagline ?? "",
          about: data.about ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const set = (key: keyof Form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError("");
    const { data, error } = await supabase
      .from("site_settings")
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select();
    setSaving(false);
    if (error) {
      setError(error.message);
    } else if (!data || data.length === 0) {
      // Update succeeded with 0 rows -> RLS blocked it silently.
      setError(
        "Changes didn't save — the update was blocked by security rules. Your login email needs to be in the 'admins' table and the site_settings update policy must exist. Run the fix SQL, then try again."
      );
    } else {
      setSaved(true);
      refreshSettings();
    }
  };

  if (loading) {
    return (
      <div className="dash-page">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <h1>Site Settings</h1>
          <p>Update the contact details and social links shown across the website.</p>
        </div>
      </div>

      <form onSubmit={save} className="dash-card" style={{ maxWidth: 760 }}>
        <h2 className="dash-sub">Contact</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="s-wad">WhatsApp number (shown)</label>
            <input id="s-wad" value={form.whatsapp_display} onChange={set("whatsapp_display")} placeholder="063 482 8664" />
          </div>
          <div className="field">
            <label htmlFor="s-wal">WhatsApp link (wa.me)</label>
            <input id="s-wal" value={form.whatsapp_link} onChange={set("whatsapp_link")} placeholder="https://wa.me/27634828664" />
          </div>
          <div className="field">
            <label htmlFor="s-phd">Phone number (shown)</label>
            <input id="s-phd" value={form.phone_display} onChange={set("phone_display")} placeholder="063 482 8664" />
          </div>
          <div className="field">
            <label htmlFor="s-phl">Phone link (tel:)</label>
            <input id="s-phl" value={form.phone_link} onChange={set("phone_link")} placeholder="tel:+27634828664" />
          </div>
          <div className="field field--full">
            <label htmlFor="s-email">Email</label>
            <input id="s-email" type="email" value={form.email} onChange={set("email")} placeholder="info@teamapex.co.za" />
          </div>
        </div>

        <h2 className="dash-sub">Social links</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="s-fb">Facebook URL</label>
            <input id="s-fb" value={form.facebook} onChange={set("facebook")} placeholder="https://facebook.com/…" />
          </div>
          <div className="field">
            <label htmlFor="s-ig">Instagram URL</label>
            <input id="s-ig" value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/…" />
          </div>
          <div className="field">
            <label htmlFor="s-li">LinkedIn URL</label>
            <input id="s-li" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/…" />
          </div>
          <div className="field">
            <label htmlFor="s-dom">Website domain</label>
            <input id="s-dom" value={form.domain} onChange={set("domain")} placeholder="www.teamapex.co.za" />
          </div>
        </div>

        <h2 className="dash-sub">Brand</h2>
        <div className="form-grid">
          <div className="field field--full">
            <label htmlFor="s-tag">Tagline</label>
            <input id="s-tag" value={form.tagline} onChange={set("tagline")} placeholder="We make Real Estate a Breeze" />
          </div>
          <div className="field field--full">
            <label htmlFor="s-about">About (footer / about page)</label>
            <textarea id="s-about" value={form.about} onChange={set("about")} rows={4} />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="dash-actions">
          <button type="submit" className="btn btn--gold btn--lg" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && (
            <span className="saved-badge">
              <Icon name="check-circle" /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
