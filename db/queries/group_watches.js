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
  group_id, film_id, deadline, discussion_prompt, comment, status
) {
  const sql=`
    INSERT INTO group_watches
    (group_id, film_id, deadline, discussion_prompt, comment, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const {rows: [newlyCreatedGroupWatchList]} = await db.query(sql, [
    group_id, film_id, deadline, discussion_prompt, comment, status
  ])
  return newlyCreatedGroupWatchList;
}

export const getGroupWatchList = async () => {
  const sql = `
    SELECT *
    FROM group_watches
  `;
  const { rows: watchlist } = await db.query(sql);
  return watchlist;
}

/**
 * 
 * @param {number} id 
 * @returns 
 */
export const getGroupWatchListById = async (id) => {
  const sql = `
    SELECT
      group_watches.*,
      watch_groups.creator_id AS group_creator_id
    FROM group_watches
    JOIN watch_groups ON group_watches.group_id = watch_groups.id
    WHERE group_watches.id=$1
  `;
  const { rows: [watchlistItem] } = await db.query(sql, [id]);
  return watchlistItem;
}

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
export const updateGroupWatchList = async (group_id, film_id, deadline, discussion_prompt, comment, status, id) => {
  const sql = `
    UPDATE group_watches 
    SET 
      group_id=$1, film_id=$2, deadline=$3, discussion_prompt=$4, comment=$5, status=$6
    WHERE id=$7
    RETURNING *
    `;

  const { rows: [updatedGroupWatchList] } = await db.query(sql, [
    group_id, film_id, deadline, discussion_prompt, comment, status, id
  ]);

  return updatedGroupWatchList;
}

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
  const { rows: [watch] } = await db.query(sql, [group_id]);
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

export async function updateWatchEvent(id, film_id, deadline, discussion_prompt) {
  const sql = `
  UPDATE group_watches
  SET film_id = $1, deadline = $2, discussion_prompt = $3
  WHERE id = $4
  RETURNING *
  `;

  const { rows : [updated] } = await db.query(sql, [film_id, deadline, discussion_prompt, id]);
  return updated;
}

/**
 * Host deletes a specific watch event by ID.
 *
 * @param {number} id - ID of the group_watches row to delete.
 */

export async function deleteWatchEvent (id) {
  const sql = ` 
  DELETE from group_watches
  WHERE id = $1
  RETURNING *
  `;

  const { rows: [deleted] } = await db.query(sql, [id]);
  return deleted;
}