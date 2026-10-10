import { getSession } from "./auth";

export function isAdminEmail(email: string): boolean {
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

// Returns the session only if the signed-in user is an admin, otherwise null.
export async function getAdminSession() {
  const session = await getSession();
  if (!session || !isAdminEmail(session.email)) return null;
  return session;
}
