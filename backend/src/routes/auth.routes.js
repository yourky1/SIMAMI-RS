import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }

  if (!supabase) {
    const user = {
      id: "USR-001",
      name: "Akhmad Husni Assidiqi",
      email,
      role: "Administrator",
      unit: "Manajemen Aset"
    };

    const token = jwt.sign(user, process.env.JWT_SECRET || "dev-secret", { expiresIn: "8h" });
    return res.json({ token, user });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: "Email atau password salah." });
  }

  const valid = await bcrypt.compare(password, user.password_hash || "");
  if (!valid) {
    return res.status(401).json({ message: "Email atau password salah." });
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    unit: user.unit
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", { expiresIn: "8h" });

  res.json({ token, user: payload });
}));

export default router;
