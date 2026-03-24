import db from "#db/client";

/**
 * Inserts a new film into the database.
 * @param {*} api_id
 * @param {*} title
 * @param {*} year
 * @param {*} director
 * @param {*} runtime_mins
 * @param {*} description
 * @param {*} poster_url
 * @param {*} genre
 * @param {*} rating
 * @returns
 */
export async function createFilm({
  api_id,
  title,
  year,
  director,
  runtime,
  description,
  poster_url,
  genre,
  rating,
}) {
  const sql = `
  INSERT INTO films
    (api_id, title, year, director, runtime, description, poster_url, genre, rating)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *
  `;
  const {
    rows: [film],
  } = await db.query(sql, [
    api_id,
    title,
    year,
    director,
    runtime,
    description,
    poster_url,
    genre,
    rating,
  ]);
  return film;
}

/**
 * Inserts a film or updates it if the api_id already exists.
 * Used to cache OMDB results — safe to call multiple times with the same film.
 */
export async function upsertFilm({
  api_id,
  title,
  year,
  director,
  runtime,
  description,
  poster_url,
  genre,
  rating,
}) {
  const sql = `
  INSERT INTO films
    (api_id, title, year, director, runtime, description, poster_url, genre, rating)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  ON CONFLICT (api_id)
  DO UPDATE SET
    title = EXCLUDED.title,
    year = EXCLUDED.year,
    director = EXCLUDED.director,
    runtime = EXCLUDED.runtime,
    description = EXCLUDED.description,
    poster_url = EXCLUDED.poster_url,
    genre = EXCLUDED.genre,
    rating = EXCLUDED.rating
  RETURNING *
  `;
  const {
    rows: [film],
  } = await db.query(sql, [
    api_id,
    title,
    year,
    director,
    runtime,
    description,
    poster_url,
    genre,
    rating,
  ]);
  return film;
}

/*
 * Returns all films in the database with no filtering.
 */
export async function getFilms() {
  const sql = `
  SELECT *
  FROM films
  `;
  const { rows: films } = await db.query(sql);
  return films;
}

/**
 * Returns a single film by its internal Postgres id.
 * Returns undefined if no film with the given id exists.
 */
export async function getFilmById(id) {
  const sql = `
  SELECT *
  FROM films
  WHERE id = $1
  `;
  const {
    rows: [film],
  } = await db.query(sql, [id]);
  return film;
}

/**
 * Returns a single film by its IMDb api_id (e.g. "tt1375666").
 * Returns undefined if the film is not cached in the database.
 */
export async function getFilmByApiId(apiId) {
  const sql = `
  SELECT * FROM films
  WHERE api_id = $1
  `;
  const {
    rows: [film],
  } = await db.query(sql, [apiId]);
  return film;
}

/**
 * Searches films by title and genre using a case-insensitive match.
 * If no query is provided, returns all films ordered alphabetically.
 */
export async function searchFilms(query) {
  const search = query ? `%${query}%` : `%`;

  const sql = `
  SELECT * FROM films
  WHERE (title ILIKE $1 OR genre ILIKE $1)
  ORDER BY title ASC
  `;
  const { rows: films } = await db.query(sql, [search]);
  return films;
}
