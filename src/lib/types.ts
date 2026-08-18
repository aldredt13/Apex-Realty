// Database row shapes (kept in sync with supabase/schema.sql).

export type ListingType = "For Sale" | "To Rent";
export type ListingStatus = "available" | "sold" | "rented";

export const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Townhouse",
  "Vacant Land",
  "Commercial",
  "Farm / Smallholding",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export type UserRole = "owner" | "agent";

export type Profile = {
  id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  title: string | null;
  role: UserRole;
  /** super admin — private login audit access */
  is_super: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Listing = {
  id: string;
  created_at: string;
  updated_at: string;
  agent_id: string | null;
  /** joined profile row (present when the query selects it) */
  agent?: Pick<Profile, "id" | "full_name" | "avatar_url" | "title" | "phone" | "email"> | null;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  listing_type: ListingType;
  property_type: string | null;
  status: ListingStatus;
  location: string | null;
  address: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  size_sqm: number | null;
  features: string[] | null;
  images: string[] | null;
  featured: boolean;
};

// Fields the dashboard form edits (id/timestamps are managed by the DB).
export type ListingInput = Omit<Listing, "created_at" | "updated_at" | "agent">;

export type SubmissionType = "contact" | "sell" | "join" | "enquiry";

export type Submission = {
  id: string;
  created_at: string;
  type: SubmissionType;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  listing_id: string | null;
  listing_title: string | null;
  meta: Record<string, string> | null;
  is_read: boolean;
};

export type SiteSettings = {
  id: number;
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
  updated_at: string;
};
