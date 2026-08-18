import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import CityImage from "../components/CityImage";
import { areas } from "../data/site";
import { useSettings } from "../context/SettingsContext";
import { images } from "../data/images";

export default function Home() {
  const settings = useSettings();
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div
          className="hero__bg"
          style={{ backgroundImage: `url(${images.heroHouse})` }}
        />
        <div className="hero__overlay" />
        <div className="container hero__inner">
          <div className="hero__content">
            <h1>
              Real People.
              <br />
              Real Service.
              <br />
              <span className="gold-text">Real Results.</span>
              <span className="rule" />
            </h1>
            <p className="hero__lead">
              <strong>{settings.legalName}</strong> — your trusted real estate team in
              South Africa. We list and sell property, assist with rentals, and
              build successful agent careers.
            </p>
            <div className="hero__actions">
              <Link to="/for-sellers" className="btn btn--blue btn--lg">
                <Icon name="home" />
                List Your Property
              </Link>
              <Link to="/for-agents" className="btn btn--gold btn--lg">
                <Icon name="users" />
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <div className="trust">
        <div className="container trust__inner">
          {[
            { icon: "home", b: "Residential", s: "Sales & Rentals" },
            { icon: "trending", b: "Proven", s: "Track Record" },
            { icon: "users", b: "Professional", s: "Full Status Agents" },
            { icon: "handshake", b: "Growing", s: "Across South Africa" },
          ].map((t) => (
            <div className="trust__item" key={t.b + t.s}>
              <Icon name={t.icon as "home"} />
              <div>
                <b>{t.b}</b>
                <span>{t.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- WHAT WE DO ---------------- */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <div className="eyebrow eyebrow--center">What We Do</div>
            <h2>
              Everything you need, <span className="gold-text">under one roof</span>
            </h2>
            <p>
              From listing your home to growing a real estate career, Team APEX
              delivers real service and real results at every step.
            </p>
          </Reveal>

          <div className="pillars">
            {[
              {
                icon: "home",
                title: "List & Sell Properties",
                text: "We market your property professionally and connect you with serious, qualified buyers.",
              },
              {
                icon: "key",
                title: "Rental Solutions",
                text: "We help you find reliable tenants and take the stress out of managing rental opportunities.",
              },
              {
                icon: "users",
                title: "Agent Growth",
                text: "We build successful careers for Full Status Qualified agents with a drive to win.",
              },
            ].map((p, i) => (
              <Reveal className="pillar" key={p.title} delay={i * 90}>
                <div className="pillar__icon">
                  <Icon name={p.icon as "home"} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHO WE ARE ---------------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="split">
            <Reveal className="split__body">
              <div className="eyebrow">Who We Are</div>
              <h2>
                Committed. Driven.
                <br />
                <span className="gold-text">Results Focused.</span>
              </h2>
              <p>
                We are a real estate team with agents currently in{" "}
                <strong>
                  Pretoria, Centurion, Richards Bay, Durban, Margate and Port
                  Elizabeth
                </strong>{" "}
                — and growing at a rapid rate.
              </p>
              <p>
                We list and sell property, and in some cases also do{" "}
                <strong>rentals</strong>. Our drive is simple: to get real results
                for our clients and our agents.
              </p>
              <ul className="checklist">
                <li>
                  <Icon name="check-circle" /> Professional marketing & serious buyers
                </li>
                <li>
                  <Icon name="check-circle" /> Local expertise across South Africa
                </li>
                <li>
                  <Icon name="check-circle" /> A team that truly cares about your success
                </li>
              </ul>
              <div className="hero__actions" style={{ marginTop: 28 }}>
                <Link to="/about" className="btn btn--ghost">
                  More About Us <Icon name="arrow-right" />
                </Link>
              </div>
            </Reveal>

            <Reveal className="split__media split__media--ring" delay={120}>
              <img
                src={images.livingRoom}
                alt="Bright, modern living room interior"
                loading="lazy"
                style={{ background: "var(--grad-navy)", minHeight: 320 }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- AREAS ---------------- */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <div className="eyebrow eyebrow--center">Proudly Operating In</div>
            <h2>Serving Clients Across South Africa</h2>
            <p>Local knowledge, national reach — and expanding rapidly.</p>
          </Reveal>

          <div className="areas-grid">
            {areas.map((area, i) => (
              <Reveal className="area-card" key={area.name} delay={(i % 3) * 80}>
                <div className="area-card__img">
                  <CityImage index={i} coastal={i >= 2} />
                </div>
                <div className="area-card__body">
                  <div className="area-card__name">
                    <Icon name="pin" /> {area.name}
                  </div>
                  <p>{area.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link to="/areas" className="btn btn--ghost">
              View All Areas <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- RECRUIT BANNER ---------------- */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="recruit">
            <div className="recruit__grid">
              <div className="recruit__media">
                <img src={images.team} alt="Team APEX real estate professionals" loading="lazy" />
              </div>
              <div className="recruit__body">
                <div className="eyebrow">For Real Estate Agents</div>
                <h2>
                  Are you a successful <span className="gold-text">real estate agent?</span>
                </h2>
                <p style={{ color: "#c4d1e8" }}>
                  We're looking for Full Status Qualified agents who are committed,
                  driven and ready to take their business to the next level.
                </p>
                <ul className="checklist">
                  <li>
                    <Icon name="check-circle" /> Work with a winning team
                  </li>
                  <li>
                    <Icon name="check-circle" /> Access to exclusive listings & quality leads
                  </li>
                  <li>
                    <Icon name="check-circle" /> Strong support & proven systems
                  </li>
                  <li>
                    <Icon name="check-circle" /> Grow your income & your brand
                  </li>
                </ul>
                <Link to="/for-agents" className="btn btn--gold btn--lg">
                  Join Team APEX <Icon name="arrow-right" />
                </Link>
                <svg className="recruit__crown" viewBox="0 0 24 24" aria-hidden>
                  <path fill="currentColor" d="M4 8l3.5 4L12 5l4.5 7L20 8l-1.5 10h-13L4 8Z" />
                </svg>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- CTA BAND ---------------- */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="ctaband">
            <div>
              <h2>Ready to make a move?</h2>
              <p>
                Whether you're buying, selling or looking to grow your career —
                we're here to help.
              </p>
            </div>
            <div className="ctaband__actions">
              <a href={settings.whatsapp.link} className="btn btn--whatsapp btn--lg" target="_blank" rel="noreferrer">
                <Icon name="whatsapp" /> Chat on WhatsApp
              </a>
              <Link to="/contact" className="btn btn--outline btn--lg">
                <Icon name="phone" /> Get In Touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
