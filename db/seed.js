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

  // --- Group 1: Friday Night Movie Club ---
  const group1Result = await db.query(
    `
    INSERT INTO watch_groups (name, creator_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    ["Friday Night Movie Club", fakeUsers[0].id],
  );
  const group1 = group1Result.rows[0];

  await db.query(
    `
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, 'host'),
    ($1, $3, 'member'),
    ($1, $4, 'member'),
    ($1, $5, 'member')
    `,
    [group1.id, fakeUsers[0].id, fakeUsers[1].id, fakeUsers[2].id, fakeUsers[3].id],
  );

  await db.query(
    `
    INSERT INTO group_watches (group_id, film_id, deadline, discussion_prompt, status)
    VALUES 
      ($1, $2, '2026-04-15', 'What did you think of the ending?', 'watching'),
      ($1, $3, '2026-03-20', 'Best scene and why?', 'complete'),
      ($1, $4, '2026-05-01', 'Would you recommend this to a friend?', 'watching')
    `,
    [group1.id, fakeFilms[0].id, fakeFilms[1].id, fakeFilms[2].id],
  );

  // --- Group 2: Sunday Sci-Fi Society ---
  const group2Result = await db.query(
    `
    INSERT INTO watch_groups (name, creator_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    ["Sunday Sci-Fi Society", fakeUsers[4].id],
  );
  const group2 = group2Result.rows[0];

  await db.query(
    `
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, 'host'),
    ($1, $3, 'member'),
    ($1, $4, 'member')
    `,
    [group2.id, fakeUsers[4].id, fakeUsers[5].id, fakeUsers[0].id],
  );

  await db.query(
    `
    INSERT INTO group_watches (group_id, film_id, deadline, discussion_prompt, status)
    VALUES 
      ($1, $2, '2026-04-10', 'How does this compare to the book?', 'watching'),
      ($1, $3, '2026-03-15', 'Favorite character and why?', 'complete')
    `,
    [group2.id, fakeFilms[3].id, fakeFilms[4].id],
  );

  // --- Group 3: Classic Cinema Club ---
  const group3Result = await db.query(
    `
    INSERT INTO watch_groups (name, creator_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    ["Classic Cinema Club", fakeUsers[2].id],
  );
  const group3 = group3Result.rows[0];

  await db.query(
    `
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, 'host'),
    ($1, $3, 'member'),
    ($1, $4, 'member'),
    ($1, $5, 'member'),
    ($1, $6, 'member')
    `,
    [group3.id, fakeUsers[2].id, fakeUsers[6].id, fakeUsers[7].id, fakeUsers[8].id, fakeUsers[9].id],
  );

  await db.query(
    `
    INSERT INTO group_watches (group_id, film_id, deadline, discussion_prompt, status)
    VALUES 
      ($1, $2, '2026-04-20', 'How does this hold up today?', 'watching'),
      ($1, $3, '2026-03-10', 'What surprised you most?', 'complete'),
      ($1, $4, '2026-03-01', 'Rate it 1-5 and explain why', 'complete'),
      ($1, $5, '2026-05-15', null, 'watching')
    `,
    [group3.id, fakeFilms[5].id, fakeFilms[6].id, fakeFilms[7].id, fakeFilms[8].id],
  );

  // --- Group 4: Lunchbreak Watchers (no watches yet) ---
  const group4Result = await db.query(
    `
    INSERT INTO watch_groups (name, creator_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    ["Lunchbreak Watchers", fakeUsers[1].id],
  );
  const group4 = group4Result.rows[0];

  await db.query(
    `
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, 'host'),
    ($1, $3, 'member')
    `,
    [group4.id, fakeUsers[1].id, fakeUsers[9].id],
  );
}