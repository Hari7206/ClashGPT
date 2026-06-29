import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // ✅ Check cookie first (this should work now with cookie-parser)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log("✅ Token from cookie:", token);
    }

    // ✅ If no cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      console.log("Authorization Header:", authHeader);
      
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        console.log("✅ Token from header:", token);
      }
    }

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login first.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = decoded.id;
    console.log("✅ User authenticated:", req.userId);
    next();
  } catch (error) {
    console.error("❌ Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};