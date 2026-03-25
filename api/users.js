import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserByUsernameAndPassword,
  getUserById,
  updateUser,
} from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { getUserFilms } from "#db/queries/user_films";
import { getUserGroups } from "#db/queries/watch_groups";
import { createToken } from "#utils/jwt";

/**
 * Register a new user and return an auth token.
 *
 * @param {string} req.body.username
 * @param {string} req.body.password
 * @param {string} req.body.display_name
 * @param {string} req.body.email
 */
router
  .route("/register")
  .post(
    requireBody(["username", "password", "display_name", "email"]),
    async (req, res) => {
      const { username, password, display_name, email } = req.body;
      const user = await createUser(username, password, display_name, email);

      const token = await createToken({ id: user.id });
      res.status(201).send({ token, user });
    },
  );

/**
 * Authenticate a user and return an auth token.
 *
 * @route POST /login
 * @param {string} req.body.username
 * @param {string} req.body.password
 */
router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");

    const token = await createToken({ id: user.id });
    res.send({ token, user });
  });

/**
 * Get the authenticated user's profile.
 *
 * @returns {Object} Authenticated user (req.user)
 */
router.route("/me").get(requireUser, async (req, res) => {
  res.send(req.user);
});

// Runs before every /:id route — loads the target profile into req.profile
/**
 * Param middleware to load a user profile by ID and attach it to req.profile.
 *
 * @param {number} id - user id from the route
 * @returns {404} if profile not found
 */
router.param("id", async (req, res, next, id) => {
  const profile = await getUserById(id);
  if (!profile) return res.status(404).send("profile not found");

  req.profile = profile;
  next();
});

/**
 * Update a user's display name and email.
 *
 * @auth requireUser
 * @param {string} req.body.display_name
 * @param {string} req.body.email
 */
router
  .route("/:id")
  .patch(
    requireUser,
    requireBody(["display_name", "email"]),
    async (req, res) => {
      const { display_name, email } = req.body;
      const user = await updateUser(req.profile.id, display_name, email);
      res.send(user);
    },
  );

// will refactor this route, don't know if necessary for the frontend anymore
/**
 * Get a user's watchlist (films with status === "watchlist").
 */
router.route("/:id/watchlist").get(async (req, res) => {
  const watchlistFilms = await getUserFilms(req.profile.id);
  res.send(watchlistFilms.filter((wf) => wf.status === "watchlist"));
});

// will refactor this route, don't know if necessary for the frontend anymore
/**
 * Get a user's watched films (status === "watched").
 */
router.route("/:id/watched").get(async (req, res) => {
  const watchedFilms = await getUserFilms(req.profile.id);
  res.send(watchedFilms.filter((wf) => wf.status === "watched"));
});

/**
 * Get groups the user belongs to.
 */
router.route("/:id/groups").get(async (req, res) => {
  const groups = await getUserGroups(req.profile.id);
  res.send(groups);
});
