import db from "#db/client";

/**
 * Retrieve all watch groups with member counts.
 */
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

/**
 * Retrieve a single watch group by ID.
 *
 * @param {number} id - The ID of the watch group.
 */
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

/**
 * Create a new watch group.
 *
 * @async
 * @param {string} name - The name of the group.
 * @param {number} creatorId - The ID of the user creating the group.
 */
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

/**
 * Retrieve watch groups a user belongs to, including the user's role in each group.
 *
 * @param {number} userId - The ID of the user.
 */
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