import { createCookieSessionStorage } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "adminCookies",
    secrets: [process.env.SESSION_SECRET!],
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: false,
    // secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
