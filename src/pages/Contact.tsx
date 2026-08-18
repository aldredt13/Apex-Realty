import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import ContactForm from "../components/ContactForm";
import { useSettings } from "../context/SettingsContext";

const faqs = [
  {
    q: "What areas does Team APEX cover?",
    a: "We have agents in Pretoria, Centurion, Richards Bay, Durban, Margate and Port Elizabeth — and we're expanding rapidly. If you're nearby, get in touch and we'll help.",
  },
  {
    q: "Do you handle rentals as well as sales?",
    a: "Yes. We primarily list and sell property, and in many cases we also assist with rentals — helping you find reliable, vetted tenants.",
  },
  {
    q: "How much does a valuation cost?",
    a: "Nothing. We offer a free, no-obligation property valuation so you know exactly where you stand before deciding to list.",
  },
  {
    q: "I'm an agent — how do I join Team APEX?",
    a: "We're always looking for Full Status Qualified agents. Head to the For Agents page and fill in the form, or message us on WhatsApp.",
  },
];

export default function Contact() {
  const settings = useSettings();
  return (
    <>
      {/* ---------------- PAGE HERO ---------------- */}
      <section className="pagehero">
        <div className="container pagehero__inner">
          <div className="crumbs">
            <Link to="/">Home</Link> <span>/</span> <span>Contact</span>
          </div>
          <h1>
            Get In <span className="gold-text">Touch</span>
          </h1>
          <p>
            Whether you're buying, selling, renting or looking to grow your career,
            we'd love to hear from you. Real people, ready to help.
          </p>
        </div>
      </section>

      {/* ---------------- CONTACT GRID ---------------- */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <Reveal>
              <div className="eyebrow">Contact Details</div>
              <h2 className="section-head" style={{ textTransform: "uppercase" }}>
                Let's talk
              </h2>
              <div className="contact-methods">
                <a href={settings.whatsapp.link} target="_blank" rel="noreferrer" className="contact-method">
                  <div className="contact-method__icon">
                    <Icon name="whatsapp" />
                  </div>
                  <div>
                    <b>WhatsApp</b>
                    <span>{settings.whatsapp.display} · Click to chat</span>
                  </div>
                </a>
                <a href={`mailto:${settings.email}`} className="contact-method">
                  <div className="contact-method__icon">
                    <Icon name="mail" />
                  </div>
                  <div>
                    <b>Email</b>
                    <span>{settings.email}</span>
                  </div>
                </a>
                <a href={settings.phone.link} className="contact-method">
                  <div className="contact-method__icon">
                    <Icon name="phone" />
                  </div>
                  <div>
                    <b>Phone</b>
                    <span>{settings.phone.display}</span>
                  </div>
                </a>
                <div className="contact-method">
                  <div className="contact-method__icon">
                    <Icon name="pin" />
                  </div>
                  <div>
                    <b>Where We Work</b>
                    <span>Across South Africa</span>
                  </div>
                </div>
              </div>

              <div className="socials" style={{ marginTop: 24 }}>
                {settings.social.facebook && (
                  <a href={settings.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                    <Icon name="facebook" />
                  </a>
                )}
                {settings.social.instagram && (
                  <a href={settings.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <Icon name="instagram" />
                  </a>
                )}
                {settings.social.linkedin && (
                  <a href={settings.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <Icon name="linkedin" />
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <ContactForm intent="general" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <div className="eyebrow eyebrow--center">FAQ</div>
            <h2>Frequently asked questions</h2>
          </Reveal>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
