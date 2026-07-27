import { Link } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import { nav, site } from "../data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Logo light />
            <p className="footer__about">
              {site.legalName} is a results-driven real estate team helping
              homeowners buy, sell and rent — and guiding agents to successful
              careers across South Africa.
            </p>
            <div className="socials" style={{ marginTop: 18 }}>
              <a href={site.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Icon name="facebook" />
              </a>
              <a href={site.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
              <a href={site.whatsapp.link} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <Icon name="whatsapp" />
              </a>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <div className="footer__links">
              {nav.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4>Contact Us</h4>
            <div className="footer__contact">
              <a href={site.whatsapp.link} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" />
                <span>WhatsApp: {site.whatsapp.display}</span>
              </a>
              <a href={`mailto:${site.email}`}>
                <Icon name="mail" />
                <span>{site.email}</span>
              </a>
              <a href={site.phone.link}>
                <Icon name="phone" />
                <span>{site.phone.display}</span>
              </a>
              <span>
                <Icon name="pin" />
                <span>Serving clients across South Africa</span>
              </span>
            </div>
          </div>

          <div>
            <h4>Follow Us</h4>
            <div className="footer__links">
              <a href={site.social.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href={site.social.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={`https://${site.domain}`} target="_blank" rel="noreferrer">
                {site.domain}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="footer__bar">
          <span>
            © {year} {site.legalName}. All rights reserved.
          </span>
          <span className="script">{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
