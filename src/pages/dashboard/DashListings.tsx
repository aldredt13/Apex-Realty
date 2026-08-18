import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { deleteListingFolder } from "../../lib/imaging";
import type { Listing } from "../../lib/types";
import { formatPrice, formatDate } from "../../lib/format";
import Icon from "../../components/Icon";
import UsageCard from "../../components/UsageCard";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../context/AuthContext";

export default function DashListings() {
  const { profile, isOwner } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  // bumped after every (re)load so the storage meter re-reads usage
  const [refreshToken, setRefreshToken] = useState(0);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);

    // Agents only see what they created or were given; owners see everything.
    let assignedIds: string[] = [];
    if (!isOwner && profile) {
      const { data: rows } = await supabase
        .from("listing_assignments")
        .select("listing_id")
        .eq("agent_id", profile.id);
      assignedIds = (rows ?? []).map((r) => r.listing_id as string);
    }

    let query = supabase
      .from("listings")
      .select("*, agent:profiles!listings_agent_id_fkey(id, full_name, avatar_url, title, phone, email)")
      .order("created_at", { ascending: false });

    if (!isOwner && profile) {
      const ors = [`agent_id.eq.${profile.id}`];
      if (assignedIds.length) ors.push(`id.in.(${assignedIds.join(",")})`);
      query = query.or(ors.join(","));
    }

    const { data } = await query;
    setListings((data as Listing[]) ?? []);
    setLoading(false);
    setRefreshToken((n) => n + 1);
  }, [isOwner, profile]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(listing: Listing) {
    if (!supabase) return;
    if (!window.confirm(`Delete "${listing.title}"? This cannot be undone.`)) return;
    setDeleting(listing.id);
    setError("");
    try {
      // Delete the photos first — storage objects can only be removed via the
      // Storage API, so if we dropped the row first we'd lose the folder name
      // and the files would be orphaned forever.
      await deleteListingFolder(listing.id);

      const { error: dbError } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing.id);
      if (dbError) throw dbError;
    } catch (err) {
      setError(
        `Couldn't fully delete "${listing.title}": ${
          err instanceof Error ? err.message : "unknown error"
        }`
      );
    }
    setDeleting(null);
    load();
  }

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <h1>Listings</h1>
          <p>
            {isOwner
              ? "Create, edit and manage every property listing."
              : "Listings you've added or been assigned."}
          </p>
        </div>
        <Link to="/dashboard/listings/new" className="btn btn--gold">
          <Icon name="plus" /> New Listing
        </Link>
      </div>

      {isOwner && <UsageCard listingsCount={listings.length} refreshToken={refreshToken} />}

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <div className="dash-card">
          <div className="spinner" />
        </div>
      ) : listings.length === 0 ? (
        <div className="dash-empty">
          <Icon name="home" />
          <h3>No listings yet</h3>
          <p>Add your first property to get started.</p>
          <Link to="/dashboard/listings/new" className="btn btn--gold">
            <Icon name="plus" /> New Listing
          </Link>
        </div>
      ) : (
        <div className="dash-table">
          <div className="dash-row dash-row--head">
            <span>Property</span>
            <span>Agent</span>
            <span>Price</span>
            <span>Status</span>
            <span>Added</span>
            <span></span>
          </div>
          {listings.map((l) => (
            <div className="dash-row" key={l.id}>
              <div className="dash-prop">
                <div className="dash-thumb">
                  {l.images?.[0] ? (
                    <img src={l.images[0]} alt="" />
                  ) : (
                    <Icon name="image" />
                  )}
                </div>
                <div>
                  <b>{l.title}</b>
                  {l.location && <span>{l.location}</span>}
                </div>
              </div>
              <span data-label="Agent">
                <span className="dash-agent">
                  <Avatar url={l.agent?.avatar_url} name={l.agent?.full_name} size={26} />
                  {l.agent?.full_name || "Unassigned"}
                </span>
              </span>
              <span data-label="Price">{formatPrice(l.price, l.listing_type)}</span>
              <span data-label="Status">
                <span className={`pill pill--${l.status}`}>{l.status}</span>
              </span>
              <span data-label="Added">{formatDate(l.created_at)}</span>
              <div className="dash-rowactions">
                <Link to={`/properties/${l.slug}`} target="_blank" className="iconbtn" title="View">
                  <Icon name="eye" />
                </Link>
                <Link to={`/dashboard/listings/${l.id}/edit`} className="iconbtn" title="Edit">
                  <Icon name="edit" />
                </Link>
                <button
                  className="iconbtn iconbtn--danger"
                  onClick={() => remove(l)}
                  disabled={deleting === l.id}
                  title="Delete"
                >
                  <Icon name="trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
