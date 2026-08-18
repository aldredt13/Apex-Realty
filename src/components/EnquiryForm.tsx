import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { useSettings } from "../context/SettingsContext";
import { submitForm } from "../lib/submissions";
import { usePhonePlaceholder } from "../lib/usePhonePlaceholder";

type EnquiryFormProps = {
  listingId: string;
  listingTitle: string;
};

// Enquiry form shown on a single listing page.
export default function EnquiryForm({ listingId, listingTitle }: EnquiryFormProps) {
  const settings = useSettings();
  const phone = usePhonePlaceholder();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in "${listingTitle}". Please send me more information.`,
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Team APEX!\n\nEnquiry about: ${listingTitle}\n\n` +
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n` +
        `Message: ${form.message}`
    );
    window.open(`${settings.whatsapp.link}?text=${text}`, "_blank", "noopener");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await submitForm({
      type: "enquiry",
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      listing_id: listingId,
      listing_title: listingTitle,
    });
    setBusy(false);

    if (res.ok) {
      setSent(true);
    } else if (res.error === "not-configured") {
      openWhatsApp();
      setSent(true);
    } else {
      setError("Something went wrong. Please try again or message us on WhatsApp.");
    }
  };

  if (sent) {
    return (
      <div className="form-success">
        <Icon name="check-circle" />
        <span>
          Thanks, {form.name || "there"}! Your enquiry about this property is in —
          we'll be in touch shortly.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field" style={{ marginBottom: 12 }}>
        <label htmlFor="e-name">Full Name</label>
        <input id="e-name" name="name" autoComplete="name" required value={form.name} onChange={update("name")} placeholder="Your full name" />
      </div>
      <div className="field" style={{ marginBottom: 12 }}>
        <label htmlFor="e-email">Email</label>
        <input id="e-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} placeholder="you@email.com" />
      </div>
      <div className="field" style={{ marginBottom: 12 }}>
        <label htmlFor="e-phone">Phone</label>
        <input id="e-phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update("phone")} placeholder={phone.placeholder} />
      </div>
      <div className="field" style={{ marginBottom: 12 }}>
        <label htmlFor="e-msg">Message</label>
        <textarea id="e-msg" name="message" value={form.message} onChange={update("message")} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn btn--blue btn--block" disabled={busy}>
        {busy ? "Sending…" : "Send Enquiry"}
      </button>
      <div className="form-note">
        <Icon name="lock" /> Your details stay private.
      </div>
    </form>
  );
}
