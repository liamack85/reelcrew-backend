import db from "#db/client";
import { createUserFake } from "#db/queries/users";
import { createFilm } from "#db/queries/films";
import { faker } from "@faker-js/faker";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 10; i++) {
    await createUserFake({
      username: faker.person.firstName(),
      password: faker.internet.password(),
      display_name: faker.person.fullName(),
      email: faker.internet.email(),
    });
  }

  for (let i = 1; i <= 10; i++) {
    await createFilm({
      api_id: faker.string.alphanumeric({ length: 10 }),
      title: faker.music.songName(),
      year: "1990",
      director: faker.person.fullName(),
      runtime: faker.number.int({ min: 88, max: 300 }),
      description: "blah blah blah",
      poster_url: faker.internet.url(),
      genre: faker.music.genre(),
    });
  }
}
