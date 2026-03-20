import db from "#db/client";

/**
 *
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

export async function getFilms() {
  const sql = `
  SELECT *
  FROM films
  `;
  const { rows: films } = await db.query(sql);
  return films;
}

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

export async function searchFilms(query, genre) {
  const search = query ? `%${query}%` : `%`;
  const params = [search];
  let genreClause = "";

  if (genre) {
    params.push(`%${genre}%`);
    genreClause = "AND genre ILIKE $2";
  }

  const sql = `
  SELECT * FROM films
  WHERE title ILIKE $1 ${genreClause}
  ORDER BY title ASC
  `;
  const { rows: films } = await db.query(sql, params);
  return films;
}
