import db from "#db/client";
import bcrypt from "bcrypt";

// DEV ONLY — skips bcrypt, do not use in production routes
export async function createUserFake({
  username,
  password,
  display_name,
  email,
}) {
  const sql = `
  INSERT INTO users
    (username, password, display_name, email)
  VALUES
    ($1, $2, $3, $4)
  RETURNING *
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username, password, display_name, email]);
  return user;
}

/**
 * Creates a new user with a bcrypt-hashed password.
 * @param {string} username - Unique username
 * @param {string} password - Plain-text password (hashed before storage)
 * @param {string} display_name - Display name shown in the UI
 * @param {string} email - User's email address
 * @returns {Promise<Object>} The newly created user row
 */
export async function createUser(username, password, display_name, email) {
  const sql = `
  INSERT INTO users
    (username, password, display_name, email)
  VALUES
    ($1, $2, $3, $4)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword, display_name, email]);
  return user;
}

/**
 * Looks up a user by username and verifies their password.
 * Returns null if the user doesn't exist or the password is wrong.
 * Strips the password field from the returned object.
 * @param {string} username
 * @param {string} password - Plain-text password to compare against the hash
 * @returns {Promise<Object|null>}
 */
export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  delete user.password;
  return user;
}

/**
 * Fetches a user by ID. Selects only safe columns — password is excluded.
 * @param {number} id
 * @returns {Promise<Object|undefined>}
 */
export async function getUserById(id) {
  const sql = `
  SELECT id, username, display_name, email
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

/**
 * Updates a user's display name and email.
 * @param {number} id
 * @param {string} display_name
 * @param {string} email
 * @returns {Promise<Object>} The updated user row
 */
export async function updateUser(id, display_name, email) {
  const sql = `
  UPDATE users
  SET display_name = $2, email = $3
  WHERE id = $1
  RETURNING *
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id, display_name, email]);
  return user;
}
