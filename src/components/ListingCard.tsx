import { Link } from "react-router-dom";
import Icon from "./Icon";
import type { Listing } from "../lib/types";
import { formatPrice } from "../lib/format";

export default function ListingCard({ listing }: { listing: Listing }) {
  const cover = listing.images?.[0];
  const sold = listing.status !== "available";

  return (
    <Link to={`/properties/${listing.slug}`} className="lcard">
      <div className="lcard__media">
        {cover ? (
          <img src={cover} alt={listing.title} loading="lazy" />
        ) : (
          <div className="lcard__placeholder">
            <Icon name="image" />
          </div>
        )}
        <div className="lcard__tags">
          <span className="lcard__type">{listing.listing_type}</span>
          {listing.featured && (
            <span className="lcard__feat">
              <Icon name="star" /> Featured
            </span>
          )}
        </div>
        {sold && (
          <span className="lcard__status">
            {listing.status === "rented" ? "Rented" : "Sold"}
          </span>
        )}
        <span className="lcard__price">
          {formatPrice(listing.price, listing.listing_type)}
        </span>
      </div>
      <div className="lcard__body">
        <h3 className="lcard__title">{listing.title}</h3>
        {listing.location && (
          <div className="lcard__loc">
            <Icon name="pin" /> {listing.location}
          </div>
        )}
        <div className="lcard__meta">
          {listing.bedrooms != null && (
            <span>
              <Icon name="bed" /> {listing.bedrooms}
            </span>
          )}
          {listing.bathrooms != null && (
            <span>
              <Icon name="bath" /> {listing.bathrooms}
            </span>
          )}
          {listing.garages != null && (
            <span>
              <Icon name="car" /> {listing.garages}
            </span>
          )}
          {listing.size_sqm != null && (
            <span>
              <Icon name="ruler" /> {listing.size_sqm} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
