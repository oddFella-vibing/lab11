// @ts-nocheck
import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", (req: Request, res: Response) => res.render("home"));

router.get("/login", (req: Request, res: Response) => {
  // Map codes to friendly messages (UI Polish)
  const errorMap = {
    invalid: "Invalid email or password.",
    too_many_attempts: "Too many login attempts. Please wait 15 minutes.",
    exists: "That email is already registered.",
  };

  const msgMap = {
    registered: "Welcome! Your account is ready. Please log in.",
    logged_out: "You have been safely logged out.",
  };

  const err = errorMap[req.query.err] || null;
  const msg = msgMap[req.query.msg] || null;

  res.render("login", { err, msg });
});

router.get("/profile", requireAuth, (req: Request, res: Response) => {
  // Pass the user object to the profile view
  res.render("profile", { user: (req as any).user });
});

export default router;
