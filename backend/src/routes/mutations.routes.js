import express from "express";
import { z } from "zod";
import { supabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const schema = z.object({
  asset_id: z.string(),
  from_location: z.string(),
  to_location: z.string(),
  officer: z.string(),
  note: z.string().optional().nullable(),
  status: z.string().default("Belum kembali")
});

function ensureDb() {
  if (!supabase) {
    const err = new Error("Supabase belum dikonfigurasi di backend.");
    err.statusCode = 503;
    throw err;
  }
}

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const { data, error } = await supabase
    .from("asset_mutations")
    .select("*, assets(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  res.json({ data });
}));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const payload = schema.parse(req.body);

  const { data, error } = await supabase.from("asset_mutations").insert(payload).select("*").single();
  if (error) throw error;

  await supabase
    .from("assets")
    .update({
      location: payload.to_location,
      status: payload.status === "Selesai" ? "Tersedia" : "Dipinjam",
      updated_at: new Date().toISOString()
    })
    .eq("id", payload.asset_id);

  res.status(201).json({ data });
}));

export default router;
