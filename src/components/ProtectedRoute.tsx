import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

export default function ProtectedRoute() {
  const { ready, adminReady, session, isAdmin, configured, signOut } = useAuth();

  if (!configured) {
    return (
      <div className="dash-gate">
        <div className="dash-gate__card">
          <Icon name="settings" />
          <h1>Dashboard not configured</h1>
          <p>
            Add your Supabase credentials to a <code>.env</code> file
            (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>)
            and restart the dev server to enable the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!ready || (session && !adminReady)) {
    return (
      <div className="dash-gate">
        <div className="spinner" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/dashboard/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="dash-gate">
        <div className="dash-gate__card">
          <Icon name="lock" />
          <h1>Not authorised</h1>
          <p>
            This account isn't on the admin list. Ask the site owner to add your
            email to the <code>admins</code> table in Supabase.
          </p>
          <button className="btn btn--ghost" onClick={() => signOut()}>
            <Icon name="logout" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
