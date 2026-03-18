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
}) {
  const sql = `
  INSERT INTO films
    (api_id, title, year, director, runtime, description, poster_url, genre)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
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
  ]);
  return film;
}
