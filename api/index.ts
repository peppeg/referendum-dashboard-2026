import express from "express";
import { registerRoutes } from "../server/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all routes on the Express app
registerRoutes(app);

export default app;
