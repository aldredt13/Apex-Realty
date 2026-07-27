import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import { nav, site } from "../data/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="container header__inner">
        <Logo />

        <nav className="header__nav" aria-label="Primary">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `header__link${isActive ? " is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__cta">
          <a
            href={site.whatsapp.link}
            className="btn btn--whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" />
            Chat on WhatsApp
          </a>
          <button
            className="header__burger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`drawer${open ? " is-open" : ""}`}>
        <div className="drawer__scrim" onClick={() => setOpen(false)} />
        <div className="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer__top">
            <Logo light />
            <button
              className="drawer__close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" />
            </button>
          </div>

          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `drawer__link${isActive ? " is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="drawer__cta">
            <a
              href={site.whatsapp.link}
              className="btn btn--whatsapp btn--block"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" />
              Chat on WhatsApp
            </a>
            <Link to="/contact" className="btn btn--gold btn--block">
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
