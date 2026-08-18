import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import Avatar from "../components/Avatar";
import EnquiryForm from "../components/EnquiryForm";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Listing as ListingT } from "../lib/types";
import { formatPrice, formatDate } from "../lib/format";
import { useSettings } from "../context/SettingsContext";

export default function Listing() {
  const { slug } = useParams();
  const settings = useSettings();
  const [listing, setListing] = useState<ListingT | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!supabase || !slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from("listings")
        .select(
          "*, agent:profiles!listings_agent_id_fkey(id, full_name, avatar_url, title, phone, email)"
        )
        .eq("slug", slug)
        .maybeSingle();
      if (!cancelled) {
        setListing((data as ListingT) ?? null);
        setActive(0);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const images = listing?.images ?? [];
  const count = images.length;

  const go = useCallback(
    (dir: number) => setActive((a) => (count ? (a + dir + count) % count : 0)),
    [count]
  );

  // Lightbox keyboard controls + scroll lock
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="lcard lcard--skeleton" style={{ height: 460, borderRadius: 20 }} />
        </div>
      </section>
    );
  }

  if (!listing) {
    return (
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container">
          <h1 style={{ textTransform: "uppercase" }}>Property not found</h1>
          <p style={{ maxWidth: 460, margin: "16px auto 28px" }}>
            {isSupabaseConfigured
              ? "This listing may have been sold or removed."
              : "Listings aren't available yet. Please check back soon."}
          </p>
          <Link to="/properties" className="btn btn--gold btn--lg">
            <Icon name="chevron-left" /> Back to Properties
          </Link>
        </div>
      </section>
    );
  }

  const sold = listing.status !== "available";
  const statusLabel = listing.status === "rented" ? "Rented" : "Sold";

  const specs = [
    listing.bedrooms != null && { icon: "bed", value: listing.bedrooms, label: "Bedrooms" },
    listing.bathrooms != null && { icon: "bath", value: listing.bathrooms, label: "Bathrooms" },
    listing.garages != null && { icon: "car", value: listing.garages, label: "Garages" },
    listing.size_sqm != null && { icon: "ruler", value: `${listing.size_sqm}`, label: "m² Size" },
    listing.property_type && { icon: "home", value: listing.property_type, label: "Type" },
  ].filter(Boolean) as { icon: "bed"; value: string | number; label: string }[];

  return (
    <>
      <section className="pagehero pagehero--slim">
        <div className="container pagehero__inner">
          <div className="crumbs">
            <Link to="/">Home</Link> <span>/</span>
            <Link to="/properties">Properties</Link> <span>/</span>
            <span>{listing.title}</span>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          {/* ---------- GALLERY ---------- */}
          <div className="gallery">
            <div
              className="gallery__main"
              onClick={() => count > 0 && setLightbox(true)}
            >
              {images[active] ? (
                <img src={images[active]} alt={listing.title} />
              ) : (
                <div className="lcard__placeholder" style={{ height: "100%" }}>
                  <Icon name="image" />
                </div>
              )}

              <div className="gallery__tags">
                <span className="badge badge--type">{listing.listing_type}</span>
                {listing.featured && (
                  <span className="badge badge--featured">
                    <Icon name="star" /> Featured
                  </span>
                )}
                {sold && <span className={`badge badge--${listing.status}`}>{statusLabel}</span>}
              </div>

              {count > 1 && (
                <>
                  <button
                    className="gallery__nav gallery__nav--prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(-1);
                    }}
                    aria-label="Previous photo"
                  >
                    <Icon name="chevron-left" />
                  </button>
                  <button
                    className="gallery__nav gallery__nav--next"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(1);
                    }}
                    aria-label="Next photo"
                  >
                    <Icon name="chevron-right" />
                  </button>
                </>
              )}

              {count > 0 && (
                <span className="gallery__count">
                  <Icon name="image" /> {active + 1} / {count}
                </span>
              )}
            </div>

            {count > 1 && (
              <div className="gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={img}
                    className={`gallery__thumb${i === active ? " is-active" : ""}`}
                    onClick={() => setActive(i)}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <img src={img} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---------- BODY ---------- */}
          <div className="listing-grid">
            <div className="listing-main">
              <div className="listing-titlebar">
                <div>
                  <h1>{listing.title}</h1>
                  {(listing.address || listing.location) && (
                    <div className="listing-loc">
                      <Icon name="pin" /> {listing.address || listing.location}
                    </div>
                  )}
                </div>
                <div className="listing-titlebar__price">
                  {formatPrice(listing.price, listing.listing_type)}
                  <small>{listing.listing_type}</small>
                </div>
              </div>

              {specs.length > 0 && (
                <div className="spec-tiles">
                  {specs.map((s) => (
                    <div className="spec-tile" key={s.label}>
                      <Icon name={s.icon} />
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {listing.description && (
                <div className="listing-section">
                  <h2>Description</h2>
                  <p>{listing.description}</p>
                </div>
              )}

              {listing.features && listing.features.length > 0 && (
                <div className="listing-section">
                  <h2>Features</h2>
                  <ul className="feature-chips">
                    {listing.features.map((f) => (
                      <li key={f}>
                        <Icon name="check" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ---------- SIDEBAR ---------- */}
            <aside className="listing-side">
              {listing.agent && (
                <div className="agent-card">
                  <Avatar
                    url={listing.agent.avatar_url}
                    name={listing.agent.full_name}
                    size={64}
                  />
                  <div className="agent-card__info">
                    <span className="agent-card__label">Marketed by</span>
                    <b>{listing.agent.full_name}</b>
                    {listing.agent.title && <span>{listing.agent.title}</span>}
                  </div>
                  {listing.agent.phone && (
                    <a
                      href={`tel:${listing.agent.phone.replace(/\s/g, "")}`}
                      className="agent-card__call"
                      aria-label={`Call ${listing.agent.full_name}`}
                    >
                      <Icon name="phone" />
                    </a>
                  )}
                </div>
              )}

              <div className="enquire-card">
                <div className="enquire-card__price">
                  {formatPrice(listing.price, listing.listing_type)}
                  <small>
                    {listing.listing_type}
                    {listing.location ? ` · ${listing.location}` : ""}
                  </small>
                </div>
                <h3>Interested in this property?</h3>
                <p>Send an enquiry and we'll get back to you quickly.</p>
                <EnquiryForm listingId={listing.id} listingTitle={listing.title} />
                <div className="enquire-card__or">or reach us directly</div>
                <a
                  href={settings.whatsapp.link}
                  className="btn btn--whatsapp btn--block"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" /> WhatsApp Us
                </a>
                <a href={settings.phone.link} className="btn btn--ghost btn--block" style={{ marginTop: 10 }}>
                  <Icon name="phone" /> {settings.phone.display}
                </a>
                <div className="enquire-meta">
                  <span>Ref: {listing.id.slice(0, 8).toUpperCase()}</span>
                  <span>Listed {formatDate(listing.created_at)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- LIGHTBOX ---------- */}
      {lightbox && count > 0 && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lightbox__close" aria-label="Close" onClick={() => setLightbox(false)}>
            <Icon name="close" />
          </button>
          {count > 1 && (
            <button
              className="lightbox__nav lightbox__nav--prev"
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
            >
              <Icon name="chevron-left" />
            </button>
          )}
          <img
            className="lightbox__img"
            src={images[active]}
            alt={listing.title}
            onClick={(e) => e.stopPropagation()}
          />
          {count > 1 && (
            <button
              className="lightbox__nav lightbox__nav--next"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
            >
              <Icon name="chevron-right" />
            </button>
          )}
          <span className="lightbox__count">
            {active + 1} / {count}
          </span>
        </div>
      )}
    </>
  );
}
