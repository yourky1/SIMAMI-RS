import bcrypt from "bcryptjs";
import express from "express";
import { z } from "zod";
import { supabase } from "../config/supabase.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.enum(["Administrator", "Petugas Bangsal", "Teknisi"]),
  unit: z.string().min(2),
  status: z.string().default("Aktif")
});

function ensureDb() {
  if (!supabase) {
    const err = new Error("Supabase belum dikonfigurasi di backend.");
    err.statusCode = 503;
    throw err;
  }
}

router.get("/", requireAuth, allowRoles("Administrator"), asyncHandler(async (req, res) => {
  ensureDb();
  const { data, error } = await supabase.from("users").select("id, name, email, role, unit, status, created_at").order("created_at", { ascending: false });
  if (error) throw error;
  res.json({ data });
}));

router.post("/", requireAuth, allowRoles("Administrator"), asyncHandler(async (req, res) => {
  ensureDb();
  const payload = schema.parse(req.body);
  const passwordHash = await bcrypt.hash(payload.password || "password", 10);

  const { data, error } = await supabase
    .from("users")
    .insert({
      name: payload.name,
      email: payload.email,
      password_hash: passwordHash,
      role: payload.role,
      unit: payload.unit,
      status: payload.status
    })
    .select("id, name, email, role, unit, status, created_at")
    .single();

  if (error) throw error;
  res.status(201).json({ data });
}));

export default router;
