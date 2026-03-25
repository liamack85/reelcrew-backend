/**
 * @file Group watchlist routes
 *
 * Express routes that exposes endpoints to create and fetch group watchlist entries.
 *
 */


import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import { createGroupWatchList, getGroupWatchList, getGroupWatchListById } from "#db/queries/group_watches";

/**
 * @typedef {Object} Watchlist
 * @property {number|string} id - Unique identifier for the watchlist entry.
 * @property {number|string} group_id - ID of the group.
 * @property {number|string} film_id - ID of the film.
 * @property {string} deadline - Deadline for the watch/discussion (ISO date string recommended).
 * @property {string} [discussion_prompt] - Optional discussion prompt for the watch.
 * @property {string} [comment] - Optional comment.
 * @property {string} status - Status of the watchlist entry (e.g., "open", "closed").
 * @property {string} created_at - Timestamp when the entry was created.
 */

/** Create a watchlist entry. Expects group_id, film_id, deadline, status in body. */
router
  .route("/")
  .post(
    requireBody(["group_id", "film_id", "deadline", "status"]), 
    async (req,res) => {
      const {group_id, film_id, deadline, discussion_prompt, comment, status} = req.body;
      const groupWatchList = await createGroupWatchList(group_id, film_id, deadline, discussion_prompt, comment, status);
      res.status(201).send(groupWatchList);
});

/** Get all watchlist entries. */
router.route("/").get(async (req,res) => {
  const groupWatches = await getGroupWatchList();
  res.send(groupWatches);
})

/** Load watchlist by :id or return 404. */
router.param("id", async (req, res, next, id) => {
  const watchlist = await getGroupWatchListById(id);
  if (!watchlist) return res.status(404).send("Watchlist not found.");

  req.watchlist = watchlist;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.watchlist);
});
