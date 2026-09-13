/* ===========================================================
   TRAVELER PREFERENCE SURVEY — schema only.
   Answers are stored per traveler in the shared store at
   profiles/<travelerId>, written only by that signed-in person.
   Every field id is stable so answers survive schema edits.
   =========================================================== */

const SURVEY = [
  {
    id: "orientation",
    title: "How you travel",
    jp: "旅の型",
    blurb: "The basics that shape which days you'd actually enjoy.",
    fields: [
      {
        id: "interests", label: "What pulls you to Japan?", type: "chips",
        help: "Pick as many as are true.",
        options: [
          { id: "anime", label: "Anime & manga", tag: "anime" },
          { id: "gaming", label: "Video games", tag: "anime" },
          { id: "history", label: "History", tag: "traditional" },
          { id: "temples", label: "Temples & shrines", tag: "traditional" },
          { id: "food", label: "Food", tag: "food" },
          { id: "technology", label: "Technology", tag: "anime" },
          { id: "fashion", label: "Fashion & street style", tag: "shopping" },
          { id: "nature", label: "Nature & landscape", tag: "outdoor" },
          { id: "art", label: "Art & design", tag: "traditional" },
          { id: "architecture", label: "Architecture", tag: "traditional" },
          { id: "popculture", label: "Pop culture", tag: "anime" },
          { id: "nightlife", label: "Cities after dark", tag: "nightlife" },
          { id: "photography", label: "Photography", tag: "views" },
          { id: "shopping", label: "Shopping", tag: "shopping" }
        ]
      },
      {
        id: "activityLevel", label: "Activity level", type: "choice",
        options: [
          { id: "relaxed", label: "Relaxed", sub: "A couple of things a day, plenty of sitting down" },
          { id: "moderate", label: "Moderate", sub: "Two solid things a day with breaks" },
          { id: "gogo", label: "Go-go-go", sub: "Pack it in, I'll sleep on the plane" }
        ]
      },
      {
        id: "pace", label: "Your natural clock", type: "choice",
        options: [
          { id: "early", label: "Early riser", sub: "Happy to be at the bamboo grove at 7am" },
          { id: "night", label: "Night owl", sub: "Better after dark" },
          { id: "flexible", label: "Flexible", sub: "I'll go with whatever" }
        ]
      },
      {
        id: "groupTendency", label: "Who you'd rather be with", type: "choice",
        help: "Several days split the group on purpose — this helps sort them.",
        options: [
          { id: "whole", label: "The whole group", sub: "Keep everyone together" },
          { id: "adults", label: "The adults", sub: "Slower, quieter, better dinners" },
          { id: "kids", label: "With the kids", sub: "Wherever the young ones are" },
          { id: "independent", label: "Off on my own", sub: "Give me a meeting time and a map" }
        ]
      }
    ]
  },
  {
    id: "food",
    title: "Food",
    jp: "食",
    blurb: "Food is most of this trip. Be honest here — it saves arguments later.",
    fields: [
      {
        id: "foodAdventure", label: "How adventurous are you, really?", type: "scale",
        min: 1, max: 5,
        ends: ["Safe eater", "I'll eat anything"],
        marks: ["Familiar food only", "Cautious", "Middle of the road", "Game for most things", "Put it in front of me"]
      },
      {
        id: "favoriteFoods", label: "Favourites — what you'd happily eat every day", type: "chips",
        options: [
          { id: "sushi", label: "Sushi" }, { id: "ramen", label: "Ramen" },
          { id: "curry", label: "Japanese curry" }, { id: "katsu", label: "Katsu / fried things" },
          { id: "yakiniku", label: "Yakiniku / BBQ" }, { id: "noodles", label: "Udon & soba" },
          { id: "streetfood", label: "Street food" }, { id: "steak", label: "Beef & steak" },
          { id: "dessert", label: "Desserts" }, { id: "matcha", label: "Matcha everything" },
          { id: "konbini", label: "Convenience store snacks" }, { id: "chicken", label: "Yakitori / chicken" },
          { id: "seafoodlove", label: "Seafood" }, { id: "vegetarian", label: "Vegetables & tofu" }
        ]
      },
      { id: "favoriteFoodsOther", label: "Anything else you love", type: "text", placeholder: "Okonomiyaki, taiyaki, anything with cheese…" },
      {
        id: "foodAvoid", label: "Won't eat", type: "chips",
        options: [
          { id: "seafood", label: "Seafood" }, { id: "rawfish", label: "Raw fish" },
          { id: "spicy", label: "Spicy food" }, { id: "shellfish", label: "Shellfish" },
          { id: "mushroom", label: "Mushrooms" }, { id: "pork", label: "Pork" },
          { id: "beef", label: "Beef" }, { id: "egg", label: "Eggs" },
          { id: "dairy", label: "Dairy" }, { id: "adventurous", label: "Anything unidentifiable" }
        ]
      },
      { id: "dietary", label: "Allergies or dietary needs", type: "text", help: "This one matters — group reservations get made from it.", placeholder: "Nut allergy, vegetarian, gluten…" }
    ]
  },
  {
    id: "pulls",
    title: "What you'd actually go out of your way for",
    jp: "興味",
    blurb: "Used to sort which optional activities land on which day, and who goes.",
    fields: [
      {
        id: "cultural", label: "Traditional & cultural", type: "chips",
        options: [
          { id: "temples", label: "Temples & shrines" }, { id: "samurai", label: "Samurai & ninja" },
          { id: "sumo", label: "Sumo" }, { id: "museums", label: "Museums" },
          { id: "tea", label: "Tea ceremony" }, { id: "gardens", label: "Gardens" },
          { id: "kimono", label: "Kimono / dressing up" }, { id: "castles", label: "Castles" },
          { id: "crafts", label: "Crafts & workshops" }, { id: "onsen", label: "Onsen" },
          { id: "none", label: "Not really my thing" }
        ]
      },
      {
        id: "animeGaming", label: "Anime, games, characters", type: "chips",
        options: [
          { id: "pokemon", label: "Pokémon" }, { id: "nintendo", label: "Nintendo" },
          { id: "ghibli", label: "Studio Ghibli" }, { id: "shonen", label: "Shōnen / Jump titles" },
          { id: "gundam", label: "Gundam" }, { id: "arcades", label: "Arcades" },
          { id: "retro", label: "Retro gaming" }, { id: "gachapon", label: "Gachapon & figures" },
          { id: "sanrio", label: "Sanrio / cute characters" }, { id: "none", label: "None of it" }
        ]
      },
      { id: "franchises", label: "Specific series or games you'd travel for", type: "text", placeholder: "One Piece, Zelda, Demon Slayer…" },
      {
        id: "shopping", label: "Shopping interests", type: "chips",
        options: [
          { id: "anime", label: "Anime & character goods" }, { id: "fashion", label: "Clothes & fashion" },
          { id: "thrift", label: "Vintage & thrift" }, { id: "electronics", label: "Electronics" },
          { id: "stationery", label: "Stationery" }, { id: "souvenirs", label: "Souvenirs & gifts" },
          { id: "crafts", label: "Ceramics & crafts" }, { id: "beauty", label: "Skincare & beauty" },
          { id: "sneakers", label: "Sneakers & streetwear" }, { id: "none", label: "I'd rather not shop" }
        ]
      },
      {
        id: "outdoor", label: "Outdoor & active", type: "chips",
        options: [
          { id: "rafting", label: "River rafting" }, { id: "hiking", label: "Hiking & climbing" },
          { id: "parks", label: "Parks & wandering" }, { id: "animals", label: "Animals & wildlife" },
          { id: "cycling", label: "Cycling" }, { id: "views", label: "Viewpoints & towers" },
          { id: "none", label: "Keep me indoors" }
        ]
      },
      {
        id: "themeParks", label: "Theme parks", type: "choice",
        help: "There are up to three park days on the table.",
        options: [
          { id: "love", label: "Love them", sub: "Rope drop to fireworks" },
          { id: "interested", label: "Interested", sub: "One day would be great" },
          { id: "indifferent", label: "Could take or leave" },
          { id: "dislike", label: "Rather not", sub: "Count me on the other track" }
        ]
      }
    ]
  },
  {
    id: "shortlist",
    title: "Your short list",
    jp: "一番",
    blurb: "The part that actually changes the itinerary.",
    fields: [
      { id: "mustDo", label: "Your #1 — the thing that would make the trip", type: "textarea", placeholder: "If we do nothing else, I want to…" },
      { id: "niceToHave", label: "Nice to have", type: "textarea", placeholder: "Things you'd enjoy if they fit" },
      { id: "hardNo", label: "Hard no", type: "textarea", placeholder: "Things you'd rather skip entirely" },
      {
        id: "avoids", label: "Things that make a day hard for you", type: "chips",
        options: [
          { id: "heights", label: "Heights" }, { id: "crowds", label: "Big crowds" },
          { id: "earlymornings", label: "Early mornings" }, { id: "longwalks", label: "Long walks" },
          { id: "smallspaces", label: "Small spaces" }, { id: "loudnoise", label: "Loud places" },
          { id: "heat", label: "Heat" }, { id: "waiting", label: "Long queues" },
          { id: "water", label: "Boats & water" }, { id: "latenights", label: "Late nights" }
        ]
      },
      { id: "notes", label: "Anything else the planners should know", type: "textarea", placeholder: "Motion sickness, knee that complains, needs a nap after lunch…" }
    ]
  }
];

