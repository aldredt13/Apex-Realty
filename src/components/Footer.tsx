import { Link } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import { nav } from "../data/site";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const settings = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Logo light />
            <p className="footer__about">{settings.about}</p>
            <div className="socials" style={{ marginTop: 18 }}>
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
              <a href={settings.whatsapp.link} target="_blank" rel="noreferrer" aria-label="WhatsApp">
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
              <a href={settings.whatsapp.link} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" />
                <span>WhatsApp: {settings.whatsapp.display}</span>
              </a>
              <a href={`mailto:${settings.email}`}>
                <Icon name="mail" />
                <span>{settings.email}</span>
              </a>
              <a href={settings.phone.link}>
                <Icon name="phone" />
                <span>{settings.phone.display}</span>
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
              {settings.social.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              )}
              {settings.social.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
              {settings.social.linkedin && (
                <a href={settings.social.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
              <a href={`https://${settings.domain}`} target="_blank" rel="noreferrer">
                {settings.domain}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="footer__bar">
          <span>
            © {year} {settings.legalName}. All rights reserved.
          </span>
          <span className="script">{settings.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
