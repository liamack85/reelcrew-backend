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

/**
 * Require an authenticated user for all routes in this router.
 */
router.use(requireUser);

/**
 * Get all films for the authenticated user.
 */
router.get("/", async (req, res) => {
  const userFilms = await getUserFilms(req.user.id);
  res.send(userFilms);
});

/**
 * Add a film to the authenticated user's films.
 *
 * @param {number} req.body.filmId - ID of the film to add
 */
router.post("/", requireBody(["filmId"]), async (req, res) => {
  const { filmId } = req.body;
  const userFilm = await addUserFilm(req.user.id, filmId);
  res.status(201).send(userFilm);
});

/**
 * Param middleware to load a userFilm by ID and ensure the authenticated user owns it.
 * Attaches the userFilm to req.userFilm or returns 404/403.
 *
 * @param {number} id - userFilm id from route
 */
router.param("id", async (req, res, next, id) => {
  const userFilm = await getUserFilmById(id);
  if (!userFilm) return res.status(404).send("Film not found.");
  if (userFilm.user_id !== req.user.id)
    return res.status(403).send("Permissions required");
  req.userFilm = userFilm;
  next();
});

/**
 * Update a user film's status and/or rating.
 *
 * @param {string} [req.body.status] - New status (e.g., "watchlist" or "watched")
 * @param {number} [req.body.rating] - Optional rating
 * @returns {Object} Updated user film record
 */
router.patch("/:id", async (req, res) => {
  const { status, rating } = req.body;
  const userFilm = await updateUserFilm(req.userFilm.id, { status, rating });
  res.send(userFilm);
});

/**
 * Delete a user film (remove from the user's list).
 */
router.delete("/:id", async (req, res) => {
  await deleteUserFilm(req.userFilm.id);
  res.sendStatus(204);
});
