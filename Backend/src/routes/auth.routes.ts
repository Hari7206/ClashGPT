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
    const user = req.user as any;

    const token = generateToken(user._id.toString());

    return res.json({
      success: true,
      message: "Google login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      },
    });
  }
);



export default router;