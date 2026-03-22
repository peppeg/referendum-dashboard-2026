import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import {
  dashboardSeedData,
  isDashboardData,
  mergeDashboardData,
  type DashboardData,
  type DashboardDataPatch,
} from "../shared/dashboardData.js";

const LEGACY_MANUAL_TOKEN = "AggiornaSubito2026";

let liveData: DashboardData = dashboardSeedData;

function getRefreshToken() {
  return process.env.DASHBOARD_REFRESH_TOKEN || LEGACY_MANUAL_TOKEN;
}

function isAuthorizedRefreshRequest(req: Request) {
  const expectedToken = getRefreshToken();
  const bearerHeader = req.header("authorization");
  const bearerToken = bearerHeader?.startsWith("Bearer ")
    ? bearerHeader.slice("Bearer ".length)
    : undefined;

  return req.query.token === expectedToken || bearerToken === expectedToken;
}

export async function registerRoutes(
  app: Express,
  httpServer?: Server
) {
  // Public endpoint for dashboard data
  app.get("/api/dashboard", (_req, res) => {
    res.json(liveData);
  });

  // Secret endpoint to update data (e.g. POST /api/dashboard?token=SECRET)
  app.post("/api/dashboard", (req, res) => {
    if (!isAuthorizedRefreshRequest(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = req.body as DashboardData | DashboardDataPatch;
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    liveData = isDashboardData(payload)
      ? payload
      : mergeDashboardData(liveData, payload);

    res.json({
      success: true,
      liveData,
    });
  });

  return httpServer || app;
}
