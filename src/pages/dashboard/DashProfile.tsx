import { useEffect, useState, type FormEvent } from "react";
import Icon from "../../components/Icon";
import AvatarUploader from "../../components/AvatarUploader";
import { useAuth } from "../../context/AuthContext";
import { updateMember } from "../../lib/team";

export default function DashProfile() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", username: "", title: "", phone: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        username: profile.username ?? "",
        title: profile.title ?? "",
        phone: profile.phone ?? "",
        avatar_url: profile.avatar_url ?? "",
      });
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="dash-page">
        <div className="spinner" />
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSaved(false);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await updateMember(profile.id, form);
    setSaving(false);
    if (res.error) setError(res.error);
    else {
      setSaved(true);
      refreshProfile();
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <h1>My Profile</h1>
          <p>Your photo and details appear on the listings you manage.</p>
        </div>
      </div>

      <form className="dash-card" style={{ maxWidth: 640 }} onSubmit={save}>
        <AvatarUploader
          userId={profile.id}
          value={form.avatar_url || null}
          name={form.full_name}
          onChange={(url) => {
            setForm((f) => ({ ...f, avatar_url: url }));
            setSaved(false);
          }}
        />

        <div className="form-grid" style={{ marginTop: 22 }}>
          <div className="field">
            <label htmlFor="p-name">Full name</label>
            <input id="p-name" value={form.full_name} onChange={set("full_name")} autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="p-username">Username</label>
            <input id="p-username" value={form.username} onChange={set("username")} autoComplete="username" placeholder="used to sign in" />
          </div>
          <div className="field">
            <label htmlFor="p-title">Job title</label>
            <input id="p-title" value={form.title} onChange={set("title")} placeholder="Property Practitioner" />
          </div>
          <div className="field">
            <label htmlFor="p-phone">Phone</label>
            <input id="p-phone" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+27 82 123 4567" />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={profile.email ?? ""} disabled />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="dash-actions">
          <button type="submit" className="btn btn--gold" disabled={saving}>
            {saving ? "Saving…" : "Save Profile"}
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
