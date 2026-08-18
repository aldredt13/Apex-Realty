import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import {
  listLoginEvents,
  clearLoginEvent,
  clearLoginEvents,
  describeDevice,
  toCsv,
  type LoginEvent,
} from "../../lib/loginAudit";
import { formatDateTime } from "../../lib/format";

export default function DashSecurity() {
  const { isSuper, adminReady } = useAuth();
  const [events, setEvents] = useState<LoginEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [only, setOnly] = useState<"all" | "success" | "failed">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setEvents(await listLoginEvents());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Hard gate — the database also refuses to return rows to anyone else.
  if (adminReady && !isSuper) return <Navigate to="/dashboard" replace />;

  const filtered = events.filter((e) => {
    if (only === "success" && !e.success) return false;
    if (only === "failed" && e.success) return false;
    if (!q.trim()) return true;
    const hay = `${e.email} ${e.ip} ${e.city} ${e.country} ${e.user_agent}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const uniqueIps = new Set(events.map((e) => e.ip).filter(Boolean)).size;
  const uniqueUsers = new Set(events.map((e) => e.email).filter(Boolean)).size;
  const failedCount = events.filter((e) => !e.success).length;

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apex-login-activity-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function clearAll(onlyFailed: boolean) {
    const what = onlyFailed ? "all failed attempts" : "the entire login history";
    if (!window.confirm(`Delete ${what}? This cannot be undone.`)) return;
    await clearLoginEvents(onlyFailed);
    load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this login record?")) return;
    await clearLoginEvent(id);
    load();
  }

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <h1>
            Login Activity <span className="private-tag">Private</span>
          </h1>
          <p>
            Sign-ins to the dashboard, with the IP address and device each one
            came from. Only you can see this page.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn--ghost btn--sm" onClick={load}>
            <Icon name="refresh" /> Refresh
          </button>
          <button className="btn btn--ghost btn--sm" onClick={exportCsv} disabled={filtered.length === 0}>
            <Icon name="doc" /> Export CSV
          </button>
          {failedCount > 0 && (
            <button className="btn btn--ghost btn--sm" onClick={() => clearAll(true)}>
              <Icon name="trash" /> Clear failed
            </button>
          )}
        </div>
      </div>

      <div className="usage" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="usage__stats">
          <div className="usage__stat">
            <b>{events.length}</b>
            <span>Sign-ins</span>
          </div>
        </div>
        <div className="usage__stats">
          <div className="usage__stat">
            <b>{uniqueUsers}</b>
            <span>Accounts</span>
          </div>
        </div>
        <div className="usage__stats">
          <div className="usage__stat">
            <b>{uniqueIps}</b>
            <span>IP addresses</span>
          </div>
        </div>
        <div className="usage__stats">
          <div className="usage__stat">
            <b style={{ color: failedCount ? "#c0392b" : undefined }}>{failedCount}</b>
            <span>Failed attempts</span>
          </div>
        </div>
      </div>

      <div className="lfilter">
        {(["all", "success", "failed"] as const).map((f) => (
          <button
            key={f}
            className={`lfilter__btn${only === f ? " is-active" : ""}`}
            onClick={() => setOnly(f)}
          >
            {f === "all" ? "All" : f === "success" ? "Successful" : "Failed"}
          </button>
        ))}
      </div>

      <div className="field" style={{ maxWidth: 340, marginBottom: 18 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email, IP, city or device…"
        />
      </div>

      {loading ? (
        <div className="dash-card">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="dash-empty">
          <Icon name="shield" />
          <h3>No sign-ins recorded</h3>
          <p>Dashboard logins will be listed here.</p>
        </div>
      ) : (
        <div className="dash-table">
          <div className="dash-row dash-row--head login-row">
            <span>Account</span>
            <span>IP address</span>
            <span>Location</span>
            <span>Device</span>
            <span>When</span>
            <span></span>
          </div>
          {filtered.map((e) => {
            const d = describeDevice(e.user_agent);
            return (
              <div className="dash-row login-row" key={e.id}>
                <span data-label="Account">
                  <b style={{ color: "var(--navy-800)" }}>{e.email ?? "—"}</b>
                  <span className="login-tags">
                    <span className={`pill pill--${e.success ? "available" : "sold"}`}>
                      {e.success ? "Success" : "Failed"}
                    </span>
                    {e.success && e.is_new_device && (
                      <span className="pill pill--rented">New device</span>
                    )}
                  </span>
                </span>
                <span data-label="IP">
                  <code className="ip-chip">{e.ip ?? "unknown"}</code>
                </span>
                <span data-label="Location">
                  {[e.city, e.region, e.country].filter(Boolean).join(", ") || "—"}
                </span>
                <span data-label="Device" title={e.user_agent ?? ""}>
                  {d.browser} · {d.os} · {d.device}
                </span>
                <span data-label="When">{formatDateTime(e.created_at)}</span>
                <div className="dash-rowactions">
                  <button
                    className="iconbtn iconbtn--danger"
                    onClick={() => remove(e.id)}
                    title="Delete record"
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
