import express from "express";
const app = express();
export default app;

import usersRouter from "#api/users";
import filmsRouter from "#api/films";
import watchGroupsRouter from "#api/watch_groups";
import userFilmsRouter from "#api/user_films";
import getUserFromToken from "#middleware/getUserFromToken";
import handlePostgresErrors from "#middleware/handlePostgresErrors";
import cors from "cors";
import morgan from "morgan";
import groupWatchesRouter from "#api/groups_watches";

app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.get("/", (req, res) => res.send("Hello, World!"));

app.use("/users", usersRouter);
app.use("/films", filmsRouter);
app.use("/groups-watches", watchGroupsRouter);
app.use("/user-films", userFilmsRouter);
app.use("/group-watches", groupWatchesRouter);

app.use(handlePostgresErrors);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
