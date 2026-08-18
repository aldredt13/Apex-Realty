import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import type { Submission, SubmissionType } from "../../lib/types";
import { formatDateTime } from "../../lib/format";
import Icon from "../../components/Icon";

const TYPE_LABEL: Record<SubmissionType, string> = {
  enquiry: "Property Enquiry",
  contact: "Contact",
  sell: "Seller Lead",
  join: "Agent Application",
};

type FilterKey = "all" | SubmissionType;
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "enquiry", label: "Enquiries" },
  { key: "contact", label: "Contact" },
  { key: "sell", label: "Sellers" },
  { key: "join", label: "Agents" },
];

export default function DashSubmissions() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Submission[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(sub: Submission) {
    const next = open === sub.id ? null : sub.id;
    setOpen(next);
    if (next && !sub.is_read && supabase) {
      await supabase.from("form_submissions").update({ is_read: true }).eq("id", sub.id);
      setItems((list) => list.map((s) => (s.id === sub.id ? { ...s, is_read: true } : s)));
    }
  }

  async function remove(id: string) {
    if (!supabase) return;
    if (!window.confirm("Delete this submission?")) return;
    await supabase.from("form_submissions").delete().eq("id", id);
    setItems((list) => list.filter((s) => s.id !== id));
  }

  const filtered = filter === "all" ? items : items.filter((s) => s.type === filter);
  const unread = items.filter((s) => !s.is_read).length;

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <h1>
            Submissions{" "}
            {unread > 0 && <span className="unread-badge">{unread} new</span>}
          </h1>
          <p>Enquiries, contact messages, seller leads and agent applications.</p>
        </div>
        <button className="btn btn--ghost" onClick={load}>
          <Icon name="refresh" /> Refresh
        </button>
      </div>

      <div className="lfilter">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`lfilter__btn${filter === f.key ? " is-active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="dash-card">
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="dash-empty">
          <Icon name="inbox" />
          <h3>No submissions</h3>
          <p>New form submissions from the website will appear here.</p>
        </div>
      ) : (
        <div className="subs">
          {filtered.map((s) => (
            <div key={s.id} className={`sub${s.is_read ? "" : " is-unread"}`}>
              <button className="sub__head" onClick={() => toggle(s)}>
                <span className="sub__type">{TYPE_LABEL[s.type] ?? s.type}</span>
                <span className="sub__name">{s.name}</span>
                {s.listing_title && (
                  <span className="sub__listing">
                    <Icon name="home" /> {s.listing_title}
                  </span>
                )}
                <span className="sub__date">{formatDateTime(s.created_at)}</span>
                <Icon name={open === s.id ? "chevron-left" : "chevron-right"} />
              </button>

              {open === s.id && (
                <div className="sub__body">
                  <div className="sub__contacts">
                    {s.email && (
                      <a href={`mailto:${s.email}`}>
                        <Icon name="mail" /> {s.email}
                      </a>
                    )}
                    {s.phone && (
                      <a href={`tel:${s.phone}`}>
                        <Icon name="phone" /> {s.phone}
                      </a>
                    )}
                  </div>
                  {s.message && <p className="sub__msg">{s.message}</p>}
                  {s.meta && Object.keys(s.meta).length > 0 && (
                    <ul className="sub__meta">
                      {Object.entries(s.meta).map(([k, v]) =>
                        v ? (
                          <li key={k}>
                            <b>{k}:</b> {v}
                          </li>
                        ) : null
                      )}
                    </ul>
                  )}
                  <button className="btn btn--ghost btn--sm" onClick={() => remove(s.id)}>
                    <Icon name="trash" /> Delete
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
