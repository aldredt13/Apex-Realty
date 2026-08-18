import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import ListingCard from "../components/ListingCard";
import Pagination from "../components/Pagination";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Listing, ListingType } from "../lib/types";
import { useSettings } from "../context/SettingsContext";

const PAGE_SIZE = 9;
type Filter = "all" | ListingType;

export default function Properties() {
  const settings = useSettings();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("listings")
      .select("*", { count: "exact" })
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filter !== "all") query = query.eq("listing_type", filter);

    const { data, count, error } = await query;
    if (!error) {
      setListings((data as Listing[]) ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => {
    load();
  }, [load]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const setFilterReset = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <>
      <section className="pagehero">
        <div className="container pagehero__inner">
          <div className="crumbs">
            <Link to="/">Home</Link> <span>/</span> <span>Properties</span>
          </div>
          <h1>
            Browse Our <span className="gold-text">Properties</span>
          </h1>
          <p>
            Explore homes for sale and to rent across South Africa. Found one you
            love? Enquire and we'll take care of the rest.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* filters */}
          <div className="lfilter">
            {(["all", "For Sale", "To Rent"] as Filter[]).map((f) => (
              <button
                key={f}
                className={`lfilter__btn${filter === f ? " is-active" : ""}`}
                onClick={() => setFilterReset(f)}
              >
                {f === "all" ? "All Properties" : f}
              </button>
            ))}
          </div>

          {isSupabaseConfigured && !loading && listings.length > 0 && (
            <p className="lcount">
              {total} {total === 1 ? "property" : "properties"}
              {filter !== "all" ? ` ${filter.toLowerCase()}` : " available"}
            </p>
          )}

          {!isSupabaseConfigured ? (
            <EmptyState
              title="Listings coming soon"
              text="Our property listings will appear here shortly. In the meantime, get in touch and we'll help you find what you're looking for."
              waLink={settings.whatsapp.link}
            />
          ) : loading ? (
            <div className="lgrid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="lcard lcard--skeleton" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              title="No properties to show yet"
              text="There are no listings in this category right now. Check back soon or contact us with your requirements."
              waLink={settings.whatsapp.link}
            />
          ) : (
            <>
              <div className="lgrid">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
              <Pagination page={page} pageCount={pageCount} onChange={setPage} />
            </>
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState({
  title,
  text,
  waLink,
}: {
  title: string;
  text: string;
  waLink: string;
}) {
  return (
    <div className="lempty">
      <div className="lempty__icon">
        <Icon name="home" />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <a href={waLink} className="btn btn--whatsapp" target="_blank" rel="noreferrer">
        <Icon name="whatsapp" /> Chat on WhatsApp
      </a>
    </div>
  );
}
