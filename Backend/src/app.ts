// backend/src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { processAIBattle } from "./services/chat.service.js";
import type { AuthRequest } from "./middleware/auth.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// ✅ Use environment variable for CORS
const allowedOrigins = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "ai_battle_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Debug middleware to check cookies
app.use((req, res, next) => {
  console.log('🔍 All Cookies:', req.cookies);
  console.log('🔍 Token Cookie:', req.cookies?.token);
  console.log('🔍 Authorization Header:', req.headers.authorization);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "okay",
  });
});

app.post(
  "/use-graph",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { message, chatId } = req.body;
      const userId = req.userId as string;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "message is required",
        });
      }

      const result = await processAIBattle(userId, message, chatId);

      return res.json({
        success: true,
        message: "AI battle completed",
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

app.use(errorMiddleware);

export default app;