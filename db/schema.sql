DROP TABLE IF EXISTS user_films;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS films;

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "username" varchar(50) UNIQUE NOT NULL,
  "display_name" varchar(100) NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "password" varchar(255) NOT NULL
);

CREATE TABLE "films" (
  "id" serial PRIMARY KEY,
  "api_id" varchar(20) UNIQUE NOT NULL,
  "title" varchar(255) NOT NULL,
  "year" integer,
  "director" varchar(100),
  "runtime_mins" integer,
  "description" varchar(1000),
  "poster_url" varchar(500),
  "genre" varchar(200)
  -- "rating" numeric(2,1)
);

CREATE TABLE "user_films" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL REFERENCES users(id),
  "film_id" integer NOT NULL REFERENCES films(id),
  "status" varchar NOT NULL CHECK (status IN ('watchlist', 'watched')),
  "rating" integer CHECK (rating >= 1 AND rating <= 5),
  "watched_at" timestamp
);