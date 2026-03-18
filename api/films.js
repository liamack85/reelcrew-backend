import express from "express";
const router = express.Router();
export default router;

import { getFilmById, getFilms } from "#db/queries/films";

router.get("/", async (req, res) => {
    const films = await getFilms();
    res.send(films);
  });

router.param("id", async (req, res, next, id) => {
  const film = await getFilmById(id);
  if (!film) return res.status(404).send("Film not found.");

  req.film = film;
  next();
});  

router.get("/:id", async (req, res) => {
  res.send(req.film);
});
