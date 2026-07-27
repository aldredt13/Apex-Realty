import { Link } from "react-router-dom";
import Icon from "../components/Icon";

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center", paddingTop: 120, paddingBottom: 120 }}>
      <div className="container">
        <div className="gold-text" style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: "5rem", lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ textTransform: "uppercase", marginTop: 12 }}>Page not found</h1>
        <p style={{ maxWidth: 460, margin: "16px auto 32px" }}>
          The page you're looking for doesn't exist or has moved. Let's get you
          back on track.
        </p>
        <Link to="/" className="btn btn--gold btn--lg">
          <Icon name="home" /> Back to Home
        </Link>
      </div>
    </section>
  );
}
