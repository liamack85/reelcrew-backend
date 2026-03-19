import db from "#db/client";

export async function getGroups() {
  const sql = `
  SELECT watch_groups.*, COUNT(group_members.id) AS member_count
  FROM watch_groups
  LEFT JOIN group_members ON watch_groups.id = group_members.group_id
  GROUP BY watch_groups.id
  `;

  const { rows } = await db.query(sql);
  return rows;
}

export async function getGroupById(id) {
  const sql = `
  SELECT *
  FROM watch_groups
  WHERE id = $1
  `;

  const {
    rows: [group],
  } = await db.query(sql, [id]);
  return group;
}

export async function createGroup(name, creatorId) {
const sql = `
INSERT INTO watch_groups 
(name, creator_id)
VALUES ($1, $2)
RETURNING *
`;

const {
  rows: [group],
} = await db.query(sql, [name, creatorId]);
return group;
}

export async function getUserGroups(userId) {
  const sql = `
  SELECT watch_groups.*, group_members.role
  FROM watch_groups
  JOIN group_members ON watch_groups.id = group_members.group_id
  WHERE group_members.user_id = $1
  `;

  const { rows } = await db.query(sql, [userId]);
  return rows;
}