/* Fields that count toward the completion meter. */
const SURVEY_FIELDS = (function () {
  const out = [];
  SURVEY.forEach(function (s) { s.fields.forEach(function (f) { out.push(f); }); });
  return out;
})();

function fieldAnswered(f, v) {
  if (v === undefined || v === null || v === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function profileCompletion(profile) {
  if (!profile) return 0;
  let done = 0;
  SURVEY_FIELDS.forEach(function (f) { if (fieldAnswered(f, profile[f.id])) done++; });
  return Math.round(100 * done / SURVEY_FIELDS.length);
}

/* Interest options that map onto itinerary tags — the seed of the
   future "this is a good day for X" recommender. */
const INTEREST_TO_TAG = (function () {
  const m = {};
  SURVEY[0].fields[0].options.forEach(function (o) { if (o.tag) m[o.id] = o.tag; });
  return m;
})();

/* Which travelers' stated interests line up with an activity's tags. */
function fitFor(activityTags, profiles) {
  const tags = activityTags || [];
  const out = [];
  TRAVELERS.forEach(function (t) {
    const p = profiles[t.id];
    if (!p || !p.interests || !p.interests.length) return;
    const hit = p.interests.some(function (i) { return tags.indexOf(INTEREST_TO_TAG[i]) >= 0; });
    if (hit) out.push(t);
  });
  return out;
}
