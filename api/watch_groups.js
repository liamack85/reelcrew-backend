import express from "express";
const router = express.Router();
export default router;

import { createGroup } from "#db/queries/watch_groups";

router.route("/")
.post(async (req,res) => {
      const {name, creator_id} = req.body;
      const watchGroup = await createGroup(name, creator_id);
      res.status(201).send(watchGroup);
});

