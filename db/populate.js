import db from "#db/client";
import { upsertFilm } from "./queries/films.js";

const OMDB_KEY = process.env.OMDB_KEY;

const FILM_IDS = [
  "tt0111161", // The Shawshank Redemption
  "tt0068646", // The Godfather
  "tt0071562", // The Godfather Part II
  "tt0468569", // The Dark Knight
  "tt0050083", // 12 Angry Men
  "tt0108052", // Schindler's List
  "tt0167260", // The Lord of the Rings: The Return of the King
  "tt0110912", // Pulp Fiction
  "tt0060196", // The Good, the Bad and the Ugly
  "tt0120737", // The Lord of the Rings: The Fellowship of the Ring
  "tt0109830", // Forrest Gump
  "tt0137523", // Fight Club
  "tt1375666", // Inception
  "tt0080684", // Star Wars: The Empire Strikes Back
  "tt0167261", // The Lord of the Rings: The Two Towers
  "tt0073486", // One Flew Over the Cuckoo's Nest
  "tt0099685", // Goodfellas
  "tt0133093", // The Matrix
  "tt0047478", // Seven Samurai
  "tt0317248", // City of God
  "tt0076759", // Star Wars: A New Hope
  "tt0102926", // The Silence of the Lambs
  "tt0038650", // It's a Wonderful Life
  "tt0118799", // Life is Beautiful
  "tt0245429", // Spirited Away
  "tt0120815", // Saving Private Ryan
  "tt0816692", // Interstellar
  "tt0054215", // Psycho
  "tt0120689", // The Green Mile
  "tt0103064", // Terminator 2
  "tt0110413", // Leon: The Professional
  "tt0088763", // Back to the Future
  "tt0082971", // Raiders of the Lost Ark
  "tt0114369", // Se7en
  "tt0056058", // Harakiri
  "tt0034583", // Casablanca
  "tt0027977", // Modern Times
  "tt0253474", // The Pianist
  "tt0407887", // The Departed
  "tt0172495", // Gladiator
  "tt0482571", // The Prestige
  "tt0209144", // Memento
  "tt0078748", // Alien
  "tt0114814", // The Usual Suspects
  "tt0078788", // Apocalypse Now
  "tt0057012", // Dr. Strangelove
  "tt0050825", // Paths of Glory
  "tt0361748", // Inglourious Basterds
  "tt0087843", // Once Upon a Time in America
  "tt1675434", // The Intouchables
  "tt0364569", // Oldboy
  "tt0052357", // Vertigo
  "tt0051201", // Witness for the Prosecution
  "tt0405094", // The Lives of Others
  "tt0053125", // North by Northwest
  "tt0042192", // All About Eve
  "tt0081505", // The Shining
  "tt0071853", // Monty Python and the Holy Grail
  "tt0040522", // Bicycle Thieves
  "tt0986264", // Taare Zameen Par
  "tt0091251", // Come and See
  "tt0364569", // Oldboy
  "tt0112573", // Braveheart
  "tt0022100", // M
  "tt0119698", // Princess Mononoke
  "tt0097576", // Indiana Jones and the Last Crusade
  "tt0055630", // Yojimbo
  "tt0435761", // Toy Story 3
  "tt0032553", // The Great Dictator
  "tt0055031", // High Noon
  "tt0056172", // Lawrence of Arabia
  "tt0062622", // 2001: A Space Odyssey
  "tt0090605", // Aliens
  "tt0105236", // Reservoir Dogs
  "tt0119217", // Good Will Hunting
  "tt0892769", // How to Train Your Dragon
  "tt0053604", // The Apartment
  "tt0033467", // Citizen Kane
  "tt0093058", // Full Metal Jacket
  "tt0047396", // Rear Window
  "tt0025316", // It Happened One Night
  "tt0021749", // City Lights
  "tt0086190", // Star Wars: Return of the Jedi
  "tt0338013", // Eternal Sunshine of the Spotless Mind
  "tt1853728", // Django Unchained
  "tt0353969", // Memories of Murder
  "tt0114709", // Toy Story
  "tt0180093", // Requiem for a Dream
  "tt0266697", // Kill Bill: Volume 1
  "tt0208092", // Snatch
  "tt0457430", // Pan's Labyrinth
  "tt0266543", // Finding Nemo
  "tt1345836", // The Dark Knight Rises
  "tt0910970", // WALL-E
  "tt0120586", // American History X
  "tt0112641", // Casino
  "tt0095765", // Cinema Paradiso
  "tt0064116", // Once Upon a Time in the West
  "tt0075314", // Taxi Driver
  "tt0071315", // Chinatown
  "tt0986264", // Taare Zameen Par
  "tt0119488", // L.A. Confidential
  "tt0113277", // Heat
  "tt0057565", // The Great Escape
  "tt0116231", // The English Patient
  "tt0095327", // Grave of the Fireflies
  "tt0198781", // Monsters, Inc.
  "tt0077416", // The Deer Hunter
  "tt0056592", // To Kill a Mockingbird
  "tt1130884", // Shutter Island
  "tt0167404", // The Sixth Sense
  "tt0118849", // Children of Heaven
  "tt0047528", // The 400 Blows
  "tt0044741", // Ikiru
  "tt0059742", // The Sound of Music
  "tt0050986", // Wild Strawberries
  "tt0050212", // The Bridge on the Drina
  "tt0169547", // American Beauty
  "tt0372784", // Batman Begins
  "tt0268978", // A Beautiful Mind
  "tt0405159", // Million Dollar Baby
  "tt0111495", // Four Weddings and a Funeral
  "tt0457304", // No Country for Old Men
  "tt0116282", // Fargo
  "tt0382932", // Ratatouille
  "tt0317219", // Cars
  "tt0119116", // The Fifth Element
  "tt0477348", // No Country for Old Men
  "tt0093779", // The Princess Bride
  "tt0107290", // Jurassic Park
  "tt0325980", // Pirates of the Caribbean
  "tt0092005", // Stand by Me
  "tt0105695", // Unforgiven
  "tt0112471", // Before Sunrise
  "tt0363163", // Downfall
  "tt0015864", // The Gold Rush
  "tt0017136", // Metropolis
  "tt0986264", // Taare Zameen Par
  "tt0053291", // Some Like It Hot
  "tt0041959", // The Third Man
  "tt0012349", // The Kid
  "tt0070735", // The Sting
  "tt0066921", // A Clockwork Orange
  "tt0084787", // The Thing
  "tt0058946", // Doctor Zhivago
  "tt0052618", // Ben-Hur
  "tt0036775", // Double Indemnity
  "tt0040897", // The Treasure of the Sierra Madre
  "tt0038355", // The Big Sleep
  "tt0051272", // The Bridge on the River Kwai
  "tt0044079", // Rashomon
  "tt0043014", // Sunset Boulevard
  "tt0042876", // Strangers on a Train
  "tt0041546", // Kind Hearts and Coronets
  "tt0035279", // The Maltese Falcon
  "tt0031381", // Gone with the Wind
  "tt0029583", // Snow White and the Seven Dwarfs
  "tt0026778", // A Night at the Opera
  "tt0024216", // Duck Soup
  "tt0019254", // The Passion of Joan of Arc
  "tt0018455", // Steamboat Bill Jr.
  "tt0017925", // The General
  "tt0016220", // The Battleship Potemkin
  "tt0013442", // Nosferatu
  "tt0361748", // Inglourious Basterds
  "tt0268380", // Catch Me If You Can
  "tt0242653", // The Matrix Revolutions
  "tt0234215", // The Matrix Reloaded
  "tt0181689", // Minority Report
  "tt0144084", // American Psycho
  "tt0120755", // Mission: Impossible
  "tt0116629", // Independence Day
  "tt0108598", // Philadelphia
  "tt0107048", // Groundhog Day
  "tt0105695", // Unforgiven
  "tt0104257", // A Few Good Men
  "tt0101414", // Beauty and the Beast
  "tt0099348", // Dances with Wolves
  "tt0097165", // Dead Poets Society
  "tt0096283", // My Neighbor Totoro
  "tt0095953", // Rain Man
  "tt0094721", // Beetlejuice
  "tt0093779", // The Princess Bride
  "tt0092099", // Top Gun
  "tt0091763", // Platoon
  "tt0089881", // Witness
  "tt0089218", // The Breakfast Club
  "tt0088247", // The Terminator
  "tt0087332", // Ghostbusters
  "tt0086879", // Amadeus
  "tt0086385", // Indiana Jones and the Temple of Doom
  "tt0085334", // Blade Runner
  "tt0083866", // E.T. the Extra-Terrestrial
  "tt0082695", // Das Boot
  "tt0082096", // The Road Warrior
  "tt0081398", // Raging Bull
  "tt0080455", // Being There
  "tt0079945", // Kramer vs. Kramer
  "tt0079417", // Animal House
  "tt0078346", // Halloween
  "tt0077416", // The Deer Hunter
  "tt0076095", // Annie Hall
  "tt0075148", // Rocky
  "tt0074958", // Network
  "tt0073195", // Jaws
  "tt0072684", // Barry Lyndon
  "tt0071562", // The Godfather Part II
  "tt0070047", // The Exorcist
  "tt0069757", // Solaris
  "tt0069281", // Straw Dogs
  "tt0068473", // The French Connection
  "tt0067116", // McCabe and Mrs. Miller
  "tt0065214", // Patton
  "tt0064115", // Butch Cassidy and the Sundance Kid
  "tt0063522", // Rosemary's Baby
  "tt0061722", // The Graduate
  "tt0060827", // Persona
  "tt0059578", // For a Few Dollars More
  "tt0058461", // A Fistful of Dollars
  "tt0057115", // The Great Escape
  "tt0056923", // The Birds
  "tt0056801", // 8½
  "tt0055614", // The Manchurian Candidate
  "tt0054997", // West Side Story
  "tt0054331", // Eyes Without a Face
  "tt0053779", // La Dolce Vita
  "tt0052311", // Touch of Evil
  "tt0051201", // Witness for the Prosecution
  "tt0050976", // The Seventh Seal
  "tt0049406", // Forbidden Planet
  "tt0048473", // Rear Window
  "tt0047296", // Roman Holiday
  "tt0046912", // Singin' in the Rain
  "tt0045152", // Singin' in the Rain
  "tt0044706", // High Noon
  "tt0043987", // A Streetcar Named Desire
  "tt0042041", // Sunset Boulevard
  "tt0040724", // Rope
  "tt0039853", // Hamlet
  "tt0038787", // Notorious
  "tt0037931", // Double Indemnity
  "tt0035446", // Sullivan's Travels
  "tt0034240", // The Maltese Falcon
  "tt0032976", // Rebecca
  "tt0031679", // Mr. Smith Goes to Washington
  "tt0029947", // Bringing Up Baby
  "tt0028333", // Modern Times
  "tt0027977", // Modern Times
  "tt0026395", // It Happened One Night
  "tt0025337", // King Kong
  "tt0024010", // I Am a Fugitive from a Chain Gang
  "tt0022100", // M
  "tt0021749", // City Lights
  "tt0020629", // All Quiet on the Western Front
  "tt0019777", // The Broadway Melody
  "tt0018878", // Sunrise
  "tt0017136", // Metropolis
  "tt0016175", // The Cabinet of Dr. Caligari
  "tt0006864", // Intolerance
  "tt0004972", // The Birth of a Nation
  "tt0389860", // Cars
  "tt0435761", // Toy Story 3
  "tt0910970", // WALL-E
  "tt0499549", // Avatar
  "tt0848228", // The Avengers
  "tt0458339", // Captain America: The First Avenger
  "tt1375666", // Inception
  "tt1285016", // The Social Network
  "tt1255953", // Inglourious Basterds
  "tt1201607", // Harry Potter and the Deathly Hallows Part 2
  "tt1160419", // Dune
  "tt1130884", // Shutter Island
  "tt1099212", // Twilight
  "tt0993846", // The Wolf of Wall Street
  "tt0974015", // Justice League
  "tt0948470", // X-Men Origins: Wolverine
  "tt0903747", // Breaking Bad
  "tt0848228", // The Avengers
  "tt0800369", // Thor
  "tt0800080", // Tropic Thunder
  "tt0790636", // Dallas Buyers Club
  "tt0762073", // Flight
  "tt0758758", // Into the Wild
  "tt0737780", // Pirates of the Caribbean: Dead Man's Chest
  "tt0706366", // 300
  "tt0698650", // Letters from Iwo Jima
  "tt0660566", // The Prestige
  "tt0629135", // Borat
  "tt0619061", // Munich
  "tt0575998", // Black Hawk Down
  "tt0559312", // Hitch
  "tt0541523", // Jarhead
  "tt0477348", // No Country for Old Men
  "tt0443706", // Zodiac
  "tt0421715", // There Will Be Blood
  "tt0401792", // Sin City
  "tt0395169", // Hotel Rwanda
  "tt0387564", // Saw
  "tt0381681", // Before Sunset
  "tt0375679", // Crash
  "tt0367882", // Indiana Jones and the Kingdom of the Crystal Skull
  "tt0358273", // Walk the Line
  "tt0353496", // Eternal Sunshine of the Spotless Mind
  "tt0347149", // Howl's Moving Castle
  "tt0335266", // Lost in Translation
  "tt0317219", // Cars
  "tt0310203", // Adaptation
  "tt0304141", // Harry Potter and the Chamber of Secrets
  "tt0295297", // Harry Potter and the Philosopher's Stone
  "tt0289043", // 28 Days Later
  "tt0283160", // Zoolander
  "tt0278504", // Mulholland Drive
  "tt0272152", // K-PAX
  "tt0264464", // Catch Me If You Can
  "tt0258470", // Amélie
  "tt0251426", // Monsters Ball
  "tt0245712", // Vanilla Sky
  "tt0240772", // Ocean's Eleven
  "tt0236493", // Traffic
  "tt0230551", // Crouching Tiger Hidden Dragon
  "tt0220765", // Almost Famous
  "tt0210945", // Cast Away
  "tt0200465", // The Patriot
  "tt0190590", // O Brother Where Art Thou
  "tt0181852", // Unbreakable
  "tt0174856", // The Blair Witch Project
  "tt0172495", // Gladiator
  "tt0166924", // Mulholland Drive
  "tt0163025", // Magnolia
  "tt0160399", // The Insider
  "tt0156887", // Eyes Wide Shut
  "tt0154506", // The Truman Show
  "tt0151804", // Office Space
  "tt0149460", // Toy Story 2
  "tt0147800", // There's Something About Mary
  "tt0144117", // Lock Stock and Two Smoking Barrels
  "tt0139654", // The Thin Red Line
  "tt0132477", // The Big Lebowski
  "tt0130827", // Run Lola Run
  "tt0128445", // Boogie Nights
  "tt0126029", // Shrek
  "tt0120831", // Pay It Forward
  "tt0120382", // The Truman Show
  "tt0119643", // Boogie Nights
  "tt0117951", // Trainspotting
  "tt0117571", // Scream
  "tt0116367", // From Dusk Till Dawn
  "tt0114388", // Babe
  "tt0113243", // Heat
  "tt0112857", // Dead Man
  "tt0112471", // Before Sunrise
  "tt0111400", // Leon
  "tt0110357", // The Lion King
  "tt0110321", // Natural Born Killers
  "tt0109686", // Dumb and Dumber
  "tt0109170", // Clerks
  "tt0108598", // Philadelphia
  "tt0107290", // Jurassic Park
  "tt0107048", // Groundhog Day
  "tt0106977", // True Romance
  "tt0106918", // Schindler's List
  "tt0105695", // Unforgiven
  "tt0105236", // Reservoir Dogs
  "tt0104257", // A Few Good Men
  "tt0103776", // Edward Scissorhands
  "tt0102926", // The Silence of the Lambs
  "tt0101414", // Beauty and the Beast
  "tt0100160", // Home Alone
  "tt0099810", // Dances with Wolves
  "tt0099685", // Goodfellas
  "tt0098635", // When Harry Met Sally
  "tt0097576", // Indiana Jones and the Last Crusade
  "tt0096895", // Batman
  "tt0096283", // My Neighbor Totoro
  "tt0095953", // Rain Man
  "tt0095769", // Die Hard
  "tt0094721", // Beetlejuice
  "tt0093779", // The Princess Bride
  "tt0093058", // Full Metal Jacket
  "tt0092099", // Top Gun
  "tt0091763", // Platoon
  "tt0090605", // Aliens
  "tt0090329", // Back to the Future Part II
  "tt0089881", // Witness
  "tt0089218", // The Breakfast Club
  "tt0088763", // Back to the Future
  "tt0088247", // The Terminator
  "tt0087332", // Ghostbusters
  "tt0086190", // Star Wars: Return of the Jedi
  "tt0085334", // Blade Runner
  "tt0083866", // E.T. the Extra-Terrestrial
  "tt0082971", // Raiders of the Lost Ark
  "tt0082096", // The Road Warrior
  "tt0081505", // The Shining
  "tt0081398", // Raging Bull
  "tt0080455", // Being There
  "tt0079945", // Kramer vs. Kramer
  "tt0078788", // Apocalypse Now
  "tt0078748", // Alien
  "tt0078346", // Halloween
  "tt0077416", // The Deer Hunter
  "tt0076759", // Star Wars
  "tt0075148", // Rocky
  "tt0073195", // Jaws
  "tt0071315", // Chinatown
  "tt0070735", // The Sting
  "tt0070047", // The Exorcist
  "tt0068646", // The Godfather
  "tt0067116", // McCabe and Mrs. Miller
  "tt0066921", // A Clockwork Orange
  "tt0065214", // Patton
  "tt0064116", // Once Upon a Time in the West
  "tt0063522", // Rosemary's Baby
  "tt0062622", // 2001: A Space Odyssey
  "tt0061722", // The Graduate
  "tt0059578", // For a Few Dollars More
  "tt0058461", // A Fistful of Dollars
  "tt0057012", // Dr. Strangelove
  "tt0056592", // To Kill a Mockingbird
  "tt0055031", // High Noon
  "tt0054215", // Psycho
  "tt0053604", // The Apartment
  "tt0052357", // Vertigo
  "tt0051201", // Witness for the Prosecution
  "tt0050976", // The Seventh Seal
  "tt0050825", // Paths of Glory
  "tt0050083", // 12 Angry Men
  "tt0047478", // Seven Samurai
  "tt0047396", // Rear Window
  "tt0045152", // Singin' in the Rain
  "tt0044741", // Ikiru
  "tt0043014", // Sunset Boulevard
  "tt0042192", // All About Eve
  "tt0041959", // The Third Man
  "tt0040522", // Bicycle Thieves
  "tt0038650", // It's a Wonderful Life
  "tt0036775", // Double Indemnity
  "tt0034583", // Casablanca
  "tt0033467", // Citizen Kane
  "tt0032553", // The Great Dictator
  "tt0031381", // Gone with the Wind
  "tt0029583", // Snow White and the Seven Dwarfs
  "tt0027977", // Modern Times
  "tt0025316", // It Happened One Night
  "tt0021749", // City Lights
  "tt0017925", // The General
  "tt0017136", // Metropolis
  "tt0013442", // Nosferatu
  "tt6751668", // Parasite
  "tt6710474", // Everything Everywhere All at Once
  "tt5013056", // Dunkirk
  "tt4729430", // Manchester by the Sea
  "tt4633694", // Spider-Man: Into the Spider-Verse
  "tt4520988", // Frozen II
  "tt4154796", // Avengers: Endgame
  "tt4154756", // Avengers: Infinity War
  "tt3896198", // Guardians of the Galaxy Vol. 2
  "tt3783958", // La La Land
  "tt3704428", // Ex Machina
  "tt3659388", // The Martian
  "tt3521164", // Moana
  "tt3498820", // Captain America: Civil War
  "tt3450958", // The Revenant
  "tt3315342", // Logan
  "tt3170832", // Room
  "tt3011894", // Wild
  "tt2980516", // The Grand Budapest Hotel
  "tt2798920", // Annihilation
  "tt2737304", // Cloud Atlas
  "tt2582802", // Whiplash
  "tt2562232", // Birdman
  "tt2488496", // Star Wars: The Force Awakens
  "tt2381249", // Mission: Impossible - Rogue Nation
  "tt2267998", // Gone Girl
  "tt2245084", // Before Midnight
  "tt2084970", // The Imitation Game
  "tt1981115", // Thor: The Dark World
  "tt1979376", // Toy Story 4
  "tt1905041", // Fast and Furious 6
  "tt1843866", // Captain America: The Winter Soldier
  "tt1800241", // Argo
  "tt1774234", // The Amazing Spider-Man
  "tt1758830", // Midnight in Paris
  "tt1663662", // Pacific Rim
  "tt1649418", // The Hangover Part II
  "tt1637725", // Ted
  "tt1620409", // The Hobbit: An Unexpected Journey
  "tt1568346", // The Girl with the Dragon Tattoo
  "tt1535109", // Zero Dark Thirty
  "tt1504320", // The King's Speech
  "tt1392190", // Mad Max: Fury Road
  "tt1385826", // The Help
  "tt1371111", // The Artist
  "tt1285016", // The Social Network
  "tt1259571", // The Hobbit: The Desolation of Smaug
  "tt1228705", // Iron Man 2
  "tt1210166", // Moneyball
  "tt1201607", // Harry Potter and the Deathly Hallows Part 2
  "tt1179933", // 127 Hours
  "tt1160419", // Dune
  "tt1155592", // District 9
  "tt1130884", // Shutter Island
  "tt1099212", // Twilight
  "tt1045658", // The Artist
  "tt0993846", // The Wolf of Wall Street
  "tt0974015", // Justice League
  "tt0947798", // Black Swan
  "tt0903747", // Breaking Bad
  "tt0892769", // How to Train Your Dragon
  "tt0848228", // The Avengers
  "tt0840361", // The Hurt Locker
  "tt0800369", // Thor
  "tt0758758", // Into the Wild
  "tt0737780", // Pirates of the Caribbean: Dead Man's Chest
  "tt0706366", // 300
  "tt0477348", // No Country for Old Men
  "tt0443706", // Zodiac
  "tt0421715", // There Will Be Blood
  "tt0401792", // Sin City
  "tt0395169", // Hotel Rwanda
  "tt0381681", // Before Sunset
  "tt0375679", // Crash
  "tt0358273", // Walk the Line
  "tt0347149", // Howl's Moving Castle
  "tt0335266", // Lost in Translation
  "tt0289043", // 28 Days Later
  "tt0258470", // Amélie
  "tt0240772", // Ocean's Eleven
  "tt0230551", // Crouching Tiger Hidden Dragon
  "tt0210945", // Cast Away
  "tt0190590", // O Brother Where Art Thou
  "tt0181852", // Unbreakable
  "tt0172495", // Gladiator
  "tt0163025", // Magnolia
  "tt0149460", // Toy Story 2
  "tt0132477", // The Big Lebowski
  "tt0117951", // Trainspotting
  "tt0114369", // Se7en
  "tt0110912", // Pulp Fiction
  "tt0108052", // Schindler's List
];

async function upsertFromApi(imdbId) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${imdbId}&plot=short`,
  );
  const data = await response.json();
  if (data.Response === "False") {
    return null;
  }

  const film = await upsertFilm({
    api_id: data.imdbID,
    title: data.Title,
    year: parseInt(data.Year) || null,
    director: data.Director !== "N/A" ? data.Director : null,
    runtime: data.Runtime !== "N/A" ? data.Runtime : null,
    description: data.Plot !== "N/A" ? data.Plot : null,
    poster_url: data.Poster !== "N/A" ? data.Poster : null,
    genre: data.Genre !== "N/A" ? data.Genre : null,
    rating: parseFloat(data.imdbRating) || null,
  });

  return film.title;
}

await db.connect();

for (const imdbId of FILM_IDS) {
  await upsertFromApi(imdbId);
  await new Promise((res) => setTimeout(res, 300));
}

await db.end();
