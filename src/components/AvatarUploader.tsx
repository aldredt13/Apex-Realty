import { useRef, useState } from "react";
import Icon from "./Icon";
import Avatar from "./Avatar";
import { uploadAvatar } from "../lib/imaging";

type AvatarUploaderProps = {
  userId: string;
  value: string | null;
  name?: string | null;
  onChange: (url: string) => void;
};

export default function AvatarUploader({ userId, value, name, onChange }: AvatarUploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handle(file?: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadAvatar(file, userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <div className="avatar-upload">
      <Avatar url={value} name={name} size={84} />
      <div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => input.current?.click()}
          disabled={busy}
        >
          <Icon name="camera" /> {busy ? "Uploading…" : value ? "Change photo" : "Upload photo"}
        </button>
        <p className="avatar-upload__hint">Square image works best. Auto-compressed.</p>
        {error && <p className="form-error">{error}</p>}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </div>
  );
}
