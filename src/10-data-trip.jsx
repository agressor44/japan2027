/* ===========================================================
   TRIP DATA — meta, cities, travelers, taxonomy
   All planning data lives here, separate from presentation.
   =========================================================== */

const TRIP = {
  id: "japan-2027",
  name: "Japan 2027",
  jp: "日本 2027",
  subtitle: "Tokyo → Kyoto → Nara → Osaka",
  year: 2027,
  // Locked. Sat May 29 (travel / fly out) → Fri Jun 11 (fly home). 14 days.
  defaultAnchor: "2027-05-29",
  dayCount: 14,
  datesFinal: true,
  party: { adults: 5, kids: 4, total: 9 },
  occasion: { who: "lucy", label: "Lucy's graduation trip", glyph: "🎓" },
  philosophy: [
    "Two major experiences a day — not a checklist sprint.",
    "Leave room for food, shopping, wandering and detours.",
    "Nine of us move slower than a couple. Budget for it.",
    "Split the group when interests split. That's a feature.",
    "Memorable over famous."
  ]
};

const CITIES = {
  tokyo: {
    id: "tokyo", name: "Tokyo", jp: "東京", romaji: "tōkyō",
    days: [1, 2, 3, 4, 5, 6],
    hue: "var(--tokyo)",
    pattern: "kumiko",
    blurb: "Six nights. Neon, shrines, arcades, and the best convenience stores on earth.",
    note: "Base for the first half. Everything below is a train ride apart."
  },
  kyoto: {
    id: "kyoto", name: "Kyoto", jp: "京都", romaji: "kyōto",
    days: [7, 8, 9, 10],
    hue: "var(--kyoto)",
    pattern: "asanoha",
    blurb: "Four nights. Temples at 7am, river rapids, bamboo, and a cooking class.",
    note: "Start early here — Arashiyama and Fushimi Inari are transformed by an early start."
  },
  nara: {
    id: "nara", name: "Nara", jp: "奈良", romaji: "nara",
    days: [11],
    hue: "var(--nara)",
    pattern: "asanoha",
    blurb: "A half day on the way to Osaka. Deer, and the largest bronze Buddha in Japan.",
    note: "Day trip only — no hotel night. Luggage forwards straight to Osaka."
  },
  osaka: {
    id: "osaka", name: "Osaka", jp: "大阪", romaji: "ōsaka",
    days: [11, 12, 13, 14],
    hue: "var(--osaka)",
    pattern: "seigaiha",
    blurb: "Three nights. Loud, neon, and built around eating standing up.",
    note: "Closest big airport for the flight home — KIX."
  }
};

const CITY_ORDER = ["tokyo", "kyoto", "nara", "osaka"];

/* --- Tag taxonomy: who it's for, and what kind of day it makes --- */
const TAGS = {
  everyone:    { label: "Everyone",      group: "who",  glyph: "全" },
  teens:       { label: "Lively pick",   group: "who",  glyph: "青" },
  adults:      { label: "Low-key pick",  group: "who",  glyph: "大" },
  split:       { label: "Split group",   group: "who",  glyph: "分" },
  traditional: { label: "Traditional",   group: "kind", glyph: "伝" },
  anime:       { label: "Anime / games", group: "kind", glyph: "遊" },
  outdoor:     { label: "Outdoor",       group: "kind", glyph: "外" },
  food:        { label: "Food",          group: "kind", glyph: "食" },
  shopping:    { label: "Shopping",      group: "kind", glyph: "買" },
  views:       { label: "Views",         group: "kind", glyph: "景" },
  nightlife:   { label: "After dark",    group: "kind", glyph: "夜" },
  energy:      { label: "High energy",   group: "pace", glyph: "力" },
  relaxed:     { label: "Relaxed",       group: "pace", glyph: "静" }
};

const STATUSES = {
  confirmed: { label: "Confirmed", tone: "good" },
  booked:    { label: "Booked",    tone: "good" },
  planned:   { label: "Planned",   tone: "neutral" },
  reserve:   { label: "Needs booking", tone: "warn" },
  optional:  { label: "Optional",  tone: "muted" },
  skip:      { label: "Skipped",   tone: "off" }
};

/* --- The roster lives in 13-data-crew.jsx.
       Survey answers live separately, in the shared store. --- */

/* --- Travel between cities --- */
const SEGMENTS = [
  {
    id: "seg-nrt-hnd",
    afterDay: 0, from: "USA", to: "Tokyo",
    mode: "flight", jp: "到着",
    label: "Fly in",
    detail: "Arrival, immigration, and the train or limo bus into the city. Assume the day is gone.",
    todo: ["Confirm airport (HND is closer; NRT is usually cheaper)", "Pre-book Welcome Suica / IC cards", "Arrange 9-person transfer or teach everyone the train"]
  },
  {
    id: "seg-tyo-kyo",
    afterDay: 6, from: "Tokyo", to: "Kyoto",
    mode: "shinkansen", jp: "東海道新幹線",
    label: "Tōkaidō Shinkansen",
    detail: "≈2h15m on the Nozomi. Treat the train as part of the trip, not transport.",
    todo: ["Reserve 9 seats together — do not wing this", "Ask for D/E seats for the Mt. Fuji side", "Forward big luggage Tokyo → Kyoto hotel", "Ekiben on the platform before boarding"]
  },
  {
    id: "seg-kyo-nara",
    afterDay: 10, from: "Kyoto", to: "Nara",
    mode: "train", jp: "近鉄",
    label: "Kintetsu / JR to Nara",
    detail: "≈45 min. Check out of Kyoto first and forward luggage ahead to Osaka.",
    todo: ["Forward luggage Kyoto → Osaka hotel", "Day bags only for Nara"]
  },
  {
    id: "seg-nara-osa",
    afterDay: 11, from: "Nara", to: "Osaka",
    mode: "train", jp: "大阪へ",
    label: "Nara → Osaka",
    detail: "≈45 min into Namba or Umeda depending on the hotel.",
    todo: ["Pick the hotel side of town before booking tickets"]
  },
  {
    id: "seg-kix",
    afterDay: 14, from: "Osaka", to: "USA",
    mode: "flight", jp: "出発",
    label: "Fly home from KIX",
    detail: "Nine people, international check-in. Leave far more buffer than feels necessary.",
    todo: ["Book airport transfer for 9 + luggage", "Be at KIX 3½ hrs before", "Spend the last yen in the terminal"]
  }
];
