import express from "express";
import { createGroup, getGroupById, getGroups, getUserGroups } from "#db/queries/watch_groups";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import { getMembers } from "#db/queries/group_members";

const router = express.Router();
export default router;

router.get("/", async (req,res) => {
      const groups = await getGroups();
      res.status(200).send(groups);
})

router.route("/")
.post(async (req,res) => {
      const {name, creator_id} = req.body;
      const watchGroup = await createGroup(name, creator_id);
      res.status(201).send(watchGroup);
});

router.get("/mine", getUserFromToken, requireUser, async (req, res) => {
  const groups = await getUserGroups(req.user.id);
  res.send(groups);
});

router.param("id", async (req,res,next,id) => {
      const group = await getGroupById(id);
      if(!group) return res.status(404).send("Group not found.");

      req.group = group;
      next();
})

router.get("/:id", (req,res)=>{
      res.send(req.group);
});

router.get("/:id/members", async (req, res) => {
      try {
            const members = await getMembers(req.group.id);
            if (!members) return res.status(404).send("No members found");
            res.send(members);
      } catch (err) {
            console.error(err.message);
      }
});