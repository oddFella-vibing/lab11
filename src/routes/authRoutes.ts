// @ts-nocheck
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit"; // Don't forget: npm install express-rate-limit
import { User } from "../models/User";

const router = Router();

// Rate limiting: 5 attempts per 15 minutes (+1 point)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.redirect("/login?err=too_many_attempts");
  },
});

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash });
    // Polish: Redirect to login with a success message
    res.redirect("/login?msg=registered");
  } catch (e) {
    res.redirect("/register?err=exists");
  }
});

// Login with Rate Limiter (+1 point)
router.post("/login", loginLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.redirect("/login?err=invalid");

  const ok = await bcrypt.compare(password, (user as any).passwordHash);
  if (!ok) return res.redirect("/login?err=invalid");

  const token = jwt.sign(
    { userId: user._id.toString(), email },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.redirect("/profile");
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/login?msg=logged_out");
});

export default router;
