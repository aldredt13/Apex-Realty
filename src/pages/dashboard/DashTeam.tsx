import { useEffect, useState, useCallback, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import Icon from "../../components/Icon";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../context/AuthContext";
import {
  listTeam,
  createTeamMember,
  updateMember,
  resetMemberPassword,
  setMemberActive,
} from "../../lib/team";
import type { Profile } from "../../lib/types";

const blank = {
  full_name: "",
  username: "",
  email: "",
  password: "",
  phone: "",
  title: "",
  role: "agent" as "agent" | "owner",
};

export default function DashTeam() {
  const { isOwner, adminReady, profile } = useAuth();
  const [team, setTeam] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setTeam(await listTeam());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Agents shouldn't reach this page at all.
  if (adminReady && !isOwner) return <Navigate to="/dashboard" replace />;

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const res = await createTeamMember(form);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setNotice(`${form.full_name} can now sign in with the username "${form.username}"`);
    setForm(blank);
    setShowForm(false);
    load();
  };

  async function changeRole(m: Profile, role: "owner" | "agent") {
    await updateMember(m.id, { role });
    load();
  }

  async function toggleActive(m: Profile) {
    await setMemberActive(m.id, !m.active);
    load();
  }

  async function resetPassword(m: Profile) {
    const pw = window.prompt(`New password for ${m.full_name || m.email}:`);
    if (!pw) return;
    const res = await resetMemberPassword(m.id, pw);
    setNotice(res.error ? "" : `Password updated for ${m.full_name || m.email}.`);
    setError(res.error ?? "");
  }

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <h1>Team</h1>
          <p>
            Create sub-accounts for your agents. Agents only see the listings and
            enquiries assigned to them — main accounts see everything.
          </p>
        </div>
        <button className="btn btn--gold" onClick={() => setShowForm((s) => !s)}>
          <Icon name={showForm ? "close" : "plus"} />
          {showForm ? "Cancel" : "Add Team Member"}
        </button>
      </div>

      {notice && (
        <div className="alert alert--info" style={{ marginBottom: 18 }}>
          {notice}
        </div>
      )}
      {error && <p className="form-error">{error}</p>}

      {showForm && (
        <form className="dash-card" onSubmit={submit}>
          <h2 className="dash-sub">New team member</h2>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="t-name">Full name *</label>
              <input id="t-name" required value={form.full_name} onChange={set("full_name")} placeholder="e.g. Carin Grobler" />
            </div>
            <div className="field">
              <label htmlFor="t-title">Job title</label>
              <input id="t-title" value={form.title} onChange={set("title")} placeholder="Property Practitioner" />
            </div>
            <div className="field">
              <label htmlFor="t-username">Username *</label>
              <input id="t-username" required autoComplete="off" value={form.username} onChange={set("username")} placeholder="e.g. carin" />
              <small className="field__hint">They'll sign in with this.</small>
            </div>
            <div className="field">
              <label htmlFor="t-email">Email *</label>
              <input id="t-email" type="email" required autoComplete="off" value={form.email} onChange={set("email")} placeholder="agent@teamapex.co.za" />
            </div>
            <div className="field">
              <label htmlFor="t-phone">Phone</label>
              <input id="t-phone" value={form.phone} onChange={set("phone")} placeholder="+27 82 123 4567" />
            </div>
            <div className="field">
              <label htmlFor="t-pass">Temporary password *</label>
              <input id="t-pass" required minLength={6} autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" />
            </div>
            <div className="field">
              <label htmlFor="t-role">Account type</label>
              <select id="t-role" value={form.role} onChange={set("role")}>
                <option value="agent">Agent — sees only their own work</option>
                <option value="owner">Main account — sees everything</option>
              </select>
            </div>
          </div>
          <div className="dash-actions">
            <button type="submit" className="btn btn--gold" disabled={busy}>
              {busy ? "Creating…" : "Create Account"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="dash-card">
          <div className="spinner" />
        </div>
      ) : (
        <div className="team-grid">
          {team.map((m) => (
            <div className={`team-card${m.active ? "" : " is-inactive"}`} key={m.id}>
              <Avatar url={m.avatar_url} name={m.full_name} size={56} />
              <div className="team-card__body">
                <b>
                  {m.full_name || m.email}
                  {m.id === profile?.id && <span className="team-you">you</span>}
                </b>
                <span className="team-card__title">{m.title || "Team member"}</span>
                {m.username && <span className="team-card__user">@{m.username}</span>}
                <span className="team-card__email">{m.email}</span>
                <span className={`pill pill--${m.role === "owner" ? "available" : "rented"}`}>
                  {m.role === "owner" ? "Main account" : "Agent"}
                </span>
                {!m.active && <span className="pill pill--sold">Disabled</span>}
              </div>
              {m.id !== profile?.id && (
                <div className="team-card__tools">
                  <button
                    className="iconbtn"
                    title={m.role === "owner" ? "Make agent" : "Make main account"}
                    onClick={() => changeRole(m, m.role === "owner" ? "agent" : "owner")}
                  >
                    <Icon name={m.role === "owner" ? "users" : "crown"} />
                  </button>
                  <button className="iconbtn" title="Reset password" onClick={() => resetPassword(m)}>
                    <Icon name="lock" />
                  </button>
                  <button
                    className={`iconbtn${m.active ? " iconbtn--danger" : ""}`}
                    title={m.active ? "Disable account" : "Enable account"}
                    onClick={() => toggleActive(m)}
                  >
                    <Icon name={m.active ? "close" : "check"} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
