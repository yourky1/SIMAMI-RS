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

const updateStatusSchema = z.object({
  status: z.enum([
    "Menunggu Persetujuan",
    "Disetujui",
    "Sedang Dipinjam",
    "Selesai",
    "Ditolak"
  ])
});

function ensureDb() {
  if (!supabase) {
    const err = new Error("Supabase belum dikonfigurasi di backend.");
    err.statusCode = 503;
    throw err;
  }
}

function formatTime(value = new Date()) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta"
  });
}

function initialTimeline(requestedAt = new Date()) {
  return [
    { label: "Pengajuan dibuat", time: formatTime(requestedAt), done: true },
    { label: "Menunggu approval admin", time: "-", done: false },
    { label: "Alat diserahkan", time: "-", done: false },
    { label: "Pengembalian", time: "-", done: false }
  ];
}

function completedTime(currentTimeline, index, fallbackTime) {
  const step = Array.isArray(currentTimeline) ? currentTimeline[index] : null;
  return step?.done && step?.time && step.time !== "-" ? step.time : fallbackTime;
}

function buildTimeline(currentTimeline, status, requestedAt) {
  const now = formatTime();
  const existing =
    Array.isArray(currentTimeline) && currentTimeline.length === 4
      ? currentTimeline
      : initialTimeline(requestedAt);

  const requestedTime =
    existing[0]?.time && existing[0].time !== "-"
      ? existing[0].time
      : formatTime(requestedAt);

  if (status === "Menunggu Persetujuan") {
    return initialTimeline(requestedAt);
  }

  if (status === "Ditolak") {
    return [
      { label: "Pengajuan dibuat", time: requestedTime, done: true },
      { label: "Pengajuan ditolak", time: now, done: true },
      { label: "Alat diserahkan", time: "-", done: false },
      { label: "Pengembalian", time: "-", done: false }
    ];
  }

  const approvedTime = completedTime(existing, 1, now);

  if (status === "Disetujui") {
    return [
      { label: "Pengajuan dibuat", time: requestedTime, done: true },
      { label: "Disetujui admin", time: approvedTime, done: true },
      { label: "Alat diserahkan", time: "-", done: false },
      { label: "Pengembalian", time: "-", done: false }
    ];
  }

  const handedTime = completedTime(existing, 2, now);

  if (status === "Sedang Dipinjam") {
    return [
      { label: "Pengajuan dibuat", time: requestedTime, done: true },
      { label: "Disetujui admin", time: approvedTime, done: true },
      { label: "Alat diserahkan", time: handedTime, done: true },
      { label: "Pengembalian", time: "-", done: false }
    ];
  }

  if (status === "Selesai") {
    return [
      { label: "Pengajuan dibuat", time: requestedTime, done: true },
      { label: "Disetujui admin", time: approvedTime, done: true },
      { label: "Alat diserahkan", time: handedTime, done: true },
      { label: "Pengembalian", time: now, done: true }
    ];
  }

  return existing;
}

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    ensureDb();

    const { data, error } = await supabase
      .from("borrow_requests")
      .select("*, assets(name)")
      .order("requested_at", { ascending: false });

    if (error) throw error;

    res.json({ data });
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    ensureDb();

    const payload = createSchema.parse(req.body);
    const requestedAt = new Date();

    const { data, error } = await supabase
      .from("borrow_requests")
      .insert({
        ...payload,
        borrower_role: payload.borrower_role || "Petugas Bangsal",
        status: "Menunggu Persetujuan",
        requested_at: requestedAt.toISOString(),
        timeline: initialTimeline(requestedAt)
      })
      .select("*, assets(name)")
      .single();

    if (error) throw error;

    res.status(201).json({ data });
  })
);

router.patch(
  "/:id/status",
  requireAuth,
  asyncHandler(async (req, res) => {
    ensureDb();

    const { status } = updateStatusSchema.parse(req.body);

    const { data: request, error: readError } = await supabase
      .from("borrow_requests")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (readError || !request) {
      return res
        .status(404)
        .json({ message: "Pengajuan peminjaman tidak ditemukan." });
    }

    const updatedAt = new Date().toISOString();
    const nextTimeline = buildTimeline(
      request.timeline,
      status,
      request.requested_at
    );

    const { data, error } = await supabase
      .from("borrow_requests")
      .update({
        status,
        timeline: nextTimeline,
        updated_at: updatedAt
      })
      .eq("id", req.params.id)
      .select("*, assets(name)")
      .single();

    if (error) throw error;

    if (status === "Sedang Dipinjam") {
      const { error: assetError } = await supabase
        .from("assets")
        .update({
          status: "Dipinjam",
          location: request.to_location,
          updated_at: updatedAt
        })
        .eq("id", request.asset_id);

      if (assetError) throw assetError;
    }

    if (status === "Selesai") {
      const { error: assetError } = await supabase
        .from("assets")
        .update({
          status: "Tersedia",
          location: request.from_location,
          updated_at: updatedAt
        })
        .eq("id", request.asset_id);

      if (assetError) throw assetError;
    }

    res.json({ data });
  })
);

export default router;
