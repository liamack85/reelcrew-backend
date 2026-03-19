import express from "express";
const router = express.Router();
export default router;

import {
  getUserFilms,
  getUserFilmById,
  addUserFilm,
  deleteUserFilm,
  updateUserFilm,
} from "#db/queries/user_films";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

router.get("/", async (req, res) => {
  const userFilms = await getUserFilms(req.user.id);
  res.send(userFilms);
});

router.post("/", requireBody(["filmId"]), async (req, res) => {
  const { filmId } = req.body;
  const userFilm = await addUserFilm(req.user.id, filmId);
  res.status(201).send(userFilm);
});

router.param("id", async (req, res, next, id) => {
  const userFilm = await getUserFilmById(id);
  if (!userFilm) return res.status(404).send("Film not found.");
  if (userFilm.user_id !== req.user.id)
    return res.status(403).send("Permissions required");
  req.userFilm = userFilm;
  next();
});

router.patch("/:id", async (req, res) => {
  const { status, rating } = req.body;
  const userFilm = await updateUserFilm(req.userFilm.id, { status, rating });
  res.send(userFilm);
});

router.delete("/:id", async (req, res) => {
  await deleteUserFilm(req.userFilm.id);
  res.status(204);
});
