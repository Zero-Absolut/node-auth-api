import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { config } from "./config.js";
import { googleLoginService } from "../service/googleService.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,

      callbackURL: "/api/auth/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("PROFILE:", profile);

        const user = await googleLoginService({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });

        console.log("USER RETORNADO:", user);

        return done(null, user);
      } catch (error) {
        console.error("ERRO NA STRATEGY:", error);

        return done(error, null);
      }
    },
  ),
);

export default passport;
