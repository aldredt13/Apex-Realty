import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import JoinForm from "../components/JoinForm";
import { areas, testimonials } from "../data/site";
import { useSettings } from "../context/SettingsContext";
import { images } from "../data/images";

const benefits = [
  { icon: "trending", title: "Better Commission", text: "Earn up to 100% commission." },
  { icon: "headset", title: "Strong Support", text: "Personal support, admin assistance & systems." },
  { icon: "megaphone", title: "Lead Generation", text: "Quality leads to help you grow your business." },
  { icon: "users", title: "Winning Culture", text: "A collaborative, positive team environment." },
  { icon: "target", title: "Grow Your Business", text: "More time, more freedom, more income." },
] as const;

const reasons = [
  "We only work with Full Status Qualified agents",
  "Proven track record of success",
  "Professional branding & marketing",
  "Access to proven systems & technology",
  "National team with local expertise",
  "No desk fees · No monthly fees · No hidden costs",
  "More time to do what you do best — sell!",
];

export default function ForAgents() {
  const settings = useSettings();
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero__bg" style={{ backgroundImage: `url(${images.team})` }} />
        <div className="hero__overlay" />
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="eyebrow" style={{ color: "var(--gold-300)" }}>Join Team APEX</div>
            <h1>
              Be Part of a Winning Team.
              <br />
              <span className="gold-text">Build the Life You Deserve.</span>
              <span className="rule" />
            </h1>
            <p className="hero__lead">
              {settings.legalName} is looking for successful, committed{" "}
              <strong>Full Status Qualified</strong> Property Practitioners to join
              our growing national team.
            </p>
            <div className="hero__actions">
              <a href="#join" className="btn btn--blue btn--lg">
                <Icon name="users" />
                I Want to Join Team APEX
              </a>
              <a href={settings.whatsapp.link} className="btn btn--outline btn--lg" target="_blank" rel="noreferrer">
                <Icon name="phone" />
                Speak to Us Today
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- BENEFIT STRIP ---------------- */}
      <section className="section section--navy">
        <div className="container">
          <div className="benefits">
            {benefits.map((b, i) => (
              <Reveal className="benefit" key={b.title} delay={i * 70}>
                <div className="benefit__icon">
                  <Icon name={b.icon as "trending"} />
                </div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHY + GROWING ---------------- */}
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal className="split__body">
              <div className="eyebrow">Why Apex</div>
              <h2>
                Why top agents choose <span className="blue-text">Team APEX</span>
              </h2>
              <ul className="checklist">
                {reasons.map((r) => (
                  <li key={r}>
                    <Icon name="check-circle" /> {r}
                  </li>
                ))}
              </ul>
              <p className="script" style={{ color: "var(--gold-600)", fontSize: "1.5rem", marginTop: 24 }}>
                We invest in agents who are committed to building a better future.
              </p>
            </Reveal>

            <Reveal className="split__body" delay={120}>
              <div className="eyebrow">Our Support</div>
              <h2>
                We are growing across <span className="blue-text">South Africa</span>
              </h2>
              <p>
                Wherever you are, you'll be part of a national team with real local
                expertise. Our agents are already active in:
              </p>
              <div className="area-pills" style={{ justifyContent: "flex-start", marginTop: 24 }}>
                {areas.map((a) => (
                  <span className="area-pill" key={a.name} style={{ color: "var(--navy-800)" }}>
                    <Icon name="pin" /> {a.name}
                  </span>
                ))}
              </div>
              <p className="script" style={{ color: "var(--gold-600)", fontSize: "1.5rem", marginTop: 24 }}>
                …and expanding rapidly!
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <div className="eyebrow eyebrow--center">What Our Agents Say</div>
            <h2>Real agents. Real growth.</h2>
          </Reveal>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <Reveal className="testi" key={t.name} delay={i * 90}>
                <div className="testi__mark">“</div>
                <p className="testi__quote">{t.quote}</p>
                <div className="testi__stars">★★★★★</div>
                <div className="testi__who">
                  {t.name} <span>· {t.place}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- JOIN FORM ---------------- */}
      <section className="section section--navy" id="join">
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            <Reveal className="split__body">
              <div className="eyebrow">Let's Build Success Together</div>
              <h2 style={{ color: "#fff" }}>
                Ready to take your{" "}
                <span className="gold-text">real estate career</span> to the next
                level?
              </h2>
              <p style={{ color: "#c4d1e8", marginTop: 16 }}>
                Fill in your details and let's start building your successful future
                with Team APEX.
              </p>
              <ul className="assurances" style={{ marginTop: 28 }}>
                <li>
                  <Icon name="clock" /> Quick response
                </li>
                <li>
                  <Icon name="shield" /> Confidential
                </li>
                <li>
                  <Icon name="check-circle" /> No obligation
                </li>
              </ul>
              <p className="script" style={{ color: "var(--gold-300)", fontSize: "1.6rem", marginTop: 28 }}>
                Let's build success together!
              </p>
            </Reveal>

            <Reveal delay={120}>
              <JoinForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
