import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { site } from "../data/site";

// Agent recruitment form. On submit it shows a success state and builds a
// pre-filled WhatsApp message as a no-backend fallback. Wire the `action`
// to Formspree / your own endpoint to receive emails (see README).
export default function JoinForm() {
  const [sent, setSent] = useState(false);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi Team APEX! I'd like to join the team.\n\n` +
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n` +
        `City/Area: ${form.city}\nFull Status Qualified: ${form.qualified}\n` +
        `About me: ${form.message}`
    );
    window.open(`${site.whatsapp.link}?text=${text}`, "_blank", "noopener");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="formcard">
        <div className="form-success">
          <Icon name="check-circle" />
          <span>
            Thank you, {form.name || "there"}! Your details are on the way. We've
            opened WhatsApp so you can send them through instantly — we'll be in
            touch shortly.
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
          <input id="j-name" required value={form.name} onChange={update("name")} placeholder="Your full name" />
        </div>
        <div className="field">
          <label htmlFor="j-email">Email Address</label>
          <input id="j-email" type="email" required value={form.email} onChange={update("email")} placeholder="you@email.com" />
        </div>
        <div className="field">
          <label htmlFor="j-phone">Phone Number</label>
          <input id="j-phone" type="tel" required value={form.phone} onChange={update("phone")} placeholder="0__ ___ ____" />
        </div>
        <div className="field">
          <label htmlFor="j-city">City / Area</label>
          <input id="j-city" value={form.city} onChange={update("city")} placeholder="e.g. Centurion" />
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
          <textarea id="j-msg" value={form.message} onChange={update("message")} placeholder="Your experience, goals and what you're looking for…" />
        </div>
      </div>

      <button type="submit" className="btn btn--gold btn--block btn--lg" style={{ marginTop: 18 }}>
        Join Team APEX
      </button>

      <div className="form-note">
        <Icon name="lock" />
        Your information is safe with us and will never be shared.
      </div>
    </form>
  );
}
