import { supabase } from "./supabase";
import type { Profile, UserRole } from "./types";

export type NewMember = {
  email: string;
  username?: string;
  password: string;
  full_name: string;
  phone?: string;
  title?: string;
  role?: UserRole;
};

export async function listTeam(): Promise<Profile[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: true })
    .order("full_name", { ascending: true });
  return (data as Profile[]) ?? [];
}

/** Creates the auth account + profile in one call (owners only, enforced in SQL). */
export async function createTeamMember(m: NewMember): Promise<{ error?: string }> {
  if (!supabase) return { error: "Supabase is not configured." };
  const { error } = await supabase.rpc("create_team_member", {
    p_email: m.email,
    p_password: m.password,
    p_full_name: m.full_name,
    p_phone: m.phone ?? null,
    p_title: m.title ?? null,
    p_role: m.role ?? "agent",
    p_username: m.username ?? null,
  });
  return error ? { error: error.message } : {};
}

export async function updateMember(
  id: string,
  patch: Partial<Pick<Profile, "full_name" | "phone" | "title" | "role" | "active" | "avatar_url" | "username">>
): Promise<{ error?: string }> {
  if (!supabase) return { error: "Supabase is not configured." };
  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  return error ? { error: error.message } : {};
}

export async function resetMemberPassword(
  id: string,
  password: string
): Promise<{ error?: string }> {
  if (!supabase) return { error: "Supabase is not configured." };
  const { error } = await supabase.rpc("set_team_member_password", {
    p_user_id: id,
    p_password: password,
  });
  return error ? { error: error.message } : {};
}

/** Removing a profile cascades from auth.users; we deactivate instead (safer). */
export async function setMemberActive(id: string, active: boolean) {
  return updateMember(id, { active });
}
