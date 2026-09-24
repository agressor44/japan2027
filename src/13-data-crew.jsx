/* ===========================================================
   THE CREW — the roster, as given.
   This file is the fixed record of WHO is going. It is kept
   deliberately separate from traveler profiles (survey answers),
   which live in the shared store under profiles/<id> and are
   written by each signed-in traveler.
   =========================================================== */

const FAMILIES = [
  { id: "kraus",    name: "Adam",            sub: "Traveling solo",  color: "#2C4A7C" },
  { id: "terronez", name: "Terronez family", sub: "Two adults, two kids", color: "#B03A5B" },
  { id: "rodgers",  name: "Rodgers family",  sub: "Two adults, two kids", color: "#3F6B34" }
];

const TRAVELERS = [
  {
    id: "adam", name: "Adam Kraus", short: "Adam", family: "kraus",
    role: "adult", birthday: "06-04", color: "#2C4A7C",
    occupation: "Cloud engineer",
    tripRole: "Building and running this site",
    tagline: "The cloud engineer"
  },
  {
    id: "cristina", name: "Cristina Terronez", short: "Cristina", family: "terronez",
    role: "adult", birthday: "06-24", color: "#B03A5B",
    occupation: "Nurse — newborns",
    tripRole: "Primary trip planner",
    tagline: "The primary planner",
    loves: "Disney super-fan — into Disney-bounding",
    rel: { spouse: "jared", children: ["ale", "matteo"] }
  },
  {
    id: "jared", name: "Jared Terronez", short: "Jared", family: "terronez",
    role: "adult", birthday: "06-07", color: "#1F6F78",
    occupation: "Physician — general practice",
    rel: { spouse: "cristina", children: ["ale", "matteo"] }
  },
  {
    id: "joe", name: "Joseph Rodgers", short: "Joe", nick: "Joe", family: "rodgers",
    role: "adult", birthday: null, color: "#7A5C1E",
    occupation: "Nuclear engineer",
    rel: { spouse: "rebekah", children: ["lucy", "isabelle"] },
    needs: ["birthday"]
  },
  {
    id: "rebekah", name: "Rebekah Rodgers", short: "Rebekah", family: "rodgers",
    role: "adult", birthday: null, color: "#9C5A93",
    occupation: "Stay-at-home mom",
    rel: { spouse: "joe", children: ["lucy", "isabelle"] },
    needs: ["birthday"]
  },
  {
    id: "lucy", name: "Lucille Rodgers", short: "Lucy", nick: "Lucy", family: "rodgers",
    role: "graduate", age: 18, birthday: null, color: "#C43D28",
    milestone: "Just graduated high school",
    tagline: "The graduate",
    loves: "BTS, anime, and all the nerdy Japan stuff",
    rel: { parents: ["joe", "rebekah"], sibling: "isabelle" },
    needs: ["birthday"]
  },
  {
    id: "ale", name: "Alesandro Terronez", short: "Ale", nick: "Ale", family: "terronez",
    role: "kid", age: 12, birthday: null, color: "#C25A2E",
    loves: "Baseball and sports",
    rel: { parents: ["cristina", "jared"], sibling: "matteo" },
    needs: ["birthday"]
  },
  {
    id: "matteo", name: "Matteo Terronez", short: "Matteo", family: "terronez",
    role: "kid", age: 10, birthday: null, color: "#6247A8",
    loves: "Baseball and sports",
    rel: { parents: ["cristina", "jared"], sibling: "ale" },
    needs: ["birthday"]
  },
  {
    id: "isabelle", name: "Isabelle Rodgers", short: "Isabelle", family: "rodgers",
    role: "kid", age: 10, birthday: null, color: "#B5762B",
    rel: { parents: ["joe", "rebekah"], sibling: "lucy" },
    needs: ["birthday"]
  }
];

const ROLE_LABEL = { adult: "Adult", graduate: "Graduate", kid: "Kid" };

function travelerById(id) { return TRAVELERS.filter(function (t) { return t.id === id; })[0]; }
function familyById(id) { return FAMILIES.filter(function (f) { return f.id === id; })[0]; }

/* Birthdays that land inside the trip window. */
function birthdaysDuringTrip(anchor, dayCount) {
  const out = [];
  for (let n = 1; n <= dayCount; n++) {
    const iso = dayDate(anchor, n);
    const md = iso.slice(5);
    TRAVELERS.forEach(function (t) {
      if (t.birthday === md) out.push({ traveler: t, day: n, iso: iso });
    });
  }
  return out;
}
