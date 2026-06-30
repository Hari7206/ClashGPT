// backend/config/passport.js
import dotenv from 'dotenv';
dotenv.config(); // ✅ Add this at the top

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/User.model.js";

// Debug: Check if environment variables are loaded
console.log("🔍 Passport Config Loading...");
console.log("📧 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Loaded" : "❌ Not loaded");
console.log("🔑 GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ Loaded" : "❌ Not loaded");
console.log("🔗 GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);

// Serialization functions
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
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