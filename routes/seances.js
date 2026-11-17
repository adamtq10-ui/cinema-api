import { Router } from "express";
import { films, seances, prochainId, placesRestantes } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

router.post("/", (req, res) => {
  const { filmId, date, heure, salle, places } = req.body;
  if (!date || !heure || !salle || !Number.isInteger(places) || places < 1) {
    return res.status(400).json({ erreur: "date, heure, salle et places (>= 1) obligatoires" });
  }
  if (!films.some(f => f.id === filmId)) {
    return res.status(404).json({ erreur: "Film introuvable" });
  }
  const seance = { id: prochainId(seances), filmId, date, heure, salle, places };
  seances.push(seance);
  res.status(201).json(seance);
});

router.get("/:id", validerId, (req, res) => {
  const seance = seances.find(s => s.id === req.id);
  if (!seance) return res.status(404).json({ erreur: "Séance introuvable" });
  res.json({ ...seance, placesRestantes: placesRestantes(seance) });
});

export default router;