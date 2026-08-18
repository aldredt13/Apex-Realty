import { useEffect, useState } from "react";
import Icon from "./Icon";
import {
  getStorageStats,
  STORAGE_LIMIT_BYTES,
  formatBytes,
  type StorageStats,
} from "../lib/usage";

type UsageCardProps = {
  listingsCount: number;
  /** change this value to make the card re-read storage usage */
  refreshToken?: number;
};

export default function UsageCard({ listingsCount, refreshToken = 0 }: UsageCardProps) {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    let alive = true;
    getStorageStats().then((s) => {
      if (!alive) return;
      if (s) {
        setStats(s);
        setState("ready");
      } else {
        setState("unavailable");
      }
    });
    return () => {
      alive = false;
    };
  }, [refreshToken]);

  const used = stats?.bytes ?? 0;
  const pct = Math.min(100, Math.round((used / STORAGE_LIMIT_BYTES) * 100));
  const remaining = Math.max(0, STORAGE_LIMIT_BYTES - used);
  const level = pct >= 90 ? "danger" : pct >= 70 ? "warn" : "ok";

  return (
    <div className="usage">
      <div className="usage__meter">
        <div className="usage__head">
          <span className="usage__title">
            <Icon name="image" /> Photo storage
          </span>
          {state === "ready" && (
            <span className="usage__figure">
              {formatBytes(used)} <em>of {formatBytes(STORAGE_LIMIT_BYTES)}</em>
            </span>
          )}
        </div>

        {state === "loading" && <div className="meter meter--idle" />}

        {state === "ready" && (
          <>
            <div className="meter">
              <div className={`meter__fill meter__fill--${level}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="usage__foot">
              <span>{formatBytes(remaining)} free</span>
              <span>{pct}% used</span>
            </div>
          </>
        )}

        {state === "unavailable" && (
          <p className="usage__note">
            Run the <code>storage_stats()</code> SQL to enable storage usage.
          </p>
        )}
      </div>

      <div className="usage__stats">
        <div className="usage__stat">
          <b>{listingsCount}</b>
          <span>Listings</span>
        </div>
        <div className="usage__stat">
          <b>{state === "ready" ? stats?.files ?? 0 : "—"}</b>
          <span>Photos</span>
        </div>
      </div>
    </div>
  );
}
