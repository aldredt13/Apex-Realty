import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";
import Icon from "../../components/Icon";
import { recordFailedLogin } from "../../lib/loginAudit";

export default function Login() {
  const { session, configured, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (session) navigate("/dashboard", { replace: true });
  }, [session, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    const res =
      mode === "in"
        ? await signIn(identifier, password)
        : await signUp(identifier, password);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      // Log the failed attempt so it shows in the private login audit.
      if (mode === "in") recordFailedLogin(identifier);
    } else if (res.info) setInfo(res.info);
  };

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__logo">
          <Logo />
        </div>
        <h1>Admin Dashboard</h1>
        <p className="login__sub">
          {mode === "in"
            ? "Sign in to manage listings, submissions and site settings."
            : "Create your admin account, then sign in."}
        </p>

        {!configured && (
          <div className="alert alert--warn">
            Supabase isn't configured yet. Add your keys to <code>.env</code> and
            restart the dev server.
          </div>
        )}

        <form onSubmit={submit}>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="l-email">
              {mode === "in" ? "Username or email" : "Email"}
            </label>
            <input
              id="l-email"
              type={mode === "in" ? "text" : "email"}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={mode === "in" ? "your username" : "you@email.com"}
              autoComplete="username"
            />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="l-pass">Password</label>
            <input
              id="l-pass"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "in" ? "current-password" : "new-password"}
            />
          </div>

          {error && <div className="alert alert--error">{error}</div>}
          {info && <div className="alert alert--info">{info}</div>}

          <button type="submit" className="btn btn--gold btn--block btn--lg" disabled={busy || !configured}>
            {busy ? "Please wait…" : mode === "in" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          className="login__toggle"
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setError("");
            setInfo("");
          }}
        >
          {mode === "in"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>

        <Link to="/" className="login__back">
          <Icon name="chevron-left" /> Back to website
        </Link>
      </div>
    </div>
  );
}
