import express from "express";
import { z } from "zod";
import { supabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const schema = z.object({
  asset_id: z.string(),
  technician: z.string(),
  scheduled_date: z.string(),
  result: z.string().optional().nullable(),
  status: z.string().default("Terjadwal")
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
    .from("maintenance_records")
    .select("*, assets(name)")
    .order("scheduled_date", { ascending: true });
  if (error) throw error;
  res.json({ data });
}));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const payload = schema.parse(req.body);
  const { data, error } = await supabase.from("maintenance_records").insert(payload).select("*").single();
  if (error) throw error;

  await supabase
    .from("assets")
    .update({ status: "Maintenance", updated_at: new Date().toISOString() })
    .eq("id", payload.asset_id);

  res.status(201).json({ data });
}));

router.put("/:id", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const payload = schema.partial().parse(req.body);
  const { data, error } = await supabase
    .from("maintenance_records")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .select("*")
    .single();
  if (error) throw error;
  res.json({ data });
}));

export default router;
