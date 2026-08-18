import { useEffect, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { newListingId } from "../../lib/imaging";
import { uniqueSlug, formatPrice } from "../../lib/format";
import { PROPERTY_TYPES, type Listing, type Profile } from "../../lib/types";
import ImageUploader from "../../components/ImageUploader";
import Icon from "../../components/Icon";
import type { IconName } from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { listTeam } from "../../lib/team";

type FormState = {
  title: string;
  listing_type: string;
  property_type: string;
  status: string;
  price: string;
  location: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  size_sqm: string;
  featured: boolean;
  description: string;
};

const blank: FormState = {
  title: "",
  listing_type: "For Sale",
  property_type: "House",
  status: "available",
  price: "",
  location: "",
  address: "",
  bedrooms: "",
  bathrooms: "",
  garages: "",
  size_sqm: "",
  featured: false,
  description: "",
};

const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v));
const intOrNull = (v: string) => (v.trim() === "" ? null : parseInt(v, 10));

const SPECS: { key: keyof FormState; label: string; icon: IconName }[] = [
  { key: "bedrooms", label: "Bedrooms", icon: "bed" },
  { key: "bathrooms", label: "Bathrooms", icon: "bath" },
  { key: "garages", label: "Garages", icon: "car" },
  { key: "size_sqm", label: "Size (m²)", icon: "ruler" },
];

const STATUSES = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
];

/** A numbered step block, so the form reads as a sequence rather than a wall. */
function Section({
  step,
  icon,
  title,
  hint,
  children,
}: {
  step: number;
  icon: IconName;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="fsection">
      <header className="fsection__head">
        <span className="fsection__step">{step}</span>
        <div>
          <h2>
            <Icon name={icon} /> {title}
          </h2>
          {hint && <p>{hint}</p>}
        </div>
      </header>
      <div className="fsection__body">{children}</div>
    </section>
  );
}

