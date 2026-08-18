import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import ContactForm from "../components/ContactForm";
import { useSettings } from "../context/SettingsContext";
import { images } from "../data/images";

const steps = [
  {
    title: "Free property valuation",
    text: "We assess your home and the local market to price it right from day one — no cost, no obligation.",
  },
  {
    title: "Professional marketing",
    text: "Quality photography and wide exposure put your property in front of serious, qualified buyers.",
  },
  {
    title: "Negotiate & sell",
    text: "We handle enquiries, viewings and negotiations, guiding you smoothly all the way to transfer.",
  },
];

const values = [
  { icon: "camera", title: "Professional Photography", text: "Your property presented at its very best to stand out online." },
  { icon: "megaphone", title: "Wide Exposure", text: "Marketed across the right channels to reach genuine buyers." },
  { icon: "handshake", title: "Skilled Negotiation", text: "We fight for the best possible price and terms on your behalf." },
  { icon: "shield", title: "Trusted Guidance", text: "Honest advice and support through every step of the process." },
  { icon: "key", title: "Rental Solutions", text: "Prefer to let? We help you find reliable, vetted tenants too." },
  { icon: "clock", title: "Fast, Responsive Service", text: "Real people who keep you informed and reply quickly." },
];

export default function ForSellers() {
  const settings = useSettings();
  return (
    <>
      {/* ---------------- PAGE HERO ---------------- */}
      <section className="pagehero">
        <div className="container pagehero__inner">
          <div className="crumbs">
            <Link to="/">Home</Link> <span>/</span> <span>For Sellers</span>
          </div>
          <h1>
            List Your Property <span className="gold-text">With Confidence</span>
          </h1>
          <p>
            Selling or renting out your home should be a breeze. Team APEX markets
            your property professionally and connects you with serious buyers —
            getting you real results.
          </p>
          <div className="hero__actions">
            <a href="#list" className="btn btn--gold btn--lg">
              <Icon name="home" /> List Your Property
            </a>
            <a href={settings.whatsapp.link} className="btn btn--outline btn--lg" target="_blank" rel="noreferrer">
              <Icon name="whatsapp" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- SPLIT ---------------- */}
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal className="split__media split__media--ring">
              <img
                src={images.sellHouse}
                alt="Modern home ready to be listed"
                loading="lazy"
                style={{ background: "var(--grad-navy)", minHeight: 320 }}
              />
            </Reveal>
            <Reveal className="split__body" delay={100}>
              <div className="eyebrow">Why Sell With Us</div>
              <h2>
                Real marketing that gets your home <span className="gold-text">sold</span>
              </h2>
              <p>
                We don't just list your property — we market it. From the first
                valuation to the final signature, you get a dedicated team focused
                on the best result for you.
              </p>
              <ul className="checklist">
                <li>
                  <Icon name="check-circle" /> Accurate, market-related pricing
                </li>
                <li>
                  <Icon name="check-circle" /> Professional photos & compelling listings
                </li>
                <li>
                  <Icon name="check-circle" /> Serious, pre-qualified buyers
                </li>
                <li>
                  <Icon name="check-circle" /> Clear communication, every step
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- STEPS ---------------- */}
      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <div className="eyebrow eyebrow--center">How It Works</div>
            <h2>Selling made simple</h2>
            <p>Three straightforward steps from valuation to sold.</p>
          </Reveal>
          <div className="steps">
            {steps.map((s, i) => (
              <Reveal className="step" key={s.title} delay={i * 90}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- VALUE GRID ---------------- */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <div className="eyebrow eyebrow--center">What You Get</div>
            <h2>Everything working in your favour</h2>
          </Reveal>
          <div className="value-grid">
            {values.map((v, i) => (
              <Reveal className="value" key={v.title} delay={(i % 3) * 80}>
                <div className="value__icon">
                  <Icon name={v.icon as "camera"} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- LIST FORM ---------------- */}
      <section className="section section--navy" id="list">
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            <Reveal className="split__body">
              <div className="eyebrow">Get Started</div>
              <h2 style={{ color: "#fff" }}>
                Ready to list your <span className="gold-text">property?</span>
              </h2>
              <p style={{ color: "#c4d1e8", marginTop: 16 }}>
                Send us a few details and we'll arrange a free, no-obligation
                valuation. Let's make selling your home a breeze.
              </p>
              <ul className="assurances" style={{ marginTop: 28 }}>
                <li>
                  <Icon name="check-circle" /> Free property valuation
                </li>
                <li>
                  <Icon name="lock" /> Your details stay private
                </li>
                <li>
                  <Icon name="clock" /> Quick, friendly response
                </li>
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <ContactForm intent="sell" />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
