import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import { createGroupWatchList, getGroupWatchList, getGroupWatchListById, getWatchesByGroupId } from "#db/queries/group_watches";


router
  .route("/")
  .post(
    requireBody(["group_id", "film_id", "deadline", "status"]), 
    async (req,res) => {
      const {group_id, film_id, deadline, discussion_prompt, comment, status} = req.body;
      const groupWatchList = await createGroupWatchList(group_id, film_id, deadline, discussion_prompt, comment, status);
      res.status(201).send(groupWatchList);
});


router.route("/").get(async (req,res) => {
  const groupWatches = await getGroupWatchList();
  res.send(groupWatches);
})

router.get("/group/:groupId", async (req, res) => {
  const watches = await getWatchesByGroupId(req.params.groupId);
  res.send(watches);
});

router.param("id", async (req, res, next, id) => {
  const watchlist = await getGroupWatchListById(id);
  if (!watchlist) return res.status(404).send("Watchlist not found.");

  req.watchlist = watchlist;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.watchlist);
});