import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { useSettings } from "../context/SettingsContext";
import { submitForm } from "../lib/submissions";
import { usePhonePlaceholder } from "../lib/usePhonePlaceholder";

type ContactFormProps = {
  // Heading context: sellers vs general enquiry
  intent?: "sell" | "general";
};

// General / seller enquiry form. Stores to Supabase when configured, otherwise
// falls back to opening a pre-filled WhatsApp message.
export default function ContactForm({ intent = "general" }: ContactFormProps) {
  const settings = useSettings();
  const phone = usePhonePlaceholder();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    interest: intent === "sell" ? "Sell my property" : "General enquiry",
    message: "",
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Team APEX!\n\nName: ${form.name}\nEmail: ${form.email}\n` +
        `Phone: ${form.phone}\nLocation: ${form.location}\n` +
        `I'm interested in: ${form.interest}\nMessage: ${form.message}`
    );
    window.open(`${settings.whatsapp.link}?text=${text}`, "_blank", "noopener");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await submitForm({
      type: intent === "sell" ? "sell" : "contact",
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      meta: { location: form.location, interest: form.interest },
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
      <div className="formcard">
        <div className="form-success">
          <Icon name="check-circle" />
          <span>
            Thanks, {form.name || "there"}! Your enquiry has been received — we'll
            get back to you as soon as we can.
          </span>
        </div>
      </div>
    );
  }

  return (
    <form className="formcard" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="c-name">Full Name</label>
          <input id="c-name" name="name" autoComplete="name" required value={form.name} onChange={update("name")} placeholder="Your full name" />
        </div>
        <div className="field">
          <label htmlFor="c-phone">Phone Number</label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update("phone")} placeholder={phone.placeholder} />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email Address</label>
          <input id="c-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} placeholder="you@email.com" />
        </div>
        <div className="field">
          <label htmlFor="c-loc">Property Location</label>
          <input id="c-loc" name="location" autoComplete="address-level2" value={form.location} onChange={update("location")} placeholder="e.g. Durban" />
        </div>
        <div className="field field--full">
          <label htmlFor="c-int">I'm interested in</label>
          <select id="c-int" value={form.interest} onChange={update("interest")}>
            <option>Sell my property</option>
            <option>Rent out my property</option>
            <option>Buying / renting a property</option>
            <option>General enquiry</option>
          </select>
        </div>
        <div className="field field--full">
          <label htmlFor="c-msg">How can we help?</label>
          <textarea id="c-msg" name="message" value={form.message} onChange={update("message")} placeholder="Tell us about your property or what you're looking for…" />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn btn--blue btn--block btn--lg" style={{ marginTop: 18 }} disabled={busy}>
        {busy ? "Sending…" : "Send My Details"}
      </button>

      <div className="form-note">
        <Icon name="lock" />
        Your information is safe with us and will never be shared.
      </div>
    </form>
  );
}
