import db from "#db/client";
import bcrypt from "bcrypt";

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

export async function createUser(
  username,
  password,
  display_name,
  email,
) {
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
  } = await db.query(sql, [
    username,
    hashedPassword,
    display_name,
    email,
  ]);
  return user;
}

export async function getUserByUsernameAndPassword(
  username,
  password,
) {
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
