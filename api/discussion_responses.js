import express from "express";
const router = express.Router();
export default router;
 
import requireBody from "#middleware/requireBody";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

import {
  createDiscussionResponse,
  getDiscussionResponsesByGroupWatchId,
  getDiscussionResponseById,
  updateDiscussionResponse,
  deleteDiscussionResponse,
} from "#db/queries/discussion_responses";

/** Get all responses for a specific group watch event. */
router.get("/group-watch/:groupWatchId", async (req, res) => {
  const responses = await getDiscussionResponsesByGroupWatchId(req.params.groupWatchId);
  res.send(responses);
});

/** Create a new discussion response. Expects group_watch_id and content in body. */
router.post("/", getUserFromToken, requireUser, requireBody(["group_watch_id", "content"]), async (req, res) => {
  const { group_watch_id, content } = req.body;
  const response = await createDiscussionResponse(group_watch_id, req.user.id, content);
  res.status(201).send(response);
});

/** Load response by :id or return 404. */
router.param("id", async (req, res, next, id) => {
  const response = await getDiscussionResponseById(id);
  if (!response) return res.status(404).send("Response not found.");
 
  req.response = response;
  next();
});

/** Response author can update their response content. */
router.patch("/:id", getUserFromToken, requireUser, requireBody(["content"]), async (req, res) => {
  if (req.user.id !== req.response.user_id) return res.status(403).send("Unauthorized");
 
  const { content } = req.body;
  const updated = await updateDiscussionResponse(req.response.id, content);
  res.send(updated);
});
 
/**
 * Delete a response.
 */
router.delete("/:id", getUserFromToken, requireUser, async (req, res) => {
  const isAuthor = req.user.id === req.response.user_id;
  const isHost = req.user.id === req.response.group_creator_id;
 
  if (!isAuthor && !isHost) return res.status(403).send("Unauthorized");
 
  const deleted = await deleteDiscussionResponse(req.response.id);
  console.debug("DELETED: ", deleted);
  res.sendStatus(204);
});