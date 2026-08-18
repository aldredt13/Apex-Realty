import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Profile } from "../lib/types";
import { recordLogin } from "../lib/loginAudit";

type AuthResult = { error?: string; info?: string };

type AuthCtx = {
  ready: boolean;
  adminReady: boolean;
  session: Session | null;
  profile: Profile | null;
  /** signed in and has a dashboard profile */
  isStaff: boolean;
  /** main account — sees and manages everything */
  isOwner: boolean;
  /** super admin — can view the private login audit */
  isSuper: boolean;
  /** kept for existing checks; same as isStaff */
  isAdmin: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  ready: false,
  adminReady: false,
  session: null,
  profile: null,
  isStaff: false,
  isOwner: false,
  isSuper: false,
  isAdmin: false,
  configured: false,
  signIn: async () => ({ error: "Not configured" }),
  signUp: async () => ({ error: "Not configured" }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);
  // false while the async profile lookup is running for the current session
  const [adminReady, setAdminReady] = useState(!isSupabaseConfigured);

  // Load the signed-in user's dashboard profile (role, avatar, name…).
  async function loadProfile(current: Session | null): Promise<Profile | null> {
    if (!current || !supabase) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", current.user.id)
      .maybeSingle();
    return (data as Profile) ?? null;
  }

  useEffect(() => {
    if (!supabase) return;

    async function resolve(current: Session | null, gate: boolean) {
      if (!current) {
        setProfile(null);
        setAdminReady(true);
        return;
      }
      if (gate) setAdminReady(false);
      setProfile(await loadProfile(current));
      setAdminReady(true);
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await resolve(data.session, true);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setAdminReady(true);
        return;
      }
      // Only show the checking state on a fresh sign-in, not token refreshes.
      resolve(next, event === "SIGNED_IN");
      // Log the sign-in (IP + device captured server-side from the request).
      if (event === "SIGNED_IN") {
        recordLogin().catch(() => {
          /* auditing must never block sign-in */
        });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    setProfile(await loadProfile(session));
  };

  const isStaff = Boolean(profile?.active);
  const isOwner = profile?.role === "owner" && Boolean(profile?.active);
  const isSuper = Boolean(profile?.is_super && profile?.active);

  // Accepts an email address or a username. Usernames are resolved to the
  // account's email server-side, and only when the password is also correct.
  const signIn: AuthCtx["signIn"] = async (identifier, password) => {
    if (!supabase) return { error: "Supabase is not configured." };
    let email = identifier.trim();

    if (!email.includes("@")) {
      const { data, error } = await supabase.rpc("email_for_credentials", {
        p_username: email,
        p_password: password,
      });
      if (error) return { error: error.message };
      if (!data) return { error: "Incorrect username or password." };
      email = data as string;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Keep the message generic so it doesn't reveal which part was wrong.
      return { error: /invalid login/i.test(error.message)
        ? "Incorrect username or password."
        : error.message };
    }
    return {};
  };

  const signUp: AuthCtx["signUp"] = async (email, password) => {
    if (!supabase) return { error: "Supabase is not configured." };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user && !data.session) {
      return { info: "Check your email to confirm your account, then sign in." };
    }
    return {};
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        ready,
        adminReady,
        session,
        profile,
        isStaff,
        isOwner,
        isSuper,
        isAdmin: isStaff,
        configured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthCtx {
  return useContext(AuthContext);
}
