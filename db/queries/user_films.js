import db from "#db/client";

export async function getUserFilms(userId) {
  const sql = `
  SELECT
    user_films.*,
    films.api_id,
    films.title,
    films.year,
    films.director,
    films.runtime,
    films.description,
    films.poster_url,
    films.genre,
    films.rating
  FROM user_films
  JOIN films ON films.id = user_films.film_id
  WHERE user_films.user_id = $1
  ORDER BY user_films.id DESC
  `;
  const { rows: userFilms } = await db.query(sql, [userId]);
  return userFilms;
}

export async function getUserFilmById(id) {
  const sql = `
  SELECT * FROM user_films
  WHERE id = $1
  `;
  const {
    rows: [userFilm],
  } = await db.query(sql, [id]);
  return userFilm;
}

export async function addUserFilm(userId, filmId) {
  const sql = `
  INSERT INTO user_films
    (user_id, film_id, status)
  VALUES
    ($1, $2, 'watchlist')
  RETURNING *
  `;
  const {
    rows: [userFilm],
  } = await db.query(sql, [userId, filmId]);
  return userFilm;
}

export async function updateUserFilm(id, { status, rating }) {
  const sql = `
  UPDATE user_films SET
  status = COALESCE($2, status),
  rating = COALESCE($3, rating),
  watched_at = CASE WHEN $2 = 'watched' 
  THEN NOW() ELSE watched_at END
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [userFilm],
  } = await db.query(sql, [id, status ?? null, rating ?? null]);
  return userFilm;
}

export async function deleteUserFilm(id) {
  const sql = `
  DELETE FROM user_films
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [userFilm],
  } = await db.query(sql, [id]);
  return userFilm;
}
