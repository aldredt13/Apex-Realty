// Central place for all editable business details.
// Update these values to change contact info, areas, etc. across the whole site.

export const site = {
  name: "Team APEX",
  legalName: "Team APEX powered by Real Estate Services",
  tagline: "We make Real Estate a Breeze",
  domain: "www.teamapex.co.za",

  // Contact details
  whatsapp: {
    display: "063 482 8664",
    // international format for wa.me links (SA: drop the leading 0, prefix 27)
    link: "https://wa.me/27634828664",
  },
  phone: {
    display: "063 482 8664",
    link: "tel:+27634828664",
  },
  email: "info@teamapex.co.za",

  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
  },
} as const;

export const areas = [
  {
    name: "Pretoria",
    blurb: "The capital's established suburbs and new estate developments.",
  },
  {
    name: "Centurion",
    blurb: "Family estates, security complexes and prime commercial nodes.",
  },
  {
    name: "Richards Bay",
    blurb: "Coastal living and steady demand in a growing harbour city.",
  },
  {
    name: "Durban",
    blurb: "Apartments, beachfront homes and vibrant suburban markets.",
  },
  {
    name: "Margate",
    blurb: "South Coast holiday homes, retirement living and rentals.",
  },
  {
    name: "Port Elizabeth",
    blurb: "Bay-side suburbs and value-driven family neighbourhoods.",
  },
] as const;

// Primary navigation shown in the header.
export const nav = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "For Sellers", to: "/for-sellers" },
  { label: "For Agents", to: "/for-agents" },
  { label: "Areas We Serve", to: "/areas" },
  { label: "Contact", to: "/contact" },
] as const;

export const testimonials = [
  {
    quote:
      "Joining Team APEX was the best decision I've made for my career. The support and leads are unbelievable!",
    name: "Carin G.",
    place: "Centurion",
  },
  {
    quote:
      "The systems, training and positive culture helped me grow my business and income significantly.",
    name: "Naude K.",
    place: "Pretoria",
  },
  {
    quote:
      "A professional team that truly cares about your success. Highly recommended!",
    name: "Roxzaan P.",
    place: "Durban",
  },
] as const;
