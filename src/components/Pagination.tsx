import Icon from "./Icon";

type PaginationProps = {
  page: number; // 1-based
  pageCount: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  // Build a compact page window with ellipses.
  const pages: (number | "…")[] = [];
  const push = (n: number | "…") => pages.push(n);
  const window = 1;
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || (i >= page - window && i <= page + window)) {
      push(i);
    } else if (pages[pages.length - 1] !== "…") {
      push("…");
    }
  }

  return (
    <nav className="pager" aria-label="Pagination">
      <button
        className="pager__btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="pager__gap">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`pager__btn${p === page ? " is-active" : ""}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="pager__btn"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        <Icon name="chevron-right" />
      </button>
    </nav>
  );
}