export default function DashListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { profile, isOwner } = useAuth();
  const [listingId] = useState(() => id ?? newListingId());
  const [form, setForm] = useState<FormState>(blank);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureDraft, setFeatureDraft] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [team, setTeam] = useState<Profile[]>([]);
  const [agentId, setAgentId] = useState<string>("");

  // Owners can hand a listing to any agent; agents always own their own.
  useEffect(() => {
    if (isOwner) listTeam().then(setTeam);
  }, [isOwner]);

  useEffect(() => {
    if (!isEdit && profile) setAgentId(profile.id);
  }, [isEdit, profile]);

  useEffect(() => {
    async function load() {
      if (!isEdit || !supabase || !id) return;
      const { data } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
      if (data) {
        const l = data as Listing;
        setImages(l.images ?? []);
        setAgentId(l.agent_id ?? "");
        setFeatures(l.features ?? []);
        setForm({
          title: l.title,
          listing_type: l.listing_type,
          property_type: l.property_type ?? "House",
          status: l.status,
          price: l.price?.toString() ?? "",
          location: l.location ?? "",
          address: l.address ?? "",
          bedrooms: l.bedrooms?.toString() ?? "",
          bathrooms: l.bathrooms?.toString() ?? "",
          garages: l.garages?.toString() ?? "",
          size_sqm: l.size_sqm?.toString() ?? "",
          featured: l.featured,
          description: l.description ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [id, isEdit]);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const val =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  function addFeature() {
    const v = featureDraft.trim();
    if (!v) return;
    if (!features.some((f) => f.toLowerCase() === v.toLowerCase())) {
      setFeatures((list) => [...list, v]);
    }
    setFeatureDraft("");
  }

  function featureKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFeature();
    } else if (e.key === "Backspace" && !featureDraft && features.length) {
      setFeatures((list) => list.slice(0, -1));
    }
  }

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!form.title.trim()) {
      setError("Please add a property title.");
      return;
    }
    setSaving(true);
    setError("");

    const record = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      price: numOrNull(form.price),
      listing_type: form.listing_type,
      property_type: form.property_type,
      status: form.status,
      location: form.location.trim() || null,
      address: form.address.trim() || null,
      bedrooms: intOrNull(form.bedrooms),
      bathrooms: intOrNull(form.bathrooms),
      garages: intOrNull(form.garages),
      size_sqm: numOrNull(form.size_sqm),
      featured: form.featured,
      features,
      images,
      // Agents always own what they create; owners may assign to anyone.
      agent_id: (isOwner ? agentId : profile?.id) || null,
    };

    let dbError;
    if (isEdit) {
      const { error } = await supabase
        .from("listings")
        .update({ ...record, updated_at: new Date().toISOString() })
        .eq("id", id);
      dbError = error;
    } else {
      const { error } = await supabase
        .from("listings")
        .insert({ id: listingId, slug: uniqueSlug(form.title), ...record });
      dbError = error;
    }

    setSaving(false);
    if (dbError) setError(dbError.message);
    else navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="dash-page">
        <div className="spinner" />
      </div>
    );
  }

  const cover = images[0];
  // rough "how complete is this listing" indicator
  const filled = [
    form.title,
    form.price,
    form.location,
    images.length ? "y" : "",
    form.description,
  ].filter(Boolean).length;

  return (
    <div className="dash-page dash-page--wide">
      <div className="dash-head">
        <div>
          <Link to="/dashboard" className="dash-back">
            <Icon name="chevron-left" /> Back to listings
          </Link>
          <h1>{isEdit ? "Edit Listing" : "New Listing"}</h1>
          <p>
            {isEdit
              ? "Update the details and save your changes."
              : "Add the property details, then publish it to the website."}
          </p>
        </div>
      </div>

      <form onSubmit={save} className="lform">
        {/* ─────────── MAIN COLUMN ─────────── */}
        <div className="lform__main">
          <Section
            step={1}
            icon="image"
            title="Photos"
            hint="The first photo is the cover. Use the arrows to reorder."
          >
            <ImageUploader listingId={listingId} value={images} onChange={setImages} />
          </Section>

          <Section step={2} icon="home" title="The basics">
            <div className="field">
              <label htmlFor="f-title">Property title *</label>
              <input
                id="f-title"
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Modern 3 Bedroom Family Home"
                required
              />
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label>Listing type</label>
              <div className="segmented">
                {["For Sale", "To Rent"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={form.listing_type === t ? "is-active" : ""}
                    onClick={() => setForm((f) => ({ ...f, listing_type: t }))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field">
                <label htmlFor="f-price">
                  Price {form.listing_type === "To Rent" && <em>(per month)</em>}
                </label>
                <div className="input-affix">
                  <span className="input-affix__pre">R</span>
                  <input
                    id="f-price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={set("price")}
                    placeholder="1 500 000"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="f-ptype">Property type</label>
                <select id="f-ptype" value={form.property_type} onChange={set("property_type")}>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="f-loc">Area / suburb</label>
                <input
                  id="f-loc"
                  value={form.location}
                  onChange={set("location")}
                  placeholder="e.g. Centurion"
                />
              </div>
              <div className="field">
                <label htmlFor="f-addr">
                  Full address <em>(optional)</em>
                </label>
                <input
                  id="f-addr"
                  value={form.address}
                  onChange={set("address")}
                  placeholder="12 Main Road, Centurion"
                />
              </div>
            </div>
          </Section>

          <Section step={3} icon="ruler" title="Specifications">
            <div className="spec-inputs">
              {SPECS.map((s) => (
                <div className="spec-input" key={s.key}>
                  <Icon name={s.icon} />
                  <label htmlFor={`f-${s.key}`}>{s.label}</label>
                  <input
                    id={`f-${s.key}`}
                    type="number"
                    min="0"
                    value={form[s.key] as string}
                    onChange={set(s.key)}
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
          </Section>

          <Section step={4} icon="doc" title="Description &amp; features">
            <div className="field">
              <label htmlFor="f-desc">
                Description
                <span className="char-count">{form.description.length} characters</span>
              </label>
              <textarea
                id="f-desc"
                rows={8}
                value={form.description}
                onChange={set("description")}
                placeholder="Describe the property — the layout, standout features, the area, and why a buyer would love it…"
              />
            </div>

            <div className="field" style={{ marginTop: 18 }}>
              <label htmlFor="f-feat">Features</label>
              <div className="chip-input">
                {features.map((f) => (
                  <span className="chip" key={f}>
                    {f}
                    <button
                      type="button"
                      onClick={() => setFeatures((list) => list.filter((x) => x !== f))}
                      aria-label={`Remove ${f}`}
                    >
                      <Icon name="close" />
                    </button>
                  </span>
                ))}
                <input
                  id="f-feat"
                  value={featureDraft}
                  onChange={(e) => setFeatureDraft(e.target.value)}
                  onKeyDown={featureKey}
                  onBlur={addFeature}
                  placeholder={
                    features.length ? "Add another…" : "Fibre ready, pet friendly, solar geyser…"
                  }
                />
              </div>
              <small className="field__hint">Press Enter after each feature.</small>
            </div>
          </Section>
        </div>

        {/* ─────────── SIDEBAR ─────────── */}
        <aside className="lform__side">
          <div className="lform__sticky">
            {/* live preview of the website card */}
            <div className="preview-card">
              <div className="preview-card__media">
                {cover ? (
                  <img src={cover} alt="" />
                ) : (
                  <div className="preview-card__empty">
                    <Icon name="image" />
                    <span>No photo yet</span>
                  </div>
                )}
                <span className="badge badge--type">{form.listing_type}</span>
                {form.featured && (
                  <span className="badge badge--featured preview-card__feat">
                    <Icon name="star" /> Featured
                  </span>
                )}
              </div>
              <div className="preview-card__body">
                <b>{form.title || "Untitled property"}</b>
                <span className="preview-card__price">
                  {formatPrice(numOrNull(form.price), form.listing_type)}
                </span>
                {form.location && (
                  <span className="preview-card__loc">
                    <Icon name="pin" /> {form.location}
                  </span>
                )}
                <div className="preview-card__specs">
                  {form.bedrooms && (
                    <span>
                      <Icon name="bed" /> {form.bedrooms}
                    </span>
                  )}
                  {form.bathrooms && (
                    <span>
                      <Icon name="bath" /> {form.bathrooms}
                    </span>
                  )}
                  {form.garages && (
                    <span>
                      <Icon name="car" /> {form.garages}
                    </span>
                  )}
                  {form.size_sqm && (
                    <span>
                      <Icon name="ruler" /> {form.size_sqm}m²
                    </span>
                  )}
                </div>
              </div>
              <span className="preview-card__tag">Live preview</span>
            </div>

            {/* publish panel */}
            <div className="publish-card">
              <div className="field">
                <label htmlFor="f-status">Status</label>
                <select id="f-status" value={form.status} onChange={set("status")}>
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {isOwner && (
                <div className="field" style={{ marginTop: 14 }}>
                  <label htmlFor="f-agent">Assigned agent</label>
                  <select id="f-agent" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                    <option value="">— Unassigned —</option>
                    {team
                      .filter((t) => t.active)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.full_name || t.email}
                          {t.role === "owner" ? " (main)" : ""}
                        </option>
                      ))}
                  </select>
                  <small className="field__hint">
                    Their photo shows on the listing and they receive its enquiries.
                  </small>
                </div>
              )}

              <label className="toggle-line">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} />
                <span>
                  <b>Feature this listing</b>
                  <small>Shown first on the website</small>
                </span>
              </label>

              <div className="publish-card__meter">
                <span>
                  {images.length} photo{images.length === 1 ? "" : "s"} · {features.length} feature
                  {features.length === 1 ? "" : "s"}
                </span>
                <div className="meter">
                  <div
                    className="meter__fill meter__fill--ok"
                    style={{ width: `${(filled / 5) * 100}%` }}
                  />
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn btn--gold btn--block btn--lg" disabled={saving}>
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Publish Listing"}
              </button>
              <Link to="/dashboard" className="btn btn--ghost btn--block" style={{ marginTop: 10 }}>
                Cancel
              </Link>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
