import { useRef, useState } from "react";
import Icon from "./Icon";
import { uploadListingImage, deleteListingImage } from "../lib/imaging";

type ImageUploaderProps = {
  listingId: string;
  value: string[];
  onChange: (urls: string[]) => void;
};

function fmtKB(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

// Drag/drop uploader that compresses each image (WebP, high quality) before
// upload and reports how much space was saved. First image is the cover.
export default function ImageUploader({ listingId, value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [savedNote, setSavedNote] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;

    setBusy(true);
    setError("");
    setProgress({ done: 0, total: list.length });

    let beforeTotal = 0;
    let afterTotal = 0;
    const uploaded: string[] = [];

    for (let i = 0; i < list.length; i++) {
      try {
        const res = await uploadListingImage(list[i], listingId);
        uploaded.push(res.url);
        beforeTotal += res.beforeKB;
        afterTotal += res.afterKB;
        // push incrementally so the user sees thumbnails appear
        onChange([...value, ...uploaded]);
        setProgress({ done: i + 1, total: list.length });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    }

    if (afterTotal > 0) {
      const pct = Math.max(0, Math.round((1 - afterTotal / beforeTotal) * 100));
      setSavedNote(
        `Compressed ${fmtKB(beforeTotal)} → ${fmtKB(afterTotal)} (${pct}% smaller)`
      );
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function remove(url: string) {
    onChange(value.filter((u) => u !== url));
    deleteListingImage(url); // best effort, don't block UI
  }

  function move(url: string, dir: -1 | 1) {
    const idx = value.indexOf(url);
    const next = idx + dir;
    if (next < 0 || next >= value.length) return;
    const copy = [...value];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    onChange(copy);
  }

  return (
    <div className="uploader">
      <div
        className={`uploader__drop${dragging ? " is-drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <Icon name="upload" />
        <p>
          <strong>Click to upload</strong> or drag &amp; drop images
        </p>
        <span>JPG, PNG or WebP — auto-compressed to save space</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {busy && (
        <div className="uploader__status">
          <div className="spinner spinner--sm" />
          Uploading {progress.done}/{progress.total}…
        </div>
      )}
      {!busy && savedNote && (
        <div className="uploader__saved">
          <Icon name="check-circle" /> {savedNote}
        </div>
      )}
      {error && <p className="form-error">{error}</p>}

      {value.length > 0 && (
        <div className="uploader__grid">
          {value.map((url, i) => (
            <div key={url} className="uploader__item">
              <img src={url} alt="" />
              {i === 0 && <span className="uploader__cover">Cover</span>}
              <div className="uploader__tools">
                <button type="button" onClick={() => move(url, -1)} disabled={i === 0} aria-label="Move left">
                  <Icon name="chevron-left" />
                </button>
                <button type="button" onClick={() => move(url, 1)} disabled={i === value.length - 1} aria-label="Move right">
                  <Icon name="chevron-right" />
                </button>
                <button type="button" onClick={() => remove(url)} className="uploader__del" aria-label="Remove">
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
