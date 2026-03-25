import express from "express";
import { createGroup, getGroupById, getGroups, getUserGroups } from "#db/queries/watch_groups";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import { addMember, getMembers } from "#db/queries/group_members";

const router = express.Router();
export default router;

router.get("/", async (req,res) => {
      const groups = await getGroups();
      res.status(200).send(groups);
})

/**
 * Create a new watch group and add the creator as a host member.
 *
 * @param {string} req.body.name - Name of the group.
 * @param {number} req.body.creator_id - ID of the creating user.
 * @returns {201} The created watch group object.
 */
router.route("/")
.post(async (req,res) => {
      const {name, creator_id} = req.body;
      const watchGroup = await createGroup(name, creator_id);
      console.log(watchGroup);
      await addMember(watchGroup.id, creator_id, "host")
      res.status(201).send(watchGroup);
});

router.get("/mine", getUserFromToken, requireUser, async (req, res) => {
  const groups = await getUserGroups(req.user.id);
  res.send(groups);
});

/**
 * Route param middleware to load a group by ID.
 *
 * Attaches the group to req.group or returns 404 if not found.
 *
 * @param {number} id - Group ID from URL param.
 */
router.param("id", async (req,res,next,id) => {
      const group = await getGroupById(id);
      if(!group) return res.status(404).send("Group not found.");

      req.group = group;
      next();
})

router.get("/:id", (req,res)=>{
      res.send(req.group);
});

/**
 * Get members of a specific group.
 *
 * @route GET /:id/members
 * @returns {Array<Object>} Array of member records for the group.
 * @throws {404} If no members are found.
 */
router.get("/:id/members", async (req, res) => {
      try {
            const members = await getMembers(req.group.id);
            if (!members) return res.status(404).send("No members found");
            res.send(members);
      } catch (err) {
            console.error(err.message);
      }
});