import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      discord_UID?: string;
      username?: string;
      accessToken?: string;
      refreshToken?: string;
    };
  }
}
