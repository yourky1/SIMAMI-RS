import express from "express";
import { z } from "zod";
import { supabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAssetQrDataUrl } from "../utils/qrcode.js";

const router = express.Router();

const assetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  category: z.string().min(2),
  serial_number: z.string().optional().nullable(),
  location: z.string().min(2),
  status: z.string().min(2),
  condition: z.string().min(2),
  procurement_date: z.string().optional().nullable(),
  unit_owner: z.string().optional().nullable(),
  next_maintenance: z.string().optional().nullable(),
  note: z.string().optional().nullable()
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
  const { data, error } = await supabase.from("assets").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  res.json({ data });
}));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const payload = assetSchema.parse(req.body);
  const { data, error } = await supabase.from("assets").insert(payload).select("*").single();
  if (error) throw error;
  res.status(201).json({ data });
}));

router.get("/:id", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const { data, error } = await supabase.from("assets").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ message: "Aset tidak ditemukan." });
  res.json({ data });
}));

router.put("/:id", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const payload = assetSchema.partial().parse(req.body);
  const { data, error } = await supabase
    .from("assets")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .select("*")
    .single();
  if (error) throw error;
  res.json({ data });
}));

router.delete("/:id", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const { error } = await supabase.from("assets").delete().eq("id", req.params.id);
  if (error) throw error;
  res.json({ message: "Aset berhasil dihapus." });
}));

router.get("/:id/qr", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const { data: asset, error } = await supabase.from("assets").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ message: "Aset tidak ditemukan." });

  const qr = await generateAssetQrDataUrl(asset);
  res.json({ data: { asset_id: asset.id, qr } });
}));

export default router;
