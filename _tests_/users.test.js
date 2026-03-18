import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import app from "#app";
import db from "#db/client";

beforeAll(async () => {
  await db.connect();
  await db.query("BEGIN");
});

afterAll(async () => {
  await db.query("ROLLBACK");
  await db.end();
});

describe("POST /users/register", () => {
  (it("sends 400 if request body is invalid"),
    async () => {
      await db.query("SAVEPOINT s");
      const response = await request(app)
        .post("/users/register")
        .send({});
      expect(response.status).toBe(400);
      await db.query("ROLLBACK TO s");
    });
});
