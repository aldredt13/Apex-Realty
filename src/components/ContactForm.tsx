import { useState, type FormEvent } from "react";
import Icon from "./Icon";
import { site } from "../data/site";

type ContactFormProps = {
  // Heading context: sellers vs general enquiry
  intent?: "sell" | "general";
};

// General / seller enquiry form. Same no-backend WhatsApp fallback as JoinForm.
export default function ContactForm({ intent = "general" }: ContactFormProps) {
  const [sent, setSent] = useState(false);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi Team APEX!\n\n` +
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n` +
        `Location: ${form.location}\nI'm interested in: ${form.interest}\n` +
        `Message: ${form.message}`
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
            Thanks, {form.name || "there"}! We've opened WhatsApp so you can send
            your details straight to us. We'll get back to you as soon as we can.
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
          <input id="c-name" required value={form.name} onChange={update("name")} placeholder="Your full name" />
        </div>
        <div className="field">
          <label htmlFor="c-phone">Phone Number</label>
          <input id="c-phone" type="tel" required value={form.phone} onChange={update("phone")} placeholder="0__ ___ ____" />
        </div>
        <div className="field">
          <label htmlFor="c-email">Email Address</label>
          <input id="c-email" type="email" required value={form.email} onChange={update("email")} placeholder="you@email.com" />
        </div>
        <div className="field">
          <label htmlFor="c-loc">Property Location</label>
          <input id="c-loc" value={form.location} onChange={update("location")} placeholder="e.g. Durban" />
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
          <textarea id="c-msg" value={form.message} onChange={update("message")} placeholder="Tell us about your property or what you're looking for…" />
        </div>
      </div>

      <button type="submit" className="btn btn--blue btn--block btn--lg" style={{ marginTop: 18 }}>
        Send My Details
      </button>

      <div className="form-note">
        <Icon name="lock" />
        Your information is safe with us and will never be shared.
      </div>
    </form>
  );
}
