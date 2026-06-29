import type { Request, Response } from "express";
import UserModel from "../models/User.model.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import transporter from "../config/mail.js";
import VerificationTokenModel from "../models/VerificationToken.model.js";
import { generateVerificationToken } from "../utils/token.js";
;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      provider: "local",
      isVerified: false,
    });

    // 1. generate verification token
    const token = generateVerificationToken();

    await VerificationTokenModel.create({
      userId: user._id,
      token,
    });

    // 2. create verification link
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}&id=${user._id}`;

    // 3. send email
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify your AI Battle account",
      html: `
        <h2>Welcome ${username}</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyLink}">Verify Email</a>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

import { comparePassword } from "../utils/hash.js";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    if (user.provider === "local" && user.password) {
      const isMatch = await comparePassword(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    }

    const token = generateToken(user._id.toString());

    // ✅ Set cookie with all options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // ✅ Ensure cookie is available on all paths
    });

    console.log("✅ Cookie set with token:", token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token, // Still send in response for reference
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

import mongoose from 'mongoose';

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    // Cast both to strings
    const token = req.query.token as string;
    const id = req.query.id as string;

    if (!token || !id) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    // Convert string id to ObjectId
    const userId = new mongoose.Types.ObjectId(id);

    // find token record
    const savedToken = await VerificationTokenModel.findOne({
      userId: userId,
      token: token,  // Now token is a string
    });

    if (!savedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // activate user
    await UserModel.findByIdAndUpdate(userId, {
      isVerified: true,
    });

    // delete token
    await VerificationTokenModel.deleteOne({
      _id: savedToken._id,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
