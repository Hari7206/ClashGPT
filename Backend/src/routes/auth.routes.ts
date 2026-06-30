// backend/routes/auth.routes.js
import express from "express";
import { registerUser, loginUser, verifyEmail } from "../controllers/auth.controller.js";
import passport from "../config/passport.js";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=authentication_failed`);
      }

      const token = generateToken(user._id.toString());

      // Encode user data for URL
      const userData = encodeURIComponent(
        JSON.stringify({
          id: user._id,
          username: user.username,
          email: user.email,
        })
      );

      // ✅ Redirect to home page with token
      const redirectUrl = `${process.env.CLIENT_URL}/?token=${token}&user=${userData}`;
      
      console.log("🔄 Redirecting to home:", redirectUrl);
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("❌ Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
    }
  }
);

export default router;