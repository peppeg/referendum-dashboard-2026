import type { Express, Request } from "express";
import type { Server } from "http";
import {
  dashboardSeedData,
  isDashboardData,
  mergeDashboardData,
  type DashboardData,
  type DashboardDataPatch,
} from "../shared/dashboardData.js";

let liveData: DashboardData = dashboardSeedData;

function getRefreshToken() {
  const value = process.env.DASHBOARD_REFRESH_TOKEN?.trim();
  return value ? value : null;
}

function isAuthorizedRefreshRequest(req: Request) {
  const expectedToken = getRefreshToken();
  if (!expectedToken) {
    return false;
  }

  const bearerHeader = req.header("authorization");
  const bearerToken = bearerHeader?.startsWith("Bearer ")
    ? bearerHeader.slice("Bearer ".length)
    : undefined;

  return bearerToken === expectedToken;
}

export async function registerRoutes(
  app: Express,
  httpServer?: Server,
) {
  // Results are frozen after the final official count, so the dashboard now serves a static snapshot.
  app.get("/api/dashboard", (_req, res) => {
    res.json(liveData);
  });

  if (getRefreshToken()) {
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
  }

  return httpServer || app;
}
