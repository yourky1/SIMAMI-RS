import express from "express";
import { supabase } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

function ensureDb() {
  if (!supabase) {
    const err = new Error("Supabase belum dikonfigurasi di backend.");
    err.statusCode = 503;
    throw err;
  }
}

router.get("/summary", requireAuth, asyncHandler(async (req, res) => {
  ensureDb();

  const { data: assets, error: assetsError } = await supabase.from("assets").select("*");
  if (assetsError) throw assetsError;

  const { data: mutations, error: mutationsError } = await supabase.from("asset_mutations").select("*");
  if (mutationsError) throw mutationsError;

  const { data: maintenance, error: maintenanceError } = await supabase.from("maintenance_records").select("*");
  if (maintenanceError) throw maintenanceError;

  const byLocation = assets.reduce((acc, asset) => {
    acc[asset.location] = (acc[asset.location] || 0) + 1;
    return acc;
  }, {});

  const byStatus = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    data: {
      total_assets: assets.length,
      total_mutations: mutations.length,
      total_maintenance: maintenance.length,
      by_location: byLocation,
      by_status: byStatus
    }
  });
}));

export default router;
