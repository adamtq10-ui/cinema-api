import { Router } from "express";
import { seances, reservations, prochainId, placesRestantes } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

router.post("/seances/:id/reservations", validerId, (req, res) => {
  const { nom, nbPlaces } = req.body;
  if (!nom || !Number.isInteger(nbPlaces) || nbPlaces < 1 || nbPlaces > 10) {
    return res.status(400).json({ erreur: "nom et nbPlaces (1 à 10) obligatoires" });
  }
  const seance = seances.find(s => s.id === req.id);
  if (!seance) return res.status(404).json({ erreur: "Séance introuvable" });
  if (nbPlaces > placesRestantes(seance)) {
    return res.status(409).json({ erreur: "Pas assez de places" });
  }
  const reservation = { id: prochainId(reservations), seanceId: seance.id, nom, nbPlaces };
  reservations.push(reservation);
  res.status(201).json(reservation);
});

router.get("/seances/:id/reservations", validerId, (req, res) => {
  const seance = seances.find(s => s.id === req.id);
  if (!seance) return res.status(404).json({ erreur: "Séance introuvable" });
  res.json(reservations.filter(r => r.seanceId === seance.id));
});

router.delete("/reservations/:id", validerId, (req, res) => {
  const index = reservations.findIndex(r => r.id === req.id);
  if (index === -1) return res.status(404).json({ erreur: "Réservation introuvable" });
  reservations.splice(index, 1);
  res.status(204).end();
});

export default router;
