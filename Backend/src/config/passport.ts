import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/User.model.js";
import config from "./config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        
        if (!email) {
          return done(new Error("No email found from Google profile"), false);
       
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
          user = await UserModel.create({
            username: profile.displayName,
            email: email,
            provider: "google",
            isVerified: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
       
      }
    }
  )
);

export default passport;