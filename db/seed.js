import db from "#db/client";
import { createUserFake } from "#db/queries/users";
import { createFilm } from "#db/queries/films";
import { faker } from "@faker-js/faker";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const fakeUsers = [];
  for (let i = 1; i <= 10; i++) {
    const fakeUser = await createUserFake({
      username: faker.person.firstName(),
      password: faker.internet.password(),
      display_name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    fakeUsers.push(fakeUser);
  }

  const fakeFilms = [];
  for (let i = 1; i <= 10; i++) {
    const fakeFilm = await createFilm({
      api_id: faker.string.alphanumeric({ length: 10 }),
      title: faker.music.songName(),
      year: "1990",
      director: faker.person.fullName(),
      runtime: String(faker.number.int({ min: 88, max: 300 })),
      description: "blah blah blah",
      poster_url: faker.internet.url(),
      genre: faker.music.genre(),
    });
    fakeFilms.push(fakeFilm);
  }

  for (const fakeUser of fakeUsers) {
    const shuffleFilms = faker.helpers.shuffle(fakeFilms);
    const selectedFilms = shuffleFilms.slice(0, 3);

    for (const film of selectedFilms) {
      const status = faker.helpers.arrayElement(["watchlist", "watched"]);
      await db.query(
        `
        INSERT INTO user_films (user_id, film_id, status, rating, watched_at)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          fakeUser.id,
          film.id,
          status,
          status === "watched" ? faker.number.int({ min: 1, max: 5 }) : null,
          status === "watched" ? faker.date.past() : null,
        ],
      );
    }
  }
}
