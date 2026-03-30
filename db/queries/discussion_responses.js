import db from "#db/client";

/**
 * Creates a new discussion response for a group watch event.
 * 
 * @param {number} group_watch_id - ID of the group watch event.
 * @param {number} user_id - ID of the user submitting the response.
 * @param {string} content - The text content of the response.
 */
export async function createDiscussionResponse(group_watch_id, user_id, content) {
  const sql = `
  INSERT INTO discussion_responses
    (group_watch_id, user_id, content)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const { rows: [response] } = await db.query(sql, [group_watch_id, user_id, content]);
  return response;
}

/**
 * Gets all responses for a specific group watch event, including
 * the author's display name. Ordered chronologically.
 * @param {number} group_watch_id - ID of the group watch event.
 */
export async function getDiscussionResponsesByGroupWatchId(group_watch_id) {
  const sql = `
  SELECT
    discussion_responses.*,
    users.display_name
  FROM discussion_responses
  JOIN users ON discussion_responses.user_id = users.id
  WHERE discussion_responses.group_watch_id = $1
  ORDER BY discussion_responses.created_at ASC
  `;
  const { rows } = await db.query(sql, [group_watch_id]);
  return rows;
}

/**
 * Updates the content of a discussion response and marks it as edited.
 * @param {number} id - ID of the response to update.
 * @param {string} content - The new content.
 */
export async function updateDiscussionResponse(id, content) {
  const sql = `
  UPDATE discussion_responses
  SET content = $1, updated_at = NOW()
  WHERE id = $2
  RETURNING *
  `;
  const { rows: [response] } = await db.query(sql, [content, id]);
  return response;
}

/**
 * Deletes a discussion response by ID.
 * @param {number} id - ID of the response to delete.
 */
export async function deleteDiscussionResponse(id) {
  const sql = `
  DELETE FROM discussion_responses
  WHERE id = $1
  RETURNING *
  `;
  const { rows: [response] } = await db.query(sql, [id]);
  return response;
}

/**
 * Fetches a single discussion response by ID.
 *
 * @param {number} id - ID of the discussion response.
 * @returns {Promise<Object|undefined>} The response row with group_creator_id, or undefined if not found.
 */

export async function getDiscussionResponseById(id) {
  const sql = `
  SELECT
    discussion_responses.*,
    watch_groups.creator_id AS group_creator_id
  FROM discussion_responses
  JOIN group_watches ON discussion_responses.group_watch_id = group_watches.id
  JOIN watch_groups ON group_watches.group_id = watch_groups.id
  WHERE discussion_responses.id = $1
  `;
  const { rows: [response] } = await db.query(sql, [id]);
  return response;
}