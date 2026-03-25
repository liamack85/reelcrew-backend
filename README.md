# ReelCrew

A group movie coordination app. Create a watch group, assign a film, set a deadline — members track who has watched it and who hasn't.

## Overview

ReelCrew solves the problem of coordinating movie nights with friends across different schedules. This is the REST API server — it handles authentication, film data via OMDB, personal watchlists, watch groups, and group watch coordination.

## Features

- JWT auth with bcrypt password hashing
- Film search and caching via OMDB API (upsert pattern — no duplicate films)
- Personal watchlist and watch history per user
- Watch groups with host-managed film assignments and deadlines
- Member progress tracking with double-write to user watch history
- Film voting for the next group watch
- Global Postgres error handler mapping pg error codes to HTTP responses

## Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Runtime  | Node 22                        |
| Server   | Express 5                      |
| Database | PostgreSQL (`pg` client)       |
| Auth     | JWT (`jsonwebtoken`), `bcrypt` |
| Film API | OMDB API                       |

## Setup

1. Clone the repo
2. Copy `example.env` to `.env` and fill in `DATABASE_URL`, `JWT_SECRET`, `OMDB_API_KEY`, `CLIENT_URL`, and `PORT`
3. Run `npm install`
4. Run `psql -d reelcrew -f db/schema.sql` to create tables
5. (Optional) Run `node db/seed.js` for sample data
6. Run `npm run dev` — server runs on port 3000

## Folder Structure

- `api/` — Express routers for each resource (users, films, groups, watches)
- `db/client.js` — PostgreSQL client instance
- `db/schema.sql` — Table definitions for all 8 tables
- `db/queries/` — SQL query functions organized by resource
- `middleware/` — Auth guards, body validation, and Postgres error handling
- `utils/jwt.js` — Token creation and verification helpers

## Related

- [ReelCrew Client](https://github.com/liamack85/reelcrew-frontend)
