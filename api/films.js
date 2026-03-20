import express from "express";
const router = express.Router();
export default router;

import {
  getFilmByApiId,
  getFilmById,
  getFilms,
  searchFilms,
  upsertFilm,
} from "#db/queries/films";

const OMDB_KEY = process.env.OMDB_KEY;

router.get("/", async (req, res) => {
  const { q, genre } = req.query;
  if (q || genre) {
    const films = await searchFilms(q, genre);
    return res.send(films);
  }
  const films = await getFilms();
  res.send(films);
});

router.get("/api/:apiId", async (req, res) => {
  const { apiId } = req.params;

  const cached = await getFilmByApiId(apiId);
  if (cached) {
    return res.send({ source: "cache", film: cached });
  }
  if (!OMDB_KEY) return res.status(404).send("Film not found.");
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${apiId}&plot=short`,
  );
  const data = await response.json();
  if (data.Response === "False") {
    return res.status(404).send("Film not found.");
  }

  const film = await upsertFilm({
    api_id: data.imdbID,
    title: data.Title,
    year: parseInt(data.Year) || null,
    director: data.Director !== "N/A" ? data.Director : null,
    runtime: data.Runtime !== "N/A" ? data.Runtime : null,
    description: data.Plot !== "N/A" ? data.Plot : null,
    poster_url: data.Poster !== "N/A" ? data.Poster : null,
    genre: data.Genre !== "N/A" ? data.Genre : null,
    rating: parseFloat(data.imdbRating) || null,
  });
  res.send({ source: "omdb", film });
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
