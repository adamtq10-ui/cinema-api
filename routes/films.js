import { Router } from "express";
import { films, seances, prochainId } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

router.get("/", (req, res) => {
  let resultat = [...films];
  if (req.query.genre) resultat = resultat.filter(f => f.genre === req.query.genre);
  if (req.query.tri === "duree") resultat.sort((a, b) => a.duree - b.duree);
  res.json(resultat);
});

router.get("/:id", validerId, (req, res) => {
  const film = films.find(f => f.id === req.id);
  if (!film) return res.status(404).json({ erreur: "Film introuvable" });
  res.json(film);
});

router.get("/:id/seances", validerId, (req, res) => {
  const film = films.find(f => f.id === req.id);
  if (!film) return res.status(404).json({ erreur: "Film introuvable" });
  res.json(seances.filter(s => s.filmId === film.id));
});

router.post("/", (req, res) => {
  const { titre, genre, duree } = req.body;
  if (!titre || !genre || typeof duree !== "number" || duree <= 0) {
    return res.status(400).json({ erreur: "titre, genre et duree (> 0) obligatoires" });
  }
  if (films.some(f => f.titre.toLowerCase() === titre.toLowerCase())) {
    return res.status(409).json({ erreur: "Ce film existe déjà" });
  }
  const film = { id: prochainId(films), titre, duree, genre };
  films.push(film);
  res.status(201).json(film);
});

router.delete("/:id", validerId, (req, res) => {
  const index = films.findIndex(f => f.id === req.id);
  if (index === -1) return res.status(404).json({ erreur: "Film introuvable" });
  if (seances.some(s => s.filmId === req.id)) {
    return res.status(409).json({ erreur: "Ce film a encore des séances" });
  }
  films.splice(index, 1);
  res.status(204).end();
});

export default router;