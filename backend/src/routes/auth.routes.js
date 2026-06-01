import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Akun demo untuk pengembangan (dicek sebelum Supabase)
const DEMO_ACCOUNTS = [
  { id: "USR-001", name: "Akhmad Husni Assidiqi", email: "admin.simami@permata-medika.id", password: "password", role: "Administrator", unit: "Manajemen Aset" },
  { id: "USR-002", name: "Siti Aminah", email: "siti@permata-medika.id", password: "password", role: "Petugas Bangsal", unit: "Bangsal Mawar" },
  { id: "USR-003", name: "Budi Santoso", email: "budi@permata-medika.id", password: "password", role: "Teknisi", unit: "Elektromedis" },
  { id: "USR-004", name: "Nur Halimah", email: "nur@permata-medika.id", password: "password", role: "Petugas Bangsal", unit: "ICU" }
];

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }

  // Cek demo accounts terlebih dahulu
  const demoAccount = DEMO_ACCOUNTS.find((a) => a.email === email && a.password === password);
  if (demoAccount) {
    const { password: _, ...userPayload } = demoAccount;
    const token = jwt.sign(userPayload, process.env.JWT_SECRET || "dev-secret", { expiresIn: "8h" });
    return res.json({ token, user: userPayload });
  }

  // Jika bukan demo, cari di Supabase
  if (!supabase) {
    return res.status(401).json({ message: "Email atau password salah." });
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

