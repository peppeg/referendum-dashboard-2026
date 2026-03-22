import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // The production server bundle is emitted into `dist/index.cjs` and the
  // Vite client build is emitted alongside it in the same `dist/` directory.
  const buildPath = __dirname;
  if (!fs.existsSync(path.resolve(buildPath, "index.html"))) {
    throw new Error(
      `Could not find the client build in: ${buildPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(buildPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
}
