import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import logoLight from "../assets/logo-light.png";

type LogoProps = {
  // use the light version (white text) on dark backgrounds
  light?: boolean;
};

export default function Logo({ light = false }: LogoProps) {
  return (
    <Link to="/" className="logo" aria-label="APEX Real Estate — home">
      <img
        className="logo__img"
        src={light ? logoLight : logo}
        alt="APEX Real Estate — Powered by Real Estate Services"
        width={418}
        height={204}
      />
    </Link>
  );
}
