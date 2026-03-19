import db from "#db/client";

export async function addMember (groupId, userId, role) {
  const sql = `
  INSERT INTO group_members
  (group_id, user_id, role)
  VALUES
  ($1, $2, $3)
  RETURNING *
  `;

  const {
    rows: [member],
  } = await db.query(sql, [groupId, userId, role]);
  return member;
}

export async function removeMember (groupId, userId) {
  const sql = `
  DELETE FROM group_members
  WHERE group_id = $1 AND user_id = $2
  RETURNING *
  `;

  const {
    rows: [member],
  } = await db.query (sql, [groupId, userId]);
  return member;
}

export async function getMembers(groupId) {
  const sql = `
  SELECT group_members.*, users.username, users.display_name
  FROM group_members
  JOIN users ON users.id = group_members.user_id
  WHERE group_members.group_id = $1
  `;

  const { rows } = await db.query(sql, [groupId]);
  return rows;
}

export async function getMemberRole(groupId, userId) {
  const sql = `
  SELECT role
  FROM group_members
  WHERE group_id = $1 AND user_id = $2
  `;
  const {
    rows: [member],
  } = await db.query(sql, [groupId, userId]);
  return member ? member.role : null;
}