import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  referendumInfo,
  puntiChiave,
  affluenzaTempoReale as initialAffluenzaTempoReale,
  affluenzaRegioni as initialAffluenzaRegioni,
  affluenzaCitta as initialAffluenzaCitta,
  referendumStorici as initialReferendumStorici,
  sondaggi,
  propensionePartiti,
  affluenzaPerArea as initialAffluenzaPerArea,
  timelineEventi
} from "../shared/referendumData";

// In-memory data
let liveData = {
  referendumInfo,
  puntiChiave,
  affluenzaTempoReale: [...initialAffluenzaTempoReale],
  affluenzaRegioni: [...initialAffluenzaRegioni],
  affluenzaCitta: [...initialAffluenzaCitta],
  referendumStorici: [...initialReferendumStorici],
  sondaggi,
  propensionePartiti,
  affluenzaPerArea: [...initialAffluenzaPerArea],
  timelineEventi,
  // Add global projections
  proiezioneYoodata: 60,
  proiezioneIpsos: 49
};

export async function registerRoutes(
  app: Express,
  httpServer?: Server
) {
  // Public endpoint for dashboard data
  app.get("/api/dashboard", (req, res) => {
    res.json(liveData);
  });

  // Secret endpoint to update data (e.g. POST /api/dashboard?token=SECRET)
  app.post("/api/dashboard", (req, res) => {
    const token = req.query.token;
    if (token !== "AggiornaSubito2026") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Merge the incoming JSON with the liveData
    const payload = req.body;
    
    if (payload.affluenzaTempoReale) {
      liveData.affluenzaTempoReale = payload.affluenzaTempoReale;
    }
    if (payload.affluenzaRegioni) {
      liveData.affluenzaRegioni = payload.affluenzaRegioni;
    }
    if (payload.affluenzaCitta) {
      liveData.affluenzaCitta = payload.affluenzaCitta;
    }
    if (payload.affluenzaPerArea) {
      liveData.affluenzaPerArea = payload.affluenzaPerArea;
    }
    if (payload.referendumStorici) {
      liveData.referendumStorici = payload.referendumStorici;
    }
    if (payload.proiezioneYoodata !== undefined) {
      liveData.proiezioneYoodata = payload.proiezioneYoodata;
    }

    res.json({ success: true, liveData });
  });

  return httpServer || app;
}
