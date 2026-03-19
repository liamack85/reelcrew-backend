import db from "#db/client";

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

export const getGroupWatchListById = async (id) => {
  const sql = `
    SELECT *
    FROM group_watches
    WHERE id=$1
  `;
  const { rows: [watchlistItem] } = await db.query(sql, [id]);
  return watchlistItem;
}

export const updateGroupWatchList = async (group_id, film_id, deadline, discussion_prompt, comment, status, id) => {
  const sql = `
    UPDATE group_watches 
    SET 
      group_id=$1, film_id=$2, deadline=$3, discussion_prompt=$4, comment=$5, status=$6
    WHERE id=$7
    RETURNING *
    `;

  // query the database
  const { rows: [updatedGroupWatchList] } = await db.query(sql, [
    group_id, film_id, deadline, discussion_prompt, comment, status, id
  ]);

  // return updatedGroupWatchList
  return updatedGroupWatchList;
}
