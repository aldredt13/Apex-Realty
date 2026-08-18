import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/Logo";
import Icon from "../../components/Icon";
import Avatar from "../../components/Avatar";
import type { IconName } from "../../components/Icon";

type NavItem = {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
  ownerOnly?: boolean;
  superOnly?: boolean;
};

const links: NavItem[] = [
  { to: "/dashboard", label: "Listings", icon: "grid", end: true },
  { to: "/dashboard/submissions", label: "Enquiries", icon: "inbox" },
  { to: "/dashboard/team", label: "Team", icon: "users", ownerOnly: true },
  { to: "/dashboard/profile", label: "My Profile", icon: "briefcase" },
  { to: "/dashboard/settings", label: "Site Settings", icon: "settings", ownerOnly: true },
  { to: "/dashboard/security", label: "Login Activity", icon: "shield", superOnly: true },
];

export default function DashboardLayout() {
  const { session, signOut, profile, isOwner, isSuper } = useAuth();
  const visible = links.filter(
    (l) => (!l.ownerOnly || isOwner) && (!l.superOnly || isSuper)
  );

  return (
    <div className="dash">
      <aside className="dash__side">
        <div className="dash__brand">
          <Logo light />
        </div>

        <nav className="dash__nav">
          {visible.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `dash__link${isActive ? " is-active" : ""}`
              }
            >
              <Icon name={l.icon} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash__side-foot">
          <Link to="/" className="dash__link" target="_blank">
            <Icon name="external" />
            <span>View website</span>
          </Link>
          <button className="dash__link dash__link--btn" onClick={() => signOut()}>
            <Icon name="logout" />
            <span>Sign out</span>
          </button>
          {session?.user?.email && (
            <div className="dash__me">
              <Avatar url={profile?.avatar_url} name={profile?.full_name} size={34} />
              <div className="dash__me-text">
                <b>{profile?.full_name || session.user.email}</b>
                <span>{isOwner ? "Main account" : "Agent"}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="dash__main">
        <Outlet />
      </main>
    </div>
  );
}
