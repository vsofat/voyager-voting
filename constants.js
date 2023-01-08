export const GOOGLE_CLIENT_ID =
  process.env.NEXT_APP_GOOGLE_CLIENT_ID ||
  "432468212991-rv1gecbee82aiiugi4vtl7tru5dqrtp0.apps.googleusercontent.com";

export const PUBLIC_URL =
  process.env.PUBLIC_URL || process.env.NODE_ENV === "production"
    ? "https://voyager-voting.vercel.app"
    : "https://localhost:3000";
