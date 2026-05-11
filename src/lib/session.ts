import { cookies } from "next/headers";

const COOKIE_NAME = "official_ai_session";

export async function getSessionUserId() {
  return (await cookies()).get(COOKIE_NAME)?.value ?? null;
}

export async function setSessionUserId(userId: string) {
  (await cookies()).set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearSessionUserId() {
  (await cookies()).delete(COOKIE_NAME);
}
