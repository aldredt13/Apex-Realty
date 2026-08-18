import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { useSettings } from "../context/SettingsContext";
import { submitForm } from "../lib/submissions";
import { usePhonePlaceholder } from "../lib/usePhonePlaceholder";

// Agent recruitment form. Stores to Supabase when configured, otherwise falls
// back to a pre-filled WhatsApp message.
export default function JoinForm() {
  const settings = useSettings();
  const phone = usePhonePlaceholder();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    qualified: "",
    message: "",
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Team APEX! I'd like to join the team.\n\n` +
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n` +
        `City/Area: ${form.city}\nFull Status Qualified: ${form.qualified}\n` +
        `About me: ${form.message}`
    );
    window.open(`${settings.whatsapp.link}?text=${text}`, "_blank", "noopener");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await submitForm({
      type: "join",
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      meta: { city: form.city, qualified: form.qualified },
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
            Thank you, {form.name || "there"}! Your details are in — we'll be in
            touch shortly to talk about your future with Team APEX.
          </span>
        </div>
      </div>
    );
  }

  return (
    <form className="formcard" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="j-name">Full Name</label>
          <input id="j-name" name="name" autoComplete="name" required value={form.name} onChange={update("name")} placeholder="Your full name" />
        </div>
        <div className="field">
          <label htmlFor="j-email">Email Address</label>
          <input id="j-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} placeholder="you@email.com" />
        </div>
        <div className="field">
          <label htmlFor="j-phone">Phone Number</label>
          <input id="j-phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update("phone")} placeholder={phone.placeholder} />
        </div>
        <div className="field">
          <label htmlFor="j-city">City / Area</label>
          <input id="j-city" name="city" autoComplete="address-level2" value={form.city} onChange={update("city")} placeholder="e.g. Centurion" />
        </div>
        <div className="field field--full">
          <label htmlFor="j-qual">Are you Full Status Qualified?</label>
          <select id="j-qual" value={form.qualified} onChange={update("qualified")} required>
            <option value="" disabled>
              Please select…
            </option>
            <option>Yes — Full Status Qualified</option>
            <option>Intern / working towards Full Status</option>
            <option>Not yet — but keen to learn more</option>
          </select>
        </div>
        <div className="field field--full">
          <label htmlFor="j-msg">Tell us a little about yourself and your experience</label>
          <textarea id="j-msg" name="message" value={form.message} onChange={update("message")} placeholder="Your experience, goals and what you're looking for…" />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn btn--gold btn--block btn--lg" style={{ marginTop: 18 }} disabled={busy}>
        {busy ? "Sending…" : "Join Team APEX"}
      </button>

      <div className="form-note">
        <Icon name="lock" />
        Your information is safe with us and will never be shared.
      </div>
    </form>
  );
}
