import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import CityImage from "../components/CityImage";
import { areas } from "../data/site";
import { useSettings } from "../context/SettingsContext";

export default function Areas() {
  const settings = useSettings();
  return (
    <>
      {/* ---------------- PAGE HERO ---------------- */}
      <section className="pagehero">
        <div className="container pagehero__inner">
          <div className="crumbs">
            <Link to="/">Home</Link> <span>/</span> <span>Areas We Serve</span>
          </div>
          <h1>
            Areas We <span className="gold-text">Serve</span>
          </h1>
          <p>
            Local knowledge, national reach. Team APEX has agents on the ground in
            these areas — and we're expanding rapidly across South Africa.
          </p>
        </div>
      </section>

      {/* ---------------- AREAS GRID ---------------- */}
      <section className="section">
        <div className="container">
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
                  <a
                    href={settings.whatsapp.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--ghost"
                    style={{ marginTop: 16, width: "100%" }}
                  >
                    Enquire in {area.name} <Icon name="arrow-right" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <p
            className="script"
            style={{
              textAlign: "center",
              color: "var(--gold-600)",
              fontSize: "1.8rem",
              marginTop: 40,
            }}
          >
            …and expanding rapidly!
          </p>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="ctaband">
            <div>
              <h2>Don't see your area?</h2>
              <p>
                We're growing fast. Get in touch — chances are we can help, or
                will be in your area soon.
              </p>
            </div>
            <div className="ctaband__actions">
              <a href={settings.whatsapp.link} className="btn btn--whatsapp btn--lg" target="_blank" rel="noreferrer">
                <Icon name="whatsapp" /> Chat on WhatsApp
              </a>
              <Link to="/contact" className="btn btn--outline btn--lg">
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
