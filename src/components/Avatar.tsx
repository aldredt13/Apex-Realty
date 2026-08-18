type AvatarProps = {
  url?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
};

function initials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function Avatar({ url, name, size = 44, className = "" }: AvatarProps) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };
  return url ? (
    <img
      src={url}
      alt={name ?? "Profile photo"}
      className={`avatar ${className}`.trim()}
      style={style}
      loading="lazy"
    />
  ) : (
    <span className={`avatar avatar--fallback ${className}`.trim()} style={style} aria-hidden>
      {initials(name)}
    </span>
  );
}
