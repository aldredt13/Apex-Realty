// Lightweight inline SVG icon set (no external dependency).
// Stroke icons inherit `currentColor`; brand glyphs are filled.

type IconProps = {
  name: IconName;
  className?: string;
};

export type IconName =
  | "home"
  | "key"
  | "users"
  | "trending"
  | "handshake"
  | "headset"
  | "megaphone"
  | "target"
  | "check"
  | "check-circle"
  | "shield"
  | "phone"
  | "mail"
  | "pin"
  | "menu"
  | "close"
  | "arrow-right"
  | "building"
  | "award"
  | "star"
  | "clock"
  | "lock"
  | "camera"
  | "doc"
  | "globe"
  | "crown"
  | "briefcase"
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "bed"
  | "bath"
  | "car"
  | "ruler"
  | "tag"
  | "chevron-left"
  | "chevron-right"
  | "grid"
  | "settings"
  | "inbox"
  | "plus"
  | "edit"
  | "trash"
  | "upload"
  | "image"
  | "eye"
  | "logout"
  | "external"
  | "refresh"
  | "search";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function Icon({ name, className }: IconProps) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    "aria-hidden": true,
    focusable: false,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common} {...stroke}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      );
    case "key":
      return (
        <svg {...common} {...stroke}>
          <circle cx="8" cy="8" r="4.5" />
          <path d="m11 11 8 8" />
          <path d="m16 16 2-2M18.5 18.5 21 16" />
        </svg>
      );
    case "users":
      return (
        <svg {...common} {...stroke}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="M16 5.2A3.2 3.2 0 0 1 16 11.4" />
          <path d="M17 14.5a5.5 5.5 0 0 1 3.5 5.5" />
        </svg>
      );
    case "trending":
      return (
        <svg {...common} {...stroke}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M15 7h6v6" />
        </svg>
      );
    case "handshake":
      return (
        <svg {...common} {...stroke}>
          <path d="m3 12 3-3 5 4 2-2 4 3" />
          <path d="M21 11l-3-3-3 1" />
          <path d="M11 13l2 2c.7.7 1.8.7 2.5 0" />
          <path d="M3 12v4M21 11v5" />
        </svg>
      );
    case "headset":
      return (
        <svg {...common} {...stroke}>
          <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
          <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
          <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
          <path d="M20 19v.5a3 3 0 0 1-3 3H13" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...common} {...stroke}>
          <path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1Z" />
          <path d="M18 9a3 3 0 0 1 0 6" />
          <path d="M7 14v4a1.5 1.5 0 0 0 3 0v-3" />
        </svg>
      );
    case "target":
      return (
        <svg {...common} {...stroke}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "check":
      return (
        <svg {...common} {...stroke}>
          <path d="m4 12 5 5L20 6" />
        </svg>
      );
    case "check-circle":
      return (
        <svg {...common} {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} {...stroke}>
          <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common} {...stroke}>
          <path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common} {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common} {...stroke}>
          <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common} {...stroke}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg {...common} {...stroke}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common} {...stroke}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "building":
      return (
        <svg {...common} {...stroke}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
          <path d="M10 21v-3h4v3" />
        </svg>
      );
    case "award":
      return (
        <svg {...common} {...stroke}>
          <circle cx="12" cy="9" r="5" />
          <path d="m8.5 13-1.5 8 5-3 5 3-1.5-8" />
        </svg>
      );
    case "star":
      return (
        <svg {...common} viewBox="0 0 24 24" width={24} height={24} aria-hidden focusable={false}>
          <path
            fill="currentColor"
            d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z"
          />
        </svg>
      );
    case "clock":
      return (
        <svg {...common} {...stroke}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common} {...stroke}>
          <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common} {...stroke}>
          <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="13" r="3.2" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common} {...stroke}>
          <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
          <path d="M14 3v4h4M8.5 12h7M8.5 16h7" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common} {...stroke}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17" />
        </svg>
      );
    case "crown":
      return (
        <svg {...common} viewBox="0 0 24 24" width={24} height={24} aria-hidden focusable={false}>
          <path
            fill="currentColor"
            d="M4 8l3.5 4L12 5l4.5 7L20 8l-1.5 10h-13L4 8Z"
          />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common} {...stroke}>
          <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
          <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12h17" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} viewBox="0 0 24 24" width={24} height={24} aria-hidden focusable={false}>
          <path
            fill="currentColor"
            d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.5 3.68 1.37 5.22L2 22l5.06-1.5a9.8 9.8 0 0 0 4.98 1.35h.01c5.44 0 9.85-4.4 9.85-9.84A9.79 9.79 0 0 0 12.04 2Zm0 17.9h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3 .78.8-2.92-.2-.3a8.13 8.13 0 0 1-1.25-4.34c0-4.52 3.68-8.2 8.22-8.2 2.2 0 4.26.86 5.81 2.42a8.14 8.14 0 0 1 2.41 5.8c0 4.52-3.68 8.2-8.22 8.2Zm4.5-6.14c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12s-.64.8-.79.97c-.14.16-.29.18-.54.06a6.72 6.72 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42l-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.87.86-.87 2.09s.9 2.42 1.02 2.59c.13.16 1.76 2.69 4.27 3.77.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common} viewBox="0 0 24 24" width={24} height={24} aria-hidden focusable={false}>
          <path
            fill="currentColor"
            d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.04-1.3-.13-2.46-.13-2.43 0-4.1 1.48-4.1 4.21v2.35H7.7V13h2.74v8h3.06Z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} {...stroke}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="16.6" cy="7.4" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} viewBox="0 0 24 24" width={24} height={24} aria-hidden focusable={false}>
          <path
            fill="currentColor"
            d="M6.94 5A1.94 1.94 0 1 1 3.06 5a1.94 1.94 0 0 1 3.88 0ZM3.3 8.4h3.28V21H3.3V8.4Zm5.32 0h3.14v1.72h.05c.44-.83 1.5-1.7 3.1-1.7 3.32 0 3.93 2.18 3.93 5.02V21h-3.28v-5.9c0-1.4-.03-3.22-1.96-3.22-1.96 0-2.26 1.53-2.26 3.11V21H8.62V8.4Z"
          />
        </svg>
      );
    case "bed":
      return (
        <svg {...common} {...stroke}>
          <path d="M3 8v11M3 12h18v7M21 12v7" />
          <path d="M3 12v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case "bath":
      return (
        <svg {...common} {...stroke}>
          <path d="M4 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2" />
          <path d="M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2Z" />
          <path d="M7 18v2M17 18v2" />
        </svg>
      );
    case "car":
      return (
        <svg {...common} {...stroke}>
          <path d="M4 16v2M20 16v2" />
          <path d="M3 16v-3l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
          <path d="M6.5 13h.01M17.5 13h.01M4 10h16" />
        </svg>
      );
    case "ruler":
      return (
        <svg {...common} {...stroke}>
          <rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(0 12 12)" />
          <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common} {...stroke}>
          <path d="M4 4h7l9 9-7 7-9-9V4Z" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "chevron-left":
      return (
        <svg {...common} {...stroke}>
          <path d="m15 6-6 6 6 6" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common} {...stroke}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common} {...stroke}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common} {...stroke}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      );
    case "inbox":
      return (
        <svg {...common} {...stroke}>
          <path d="M3 13l3-8h12l3 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z" />
          <path d="M3 13h5l1 2h6l1-2h5" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common} {...stroke}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common} {...stroke}>
          <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
          <path d="M14.5 5.5 18.5 9.5" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common} {...stroke}>
          <path d="M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14" />
          <path d="M10 10v6M14 10v6" />
        </svg>
      );
    case "upload":
      return (
        <svg {...common} {...stroke}>
          <path d="M12 16V5m0 0L8 9m4-4 4 4" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
      );
    case "image":
      return (
        <svg {...common} {...stroke}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.6" />
          <path d="m4 17 5-4 4 3 3-2 4 3" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common} {...stroke}>
          <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common} {...stroke}>
          <path d="M15 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9" />
          <path d="M16 8l4 4-4 4M20 12H9" />
        </svg>
      );
    case "external":
      return (
        <svg {...common} {...stroke}>
          <path d="M14 4h6v6M20 4l-9 9" />
          <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common} {...stroke}>
          <path d="M20 11a8 8 0 0 0-14-4.5L4 8" />
          <path d="M4 4v4h4M4 13a8 8 0 0 0 14 4.5L20 16" />
          <path d="M20 20v-4h-4" />
        </svg>
      );
    case "search":
      return (
        <svg {...common} {...stroke}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    default:
      return null;
  }
}
