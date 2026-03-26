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

export async function deleteGroup(id, creator_id) {
  const sql = `
  DELETE FROM watch_groups
  WHERE id = $1 AND creator_id = $2
  RETURNING *
  `;

  const {
    rows: [group],
  } = await db.query(sql, [id, creator_id]);
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
 * Retrieves all watch groups a user belongs to, enriched with:
 * - member_count: total members in the group
 * - deadline: deadline of the active watch (null if no active watch)
 * - watched_count: number of members who have marked the active watch as watched
 * - film_title: title of the active watch film (null if no active watch)
 * - Necessary for the function of the Profile Group progress cards
 * @param {number} userId - The ID of the user.
 */
export async function getUserGroups(userId) {
  const sql = `
  SELECT
    wg.id,
    wg.name,
    wg.creator_id,
    gm.role,
    COUNT(DISTINCT all_members.id) AS member_count,
    gw.deadline,
    COUNT(DISTINCT gwp.user_id) FILTER (WHERE gwp.status = 'watched') AS watched_count,
    f.title AS film_title
  FROM watch_groups wg
  JOIN group_members gm ON wg.id = gm.group_id AND gm.user_id = $1
  LEFT JOIN group_members all_members ON wg.id = all_members.group_id
  LEFT JOIN group_watches gw ON wg.id = gw.group_id AND gw.status = 'watching'
  LEFT JOIN group_watch_progress gwp ON gw.id = gwp.group_watch_id
  LEFT JOIN films f ON gw.film_id = f.id
  GROUP BY wg.id, wg.name, wg.creator_id, gm.role, gw.deadline, f.title
  `;

  const { rows } = await db.query(sql, [userId]);
  return rows;
}
