import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import { site } from "../data/site";
import { images } from "../data/images";

const values = [
  {
    icon: "handshake",
    title: "People First",
    text: "Real people, real service. We treat every client and agent like family and always put relationships first.",
  },
  {
    icon: "trending",
    title: "Results Driven",
    text: "We're relentless about getting real results — the best price for sellers and real growth for our agents.",
  },
  {
    icon: "shield",
    title: "Integrity Always",
    text: "Honest advice, clear communication and no hidden surprises. We do what we say we'll do.",
  },
];

const stats = [
  { num: "6", suffix: "+", label: "Cities served & growing" },
  { num: "100", suffix: "%", label: "Full Status Qualified agents" },
  { num: "3", suffix: "", label: "Core services: buy · sell · rent" },
  { num: "1", suffix: "", label: "Simple promise: real results" },
];

export default function About() {
  return (
    <>
      {/* ---------------- PAGE HERO ---------------- */}
      <section className="pagehero">
        <div className="container pagehero__inner">
          <div className="crumbs">
            <Link to="/">Home</Link> <span>/</span> <span>About Us</span>
          </div>
          <h1>
            About <span className="gold-text">Team APEX</span>
          </h1>
          <p>
            {site.legalName} is a results-driven real estate team helping
            homeowners buy, sell and rent — and guiding agents to build
            successful careers across South Africa.
          </p>
        </div>
      </section>

      {/* ---------------- STORY ---------------- */}
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal className="split__body">
              <div className="eyebrow">Our Story</div>
              <h2>
                Committed. Driven. <span className="gold-text">Results Focused.</span>
              </h2>
              <p>
                Team APEX was built on a simple idea: real estate should be a
                breeze. We combine professional marketing, local expertise and a
                genuine care for people to deliver an experience that clients and
                agents love.
              </p>
              <p>
                With agents active in Pretoria, Centurion, Richards Bay, Durban,
                Margate and Port Elizabeth — and expanding rapidly — we pair
                national reach with real local knowledge in every market we serve.
              </p>
              <ul className="checklist">
                <li>
                  <Icon name="check-circle" /> A professional team that truly cares
                </li>
                <li>
                  <Icon name="check-circle" /> Full Status Qualified agents only
                </li>
                <li>
                  <Icon name="check-circle" /> Proven systems and a winning culture
                </li>
              </ul>
            </Reveal>
            <Reveal className="split__media split__media--ring" delay={110}>
              <img
                src={images.agentMeeting}
                alt="Team APEX agent meeting with a client"
                loading="lazy"
                style={{ background: "var(--grad-navy)", minHeight: 320 }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- VALUES ---------------- */}
      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <div className="eyebrow eyebrow--center">What We Stand For</div>
            <h2>Our values</h2>
          </Reveal>
          <div className="value-grid">
            {values.map((v, i) => (
              <Reveal className="value" key={v.title} delay={i * 90}>
                <div className="value__icon">
                  <Icon name={v.icon as "handshake"} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="stat-row">
            {stats.map((s, i) => (
              <Reveal className="stat" key={s.label} delay={i * 70}>
                <div className="stat__num">
                  {s.num}
                  <span>{s.suffix}</span>
                </div>
                <div className="stat__label">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA BAND ---------------- */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="ctaband">
            <div>
              <h2>Let's work together</h2>
              <p>
                Whether you want to sell your property or grow your real estate
                career, Team APEX is here to help you succeed.
              </p>
            </div>
            <div className="ctaband__actions">
              <Link to="/for-sellers" className="btn btn--gold btn--lg">
                I Want to Sell
              </Link>
              <Link to="/for-agents" className="btn btn--outline btn--lg">
                I Want to Join
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
