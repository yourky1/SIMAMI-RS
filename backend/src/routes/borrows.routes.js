import express from "express";
import { z } from "zod";
import { supabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

const createSchema = z.object({
  asset_id: z.string(),
  borrower: z.string(),
  borrower_role: z.string().optional(),
  unit: z.string(),
  from_location: z.string(),
  to_location: z.string(),
  purpose: z.string(),
  expected_return: z.string().optional().nullable()
});

function ensureDb() {
  if (!supabase) {
    const err = new Error("Supabase belum dikonfigurasi di backend.");
    err.statusCode = 503;
    throw err;
  }
}

function timeline(status) {
  const now = new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  if (status === "Menunggu Persetujuan") {
    return [
      { label: "Pengajuan dibuat", time: now, done: true },
      { label: "Menunggu approval admin", time: "-", done: false },
      { label: "Alat diserahkan", time: "-", done: false },
      { label: "Pengembalian", time: "-", done: false }
    ];
  }
  return [];
}

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const { data, error } = await supabase
    .from("borrow_requests")
    .select("*, assets(name)")
    .order("requested_at", { ascending: false });
  if (error) throw error;
  res.json({ data });
}));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const payload = createSchema.parse(req.body);

  const { data, error } = await supabase
    .from("borrow_requests")
    .insert({
      ...payload,
      borrower_role: payload.borrower_role || "Petugas Bangsal",
      status: "Menunggu Persetujuan",
      timeline: timeline("Menunggu Persetujuan")
    })
    .select("*")
    .single();

  if (error) throw error;
  res.status(201).json({ data });
}));

router.patch("/:id/status", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();
  const { status } = z.object({ status: z.string() }).parse(req.body);

  const { data: request, error: readError } = await supabase
    .from("borrow_requests")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (readError || !request) {
    return res.status(404).json({ message: "Pengajuan peminjaman tidak ditemukan." });
  }

  const { data, error } = await supabase
    .from("borrow_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .select("*")
    .single();

  if (error) throw error;

  if (status === "Sedang Dipinjam") {
    await supabase
      .from("assets")
      .update({ status: "Dipinjam", location: request.to_location, updated_at: new Date().toISOString() })
      .eq("id", request.asset_id);
  }

  if (status === "Selesai") {
    await supabase
      .from("assets")
      .update({ status: "Tersedia", location: request.from_location, updated_at: new Date().toISOString() })
      .eq("id", request.asset_id);
  }

  res.json({ data });
}));

export default router;
