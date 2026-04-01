import db from "#db/client";

/**
 *
 * @param {number} group_id - ID of the group to associate with this watch entry.
 * @param {string} film_id - ID of the film to associate with this watch entry.
 * @param {Date} deadline - Deadline for the watch (Date object or ISO string). Use null to clear.
 * @param {string} discussion_prompt - Optional discussion prompt text.
 * @param {string} comment - Optional comment.
 * @param {string} status - Status of the watch (e.g., 'watchlist' or 'watched').
 */
export async function createGroupWatchList(
  group_id,
  film_id,
  deadline,
  discussion_prompt,
  comment,
  status,
) {
  const sql = `
    INSERT INTO group_watches
    (group_id, film_id, deadline, discussion_prompt, comment, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const {
    rows: [newlyCreatedGroupWatchList],
  } = await db.query(sql, [
    group_id,
    film_id,
    deadline,
    discussion_prompt,
    comment,
    status,
  ]);
  return newlyCreatedGroupWatchList;
}

export const getGroupWatchList = async () => {
  const sql = `
    SELECT *
    FROM group_watches
  `;
  const { rows: watchlist } = await db.query(sql);
  return watchlist;
};

/**
 *
 * @param {number} id
 * @returns
 */
export const getGroupWatchListById = async (id) => {
  const sql = `
    SELECT
      group_watches.*,
      films.title, films.poster_url, films.year, films.director, films.runtime, films.genre, films.description,
      watch_groups.creator_id AS group_creator_id, watch_groups.name AS group_name,
      (SELECT COUNT(*) FROM group_members WHERE group_members.group_id = group_watches.group_id) AS member_count
  FROM group_watches
  JOIN films ON group_watches.film_id = films.id
  JOIN watch_groups ON group_watches.group_id = watch_groups.id
  WHERE group_watches.id=$1
  `;
  const {
    rows: [watchlistItem],
  } = await db.query(sql, [id]);
  return watchlistItem;
};

/**
 *
 * @param {number} group_id - ID of the group to associate with this watch entry.
 * @param {number} film_id - ID of the film to associate with this watch entry.
 * @param {Date} deadline - Deadline for the watch (Date object or ISO string). Use null to clear.
 * @param {string} discussion_prompt - Optional discussion prompt text.
 * @param {string} comment - Optional comment about the watch.
 * @param {string} status - Status of the watch (e.g., 'watchlist' or 'watched').
 * @param {number} id - ID of the group watch entry to update.
 */
export const updateGroupWatchList = async (
  group_id,
  film_id,
  deadline,
  discussion_prompt,
  comment,
  status,
  id,
) => {
  const sql = `
    UPDATE group_watches 
    SET 
      group_id=$1, film_id=$2, deadline=$3, discussion_prompt=$4, comment=$5, status=$6
    WHERE id=$7
    RETURNING *
    `;

  const {
    rows: [updatedGroupWatchList],
  } = await db.query(sql, [
    group_id,
    film_id,
    deadline,
    discussion_prompt,
    comment,
    status,
    id,
  ]);

  return updatedGroupWatchList;
};

export async function getWatchesByGroupId(group_id) {
  const sql = `
  SELECT group_watches.*, films.title, films.poster_url, films.year, films.director
  FROM group_watches
  JOIN films ON group_watches.film_id = films.id
  WHERE group_watches.group_id = $1
  ORDER BY group_watches.deadline DESC
  `;

  const { rows } = await db.query(sql, [group_id]);
  return rows;
}

/**
 * Retrieves the current active watch event for a group, including film details,
 * group info, and member progress.
 *
 * @param {number} group_id - ID of the watch group.
 * @returns {Promise<Object|null>} Watch object with nested progress, or null if no active watch.
 *   - progress.members: array of { user_id, display_name, role, status, watched_at }
 *   - progress.percent: percentage of members who have marked as watched
 */
export async function getCurrentWatchByGroupId(group_id) {
  const sql = `
    SELECT 
    group_watches.*, 
    films.title, films.poster_url, films.year, films.director, films.runtime, films.genre, films.description,
    watch_groups.creator_id AS group_creator_id, watch_groups.name AS group_name
    FROM group_watches
    JOIN films ON group_watches.film_id = films.id
    JOIN watch_groups ON group_watches.group_id = watch_groups.id
    WHERE group_watches.group_id = $1 AND group_watches.status = 'watching'
    ORDER BY group_watches.deadline ASC
    LIMIT 1
  `;
  // Fetch the active watch with film and group details
  const {
    rows: [watch],
  } = await db.query(sql, [group_id]);
  if (!watch) return null;

  const progressSql = `
   SELECT 
    users.id AS user_id,
    users.display_name,
    group_members.role,
    group_watch_progress.status,
    group_watch_progress.watched_at
  FROM group_members
  JOIN users ON group_members.user_id = users.id
  LEFT JOIN group_watch_progress 
    ON group_watch_progress.user_id = users.id 
    AND group_watch_progress.group_watch_id = $1
  WHERE group_members.group_id = $2
  `;
  // Fetch per-member progress for this watch — joins users and group_members for display info
  const { rows: members } = await db.query(progressSql, [watch.id, group_id]);

  // Calculate watched percentage — guard against empty member list
  const watchedCount = members.filter((m) => m.status === "watched").length;
  const percent =
    members.length > 0 ? Math.round((watchedCount / members.length) * 100) : 0;

  watch.progress = { members, percent };
  return watch;
}

/**
 * Host updates a watch event's film, deadline, and discussion prompt.
 *
 * @param {number} id - ID of the group_watches row to update.
 * @param {string} film_id - New film ID.
 * @param {Date} deadline - New deadline.
 * @param {string} discussion_prompt - New discussion prompt (may be empty).
 */

export async function updateWatchEvent(
  id,
  film_id,
  deadline,
  discussion_prompt,
  status,
) {
  const sql = `
  UPDATE group_watches
  SET film_id = $1, deadline = $2, discussion_prompt = $3, status = $4
  WHERE id = $5
  RETURNING *
  `;

  const {
    rows: [updated],
  } = await db.query(sql, [film_id, deadline, discussion_prompt, status, id]);
  return updated;
}

/**
 * Host deletes a specific watch event by ID.
 *
 * @param {number} id - ID of the group_watches row to delete.
 */

export async function deleteWatchEvent(id) {
  const sql = ` 
  DELETE from group_watches
  WHERE id = $1
  RETURNING *
  `;

  const {
    rows: [deleted],
  } = await db.query(sql, [id]);
  return deleted;
}

export async function markMemberWatched(watchId, userId, status) {
  const sql = `
  INSERT INTO group_watch_progress (group_watch_id, user_id, status, watched_at)
  VALUES ($1, $2, $3::text, CASE WHEN $3::text = 'watched' THEN NOW() ELSE NULL END)
  ON CONFLICT (group_watch_id, user_id)
  DO UPDATE SET status = $3::text, watched_at = CASE WHEN $3::text = 'watched' THEN NOW() ELSE NULL END
  RETURNING *
`;
  const {
    rows: [updated],
  } = await db.query(sql, [watchId, userId, status]);
  return updated;
}
