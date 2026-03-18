import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserById,
  getUserByUsernameAndPassword,
  updateUser,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(
    requireBody(["username", "password", "display_name", "email"]),
    async (req, res) => {
      const { username, password, display_name, email } = req.body;
      const user = await createUser(
        username,
        password,
        display_name,
        email,
      );

      const token = await createToken({ id: user.id });
      res.status(201).send({ token, user });
    },
  );

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(
      username,
      password,
    );
    if (!user)
      return res.status(401).send("Invalid username or password.");

    const token = await createToken({ id: user.id });
    res.send({ token, user });
  });

router.get("/me", requireUser, async (req, res) => {
  res.send(req.user);
});

router.param("id", async (req, res, next, id) => {
  const profile = await getUserById(id);
  req.profile = profile;
  next();
});

router
  .route("/:id")
  .patch(requireBody(["display_name", "email"]), async (req, res) => {
    const { display_name, email } = req.body;
    const user = await updateUser(
      req.profile.id,
      display_name,
      email,
    );
    res.send(user);
  });

describe("POST /users/register", () => {
  it("sends 400 if request body is invalid");
});
