/* ===========================================================
   ITINERARY — 15 tentative days.
   Every activity has a stable id so votes, status and notes
   can attach to it without touching this file.
   =========================================================== */

const DAYS = [
  /* ---------------------------------------------------- 1 */
  {
    n: 1, city: "tokyo", title: "Land in Tokyo", jp: "到着",
    theme: "Do almost nothing on purpose",
    intent: "Jet lag is real for nine people. One light evening beats a wasted day two.",
    blocks: {
      afternoon: [
        { id: "d1-arrive", title: "Arrival & immigration", kind: "transit", dur: "2–3 hrs", tags: ["everyone"], status: "planned", note: "Visit Japan Web filled out in advance saves a long line." },
        { id: "d1-checkin", title: "Hotel check-in", kind: "rest", dur: "1 hr", tags: ["everyone", "relaxed"], status: "reserve", note: "Nine people is likely 3–4 rooms. Book early for adjacent rooms." }
      ],
      evening: [
        { id: "d1-konbini", title: "First convenience store run", kind: "food", dur: "30 min", tags: ["everyone", "food"], status: "planned", note: "A trip tradition starts here. Egg sandwich, onigiri, weird drinks.", votable: true },
        { id: "d1-walk", title: "Wander the hotel neighborhood", kind: "sight", dur: "1 hr", tags: ["everyone", "relaxed"], status: "planned" },
        { id: "d1-dinner", title: "Casual first dinner", kind: "food", dur: "1 hr", tags: ["everyone", "food"], status: "planned", note: "Ramen, curry, or a gyoza counter. Nothing that needs a reservation." },
        { id: "d1-donki", title: "Arcade or Don Quijote", kind: "shopping", dur: "1 hr", tags: ["teens", "shopping", "anime"], status: "optional", note: "Only if anyone still has a pulse.", votable: true }
      ]
    },
    food: ["konbini-onigiri", "konbini-egg", "tokyo-ramen"],
    notes: ["Keep this day deliberately empty.", "Get IC cards sorted tonight if they weren't pre-ordered."]
  },

  /* ---------------------------------------------------- 2 */
  {
    n: 2, city: "tokyo", title: "Shibuya & Harajuku", jp: "渋谷・原宿",
    theme: "The day the teenagers came for",
    intent: "Pop-culture Tokyo at full volume, bookended by a shrine and a sunset.",
    highlight: true,
    blocks: {
      morning: [
        { id: "d2-crossing", title: "Shibuya Crossing", jp: "渋谷スクランブル交差点", kind: "sight", dur: "30 min", tags: ["everyone", "energy"], status: "planned" },
        { id: "d2-hachiko", title: "Hachikō statue", jp: "忠犬ハチ公", kind: "sight", dur: "15 min", tags: ["everyone"], status: "planned", note: "Obligatory group photo. It's smaller than everyone expects." },
        { id: "d2-centergai", title: "Center-gai", kind: "shopping", dur: "45 min", tags: ["teens", "shopping"], status: "planned" },
        { id: "d2-parco", title: "Shibuya PARCO", jp: "渋谷パルコ", kind: "shopping", dur: "2 hrs", tags: ["teens", "anime", "shopping", "energy"], status: "planned", note: "Nintendo Tokyo · Pokémon Center Shibuya · Capcom Store · Jump Shop — all on the 6th floor.", votable: true }
      ],
      afternoon: [
        { id: "d2-meiji", title: "Meiji Jingū", jp: "明治神宮", kind: "sight", dur: "1 hr", tags: ["everyone", "traditional", "relaxed"], status: "planned", note: "The forest walk in is the point. A genuine break from the noise." },
        { id: "d2-takeshita", title: "Takeshita Street", jp: "竹下通り", kind: "shopping", dur: "1 hr", tags: ["teens", "shopping", "energy", "food"], status: "planned", note: "Crepes. Shoulder to shoulder. Agree on a meeting point first." },
        { id: "d2-catst", title: "Cat Street → Omotesandō", kind: "shopping", dur: "1.5 hrs", tags: ["adults", "shopping", "relaxed"], status: "planned", note: "Calmer, better designed, better coffee. Natural split point." }
      ],
      evening: [
        { id: "d2-sky", title: "Shibuya Sky at sunset", jp: "渋谷スカイ", kind: "sight", dur: "1.5 hrs", tags: ["everyone", "views"], status: "reserve", note: "Timed tickets sell out. Book the slot ~45 min before sunset.", votable: true },
        { id: "d2-crossing-night", title: "Shibuya Crossing after dark", kind: "sight", dur: "30 min", tags: ["everyone", "nightlife"], status: "planned", note: "Completely different from the morning. Worth doing twice." },
        { id: "d2-dinner", title: "Dinner in Shibuya", kind: "food", dur: "1.5 hrs", tags: ["everyone", "food"], status: "planned", note: "Yakiniku or sushi — the two easiest wins for a group of nine." }
      ]
    },
    food: ["harajuku-crepe", "souffle-pancake", "taiyaki", "tokyo-yakiniku"],
    notes: ["Highest-priority teen day of the Tokyo half.", "Shibuya Sky is the one thing here that must be booked ahead."]
  },

  /* ---------------------------------------------------- 3 */
  {
    n: 3, city: "tokyo", title: "DisneySea — or not", jp: "分かれ道",
    theme: "First real split-group day",
    intent: "Not everyone wants a theme park. Nobody should have to.",
    split: true,
    tracks: [
      {
        id: "d3-disney", label: "DisneySea", jp: "ディズニーシー", tags: ["teens", "energy"],
        blurb: "Full day, rope drop to fireworks. The one Disney park that exists nowhere else.",
        items: [
          { id: "d3-sea", title: "Tokyo DisneySea", kind: "experience", dur: "Full day", tags: ["energy"], status: "reserve", note: "Tickets are date-specific and go on sale ~2 months out." }
        ]
      },
      {
        id: "d3-tokyo", label: "Tokyo without Disney", jp: "東京散策", tags: ["adults", "food"],
        blurb: "Market breakfast, Ginza, character shops, and Shinjuku at night.",
        items: [
          { id: "d3-tsukiji", title: "Tsukiji Outer Market", jp: "築地場外市場", kind: "food", dur: "2 hrs", tags: ["food", "everyone"], status: "planned", note: "Graze, don't sit down. Go before 10am." },
          { id: "d3-ginza", title: "Ginza", jp: "銀座", kind: "shopping", dur: "2 hrs", tags: ["adults", "shopping"], status: "planned" },
          { id: "d3-pokedx", title: "Pokémon Center Tokyo DX", kind: "shopping", dur: "1 hr", tags: ["teens", "anime"], status: "planned", note: "The flagship. Attached Pokémon Café needs a lottery reservation.", votable: true },
          { id: "d3-charst", title: "Tokyo Station Character Street", jp: "東京駅一番街", kind: "shopping", dur: "1 hr", tags: ["teens", "anime", "shopping"], status: "planned" },
          { id: "d3-shinjuku", title: "Shinjuku in the evening", jp: "新宿", kind: "sight", dur: "2 hrs", tags: ["everyone", "nightlife"], status: "planned" }
        ]
      }
    ],
    blocks: {},
    food: ["tsukiji-tamago", "tsukiji-tuna", "tsukiji-wagyu", "tsukiji-daifuku"],
    notes: ["If the group only does one Disney park, make it DisneySea — it's the more uniquely Japanese one.", "Whoever skips Disney should still get a great day, not a consolation prize."]
  },

  /* ---------------------------------------------------- 4 */
  {
    n: 4, city: "tokyo", title: "Disneyland or flex", jp: "自由日",
    theme: "Deliberately unplanned",
    intent: "A second park day for some, a breathing day for everyone else.",
    split: true,
    tracks: [
      {
        id: "d4-dl", label: "Tokyo Disneyland", jp: "ディズニーランド", tags: ["teens", "energy"],
        blurb: "Only if day 3 left people wanting more park.",
        items: [
          { id: "d4-disneyland", title: "Tokyo Disneyland", kind: "experience", dur: "Full day", tags: ["energy"], status: "optional", note: "Decide after DisneySea, not before." }
        ]
      },
      {
        id: "d4-flex", label: "Flex Tokyo", jp: "気ままに", tags: ["everyone", "relaxed"],
        blurb: "Shopping, arcades, karaoke, Odaiba. Re-run anything that got cut.",
        items: [
          { id: "d4-odaiba", title: "Odaiba & DiverCity", jp: "お台場", kind: "sight", dur: "3 hrs", tags: ["teens", "anime"], status: "optional", note: "The life-size Unicorn Gundam transforms on a schedule.", votable: true },
          { id: "d4-joypolis", title: "Tokyo Joypolis", kind: "experience", dur: "3 hrs", tags: ["teens", "energy", "anime"], status: "optional", votable: true },
          { id: "d4-ghibli", title: "Ghibli Museum", jp: "三鷹の森ジブリ美術館", kind: "experience", dur: "3 hrs", tags: ["everyone", "traditional"], status: "reserve", note: "Lottery months ahead. Nine tickets together is genuinely unlikely — decide who goes.", votable: true },
          { id: "d4-karaoke", title: "Private-room karaoke", jp: "カラオケ", kind: "experience", dur: "2 hrs", tags: ["everyone", "energy", "nightlife"], status: "planned", note: "One room fits nine. Do this somewhere in the Tokyo half — it's the cheapest great memory of the trip.", votable: true },
          { id: "d4-arcade", title: "Arcades & gachapon", kind: "experience", dur: "2 hrs", tags: ["teens", "anime"], status: "optional" }
        ]
      }
    ],
    blocks: {},
    food: ["tokyo-curry", "tokyo-tonkatsu", "konbini-chicken"],
    notes: ["Keep this day soft. It's the pressure valve for the whole Tokyo week."]
  },

  /* ---------------------------------------------------- 5 */
  {
    n: 5, city: "tokyo", title: "Palace → Akihabara → Skytree", jp: "皇居・秋葉原・スカイツリー",
    theme: "Old Tokyo, geek Tokyo, future Tokyo — in that order",
    intent: "One day that tells the whole story of the city, in sequence.",
    highlight: true,
    blocks: {
      morning: [
        { id: "d5-palace", title: "Imperial Palace East Gardens", jp: "皇居東御苑", kind: "sight", dur: "1.5 hrs", tags: ["everyone", "traditional", "relaxed"], status: "planned", note: "Free. Closed Mondays and Fridays — check against the final dates." },
        { id: "d5-tokyostation", title: "Tokyo Station & Marunouchi", jp: "東京駅", kind: "sight", dur: "1 hr", tags: ["everyone"], status: "planned" }
      ],
      afternoon: [
        { id: "d5-akiba", title: "Akihabara", jp: "秋葉原", kind: "shopping", dur: "4 hrs", tags: ["teens", "anime", "shopping", "energy"], status: "planned", note: "Super Potato for retro games · Animate · Mandarake · multi-floor gachapon halls · arcades.", votable: true },
        { id: "d5-maid", title: "Maid café", jp: "メイドカフェ", kind: "experience", dur: "1 hr", tags: ["teens", "anime"], status: "optional", note: "Deeply silly. Either a highlight or a hard no — put it to a vote.", votable: true }
      ],
      evening: [
        { id: "d5-skytree", title: "Tokyo Skytree at sunset", jp: "東京スカイツリー", kind: "sight", dur: "2 hrs", tags: ["everyone", "views"], status: "reserve", note: "Timed entry. Pairs badly with Shibuya Sky on the same trip unless you want both heights.", votable: true },
        { id: "d5-solamachi", title: "Tokyo Solamachi", kind: "shopping", dur: "1.5 hrs", tags: ["teens", "shopping", "anime"], status: "planned", note: "Pokémon Center Skytree Town is in here." },
        { id: "d5-dinner", title: "Dinner at Solamachi", kind: "food", dur: "1 hr", tags: ["everyone", "food"], status: "planned", note: "Whole floors of restaurants — easiest possible group dinner." }
      ]
    },
    food: ["akiba-ramen", "akiba-curry", "akiba-gyukatsu"],
    notes: ["The progression traditional → pop-culture → futuristic is the point. Don't reorder it."]
  },

  /* ---------------------------------------------------- 6 */
  {
    n: 6, city: "tokyo", title: "teamLab & neon Shinjuku", jp: "チームラボ・新宿",
    theme: "Digital art by day, Blade Runner by night",
    intent: "The most photographed thing the group will do, then the loudest.",
    highlight: true,
    blocks: {
      morning: [
        { id: "d6-teamlab", title: "teamLab Borderless", jp: "チームラボボーダレス", kind: "experience", dur: "2–3 hrs", tags: ["everyone", "anime", "energy"], status: "reserve", note: "Azabudai Hills. Timed tickets, released monthly, and they go. Wear something light — one room is ankle-deep water.", votable: true }
      ],
      afternoon: [
        { id: "d6-azabudai", title: "Azabudai Hills & Roppongi", jp: "麻布台ヒルズ", kind: "sight", dur: "1.5 hrs", tags: ["adults", "relaxed"], status: "planned" },
        { id: "d6-tokyotower", title: "Tokyo Tower", jp: "東京タワー", kind: "sight", dur: "1 hr", tags: ["everyone", "views"], status: "optional", votable: true },
        { id: "d6-zojoji", title: "Zōjō-ji", jp: "増上寺", kind: "sight", dur: "45 min", tags: ["everyone", "traditional"], status: "planned", note: "The temple-with-Tokyo-Tower-behind-it shot." },
        { id: "d6-bus", title: "Hop-on sightseeing bus", kind: "transit", dur: "1 hr", tags: ["relaxed", "everyone"], status: "optional", note: "Treat it as a rest with a view, not as transport." }
      ],
      evening: [
        { id: "d6-kabukicho", title: "Shinjuku & Kabukichō", jp: "歌舞伎町", kind: "sight", dur: "2 hrs", tags: ["everyone", "nightlife", "energy"], status: "planned", note: "Stay on the main streets. The Godzilla head is on the Toho building." },
        { id: "d6-omoide", title: "Omoide Yokochō alley walk", jp: "思い出横丁", kind: "food", dur: "1 hr", tags: ["adults", "food", "nightlife"], status: "optional", note: "Tiny yakitori counters — seats 4 at most. Split up or just walk it." },
        { id: "d6-arcade2", title: "Shinjuku arcades", kind: "experience", dur: "1 hr", tags: ["teens", "anime"], status: "optional" }
      ]
    },
    food: ["tokyo-yakitori", "tokyo-curry"],
    notes: ["teamLab reservations are the single most time-sensitive booking on the whole trip."]
  },

  /* ---------------------------------------------------- 7 */
  {
    n: 7, city: "tokyo", title: "Sumo & last Tokyo day", jp: "両国・相撲",
    theme: "Sleep in, then something nobody expected",
    intent: "Close Tokyo with the least touristy-feeling thing on the list.",
    blocks: {
      morning: [
        { id: "d7-sleepin", title: "Sleep in", kind: "rest", dur: "—", tags: ["everyone", "relaxed"], status: "planned", note: "Seven days in. Take it." },
        { id: "d7-shopping", title: "Last Tokyo shopping run", kind: "shopping", dur: "2 hrs", tags: ["everyone", "shopping"], status: "planned", note: "Anything anyone has been thinking about all week." }
      ],
      afternoon: [
        { id: "d7-ryogoku", title: "Ryōgoku — the sumo district", jp: "両国", kind: "sight", dur: "1 hr", tags: ["everyone", "traditional"], status: "planned" },
        { id: "d7-sumo", title: "Sumo tournament or stable show", jp: "大相撲", kind: "experience", dur: "3 hrs", tags: ["everyone", "traditional", "energy"], status: "reserve", note: "May tournament runs in Tokyo — if the dates land right, buy real tournament tickets. Otherwise book a demonstration show with chanko lunch.", votable: true }
      ],
      evening: [
        { id: "d7-chanko", title: "Chanko-nabe dinner", jp: "ちゃんこ鍋", kind: "food", dur: "1.5 hrs", tags: ["everyone", "food", "traditional"], status: "reserve", note: "The wrestlers' stew, in the wrestlers' neighborhood. Reserve for 9." },
        { id: "d7-pack", title: "Pack & forward luggage", kind: "transit", dur: "1 hr", tags: ["everyone"], status: "planned", note: "Send the big bags to Kyoto tonight. Tomorrow is a day-bag day." }
      ]
    },
    food: ["chanko", "konbini-dessert"],
    notes: ["If the May tournament (Natsu Basho) overlaps the final dates, this becomes a headline event — check as soon as dates lock.", "Luggage forwarding tonight makes the shinkansen tomorrow genuinely pleasant."]
  },

  /* ---------------------------------------------------- 8 */
  {
    n: 8, city: "kyoto", title: "Into Kyoto — market & Gion", jp: "京都へ",
    theme: "Arrive hungry",
    intent: "Shinkansen as an event, then eat your way down Nishiki and into old Kyoto at dusk.",
    arriveBy: "seg-tyo-kyo",
    blocks: {
      morning: [
        { id: "d8-shink", title: "Tōkaidō Shinkansen to Kyoto", jp: "新幹線", kind: "transit", dur: "2h15m", tags: ["everyone"], status: "reserve", note: "Nine reserved seats together. Right-hand D/E side for Mt. Fuji. Buy ekiben on the platform.", votable: false },
        { id: "d8-checkin", title: "Drop bags / check in", kind: "rest", dur: "45 min", tags: ["everyone"], status: "reserve" }
      ],
      afternoon: [
        { id: "d8-nishiki", title: "Nishiki Market", jp: "錦市場", kind: "food", dur: "2 hrs", tags: ["everyone", "food", "energy"], status: "planned", note: "Five blocks of small bites. Buy one thing each and pass it around.", votable: true },
        { id: "d8-teramachi", title: "Teramachi & Shinkyōgoku arcades", kind: "shopping", dur: "1.5 hrs", tags: ["teens", "shopping", "anime"], status: "planned", note: "Covered arcades — Pokémon Center Kyoto and character shops are along here." },
        { id: "d8-cooking", title: "Japanese cooking class", jp: "料理教室", kind: "experience", dur: "3 hrs", tags: ["everyone", "food", "traditional"], status: "reserve", note: "Ramen, sushi, gyoza, bento or wagashi. Book a private class for 9 — public classes rarely seat a group this size.", votable: true }
      ],
      evening: [
        { id: "d8-gion", title: "Gion at dusk", jp: "祇園", kind: "sight", dur: "1.5 hrs", tags: ["everyone", "traditional"], status: "planned", note: "Hanamikōji and the lanterns. Photography is restricted on the private alleys — respect the signs." },
        { id: "d8-yasaka", title: "Yasaka Shrine", jp: "八坂神社", kind: "sight", dur: "30 min", tags: ["everyone", "traditional"], status: "planned" },
        { id: "d8-pontocho", title: "Pontochō", jp: "先斗町", kind: "food", dur: "1 hr", tags: ["adults", "food", "nightlife"], status: "planned", note: "One-lane lantern alley along the river." }
      ]
    },
    food: ["nishiki-dashimaki", "nishiki-mochi", "nishiki-matcha", "nishiki-donut"],
    notes: ["The cooking class is the best value experience in Kyoto for a mixed-age group.", "Kyoto is a bus-and-walk city. Nine people + buses = plan buffer."]
  },

  /* ---------------------------------------------------- 9 */
  {
    n: 9, city: "kyoto", title: "Hozugawa river day", jp: "保津川下り",
    theme: "Get out of the temples",
    intent: "An outdoor day placed deliberately between two heavy sightseeing days.",
    highlight: true,
    blocks: {
      morning: [
        { id: "d9-kameoka", title: "Train to Kameoka", kind: "transit", dur: "40 min", tags: ["everyone"], status: "planned" },
        { id: "d9-raft", title: "Hozugawa river boat ride", jp: "保津川下り", kind: "experience", dur: "2 hrs", tags: ["everyone", "outdoor", "energy"], status: "reserve", note: "Traditional flat boat, real rapids, boatmen poling the whole way. Ends in Arashiyama. Book for 9.", votable: true }
      ],
      afternoon: [
        { id: "d9-lunch", title: "Lunch in Arashiyama", kind: "food", dur: "1 hr", tags: ["everyone", "food"], status: "planned" },
        { id: "d9-togetsukyo", title: "Togetsukyō Bridge", jp: "渡月橋", kind: "sight", dur: "30 min", tags: ["everyone", "views", "relaxed"], status: "planned" },
        { id: "d9-onsen", title: "Onsen or foot bath", jp: "温泉", kind: "rest", dur: "1.5 hrs", tags: ["adults", "relaxed", "traditional"], status: "optional", note: "Arashiyama has a station foot bath as an easy low-commitment version. Tattoo rules vary — check per facility.", votable: true }
      ],
      evening: [
        { id: "d9-dinner", title: "Relaxed dinner back in Kyoto", kind: "food", dur: "1.5 hrs", tags: ["everyone", "food", "relaxed"], status: "planned" }
      ]
    },
    food: ["arashiyama-soba", "arashiyama-tofu", "arashiyama-matcha"],
    notes: ["The boat runs in most weather but can be cancelled for high water — keep a rainy-day alternative.", "This is the day that keeps the group from burning out on shrines."]
  },

  /* --------------------------------------------------- 10 */
  {
    n: 10, city: "kyoto", title: "Arashiyama, early", jp: "嵐山",
    theme: "Be in the bamboo before the crowds",
    intent: "A 7:00 start buys an empty bamboo grove. A 10:00 start buys a queue.",
    startEarly: "7:00–7:30 AM",
    blocks: {
      morning: [
        { id: "d10-bamboo", title: "Bamboo Grove", jp: "竹林の小径", kind: "sight", dur: "45 min", tags: ["everyone", "traditional", "outdoor"], status: "planned", note: "Non-negotiable early start. By 9am it is a slow-moving crowd.", votable: true },
        { id: "d10-tenryuji", title: "Tenryū-ji", jp: "天龍寺", kind: "sight", dur: "1 hr", tags: ["everyone", "traditional"], status: "planned", note: "The garden is the reason, not the hall." },
        { id: "d10-monkey", title: "Iwatayama Monkey Park", jp: "嵐山モンキーパーク", kind: "experience", dur: "1.5 hrs", tags: ["teens", "outdoor", "energy"], status: "optional", note: "A genuine hill climb. The view at the top is the payoff.", votable: true }
      ],
      afternoon: [
        { id: "d10-foodtour", title: "Kyoto food tour", kind: "food", dur: "3 hrs", tags: ["everyone", "food"], status: "reserve", note: "Guided, which solves the where-do-nine-people-eat problem for an afternoon.", votable: true },
        { id: "d10-sagano", title: "Sagano scenic railway", jp: "嵯峨野トロッコ列車", kind: "experience", dur: "1 hr", tags: ["everyone", "relaxed", "views"], status: "optional", note: "Open-sided train through the gorge. Reserve — it sells out.", votable: true },
        { id: "d10-tea", title: "Tea ceremony", jp: "茶道", kind: "experience", dur: "1 hr", tags: ["adults", "traditional", "relaxed"], status: "optional", votable: true },
        { id: "d10-kimono", title: "Kimono rental", jp: "着物レンタル", kind: "experience", dur: "Half day", tags: ["everyone", "traditional"], status: "optional", note: "Best done in Kyoto or Osaka, not both. Pick one.", votable: true }
      ],
      evening: [
        { id: "d10-free", title: "Free evening", kind: "rest", dur: "—", tags: ["everyone", "relaxed"], status: "planned", note: "Shopping, wandering, or nothing." }
      ]
    },
    food: ["arashiyama-udon", "arashiyama-taiyaki", "arashiyama-softserve"],
    notes: ["Three optional add-ons compete for the same afternoon. Vote and pick two at most."]
  },

  /* --------------------------------------------------- 11 */
  {
    n: 11, city: "kyoto", title: "Classic Kyoto", jp: "伏見稲荷・清水寺",
    theme: "The postcard day, done properly",
    intent: "Torii gates at dawn, swords in the afternoon, Gion one last time.",
    startEarly: "7:00 AM",
    highlight: true,
    blocks: {
      morning: [
        { id: "d11-fushimi", title: "Fushimi Inari Taisha", jp: "伏見稲荷大社", kind: "sight", dur: "2 hrs", tags: ["everyone", "traditional", "outdoor"], status: "planned", note: "Walk up as far as the Yotsutsuji viewpoint — about 30–40 min. The full summit loop is not required and will cost the day.", votable: true }
      ],
      afternoon: [
        { id: "d11-samurai", title: "Samurai / ninja experience", jp: "侍・忍者体験", kind: "experience", dur: "2 hrs", tags: ["teens", "traditional", "energy"], status: "reserve", note: "Sword demonstration, armor, shuriken throwing — exact mix depends on the provider. Book for 9.", votable: true },
        { id: "d11-kiyomizu", title: "Kiyomizu-dera", jp: "清水寺", kind: "sight", dur: "1.5 hrs", tags: ["everyone", "traditional", "views"], status: "planned" },
        { id: "d11-sannenzaka", title: "Sannenzaka & Ninenzaka", jp: "三年坂・二年坂", kind: "shopping", dur: "1.5 hrs", tags: ["everyone", "shopping", "traditional", "food"], status: "planned", note: "Stone-stepped lanes down from the temple. Best souvenir shopping in Kyoto." }
      ],
      evening: [
        { id: "d11-gion2", title: "Last walk through Gion", kind: "sight", dur: "1 hr", tags: ["everyone", "traditional", "relaxed"], status: "planned" },
        { id: "d11-kaiseki", title: "Kaiseki dinner", jp: "懐石", kind: "food", dur: "2.5 hrs", tags: ["adults", "food", "traditional"], status: "optional", note: "Long, formal, expensive, extraordinary. Do not drag four teenagers through it — split the group.", votable: true }
      ]
    },
    food: ["gion-tempura", "gion-shabu", "gion-yakitori", "kaiseki"],
    notes: ["The biggest traditional day of the trip.", "Kaiseki is an adults-optional split, not a group dinner."]
  },

  /* --------------------------------------------------- 12 */
  {
    n: 12, city: "nara", title: "Nara deer, then Osaka", jp: "奈良・大阪へ",
    theme: "Half a day with a thousand deer",
    intent: "A better use of the transfer day than another temple town.",
    arriveBy: "seg-kyo-nara",
    blocks: {
      morning: [
        { id: "d12-checkout", title: "Check out & forward luggage to Osaka", kind: "transit", dur: "45 min", tags: ["everyone"], status: "planned" },
        { id: "d12-narapark", title: "Nara Park & the deer", jp: "奈良公園", kind: "experience", dur: "2 hrs", tags: ["everyone", "outdoor", "energy"], status: "planned", note: "Buy shika-senbei crackers. The deer bow. They also mug you. Both are true.", votable: true }
      ],
      afternoon: [
        { id: "d12-todaiji", title: "Tōdai-ji & the Great Buddha", jp: "東大寺", kind: "sight", dur: "1.5 hrs", tags: ["everyone", "traditional"], status: "planned", note: "One of the largest wooden buildings in the world, holding a 15-metre bronze Buddha." },
        { id: "d12-kasuga", title: "Kasuga Taisha", jp: "春日大社", kind: "sight", dur: "1 hr", tags: ["adults", "traditional"], status: "optional", note: "Three thousand stone and bronze lanterns.", votable: true },
        { id: "d12-toosaka", title: "Train on to Osaka & check in", kind: "transit", dur: "1.5 hrs", tags: ["everyone"], status: "reserve" }
      ],
      evening: [
        { id: "d12-umeda", title: "Umeda Sky Building", jp: "梅田スカイビル", kind: "sight", dur: "1.5 hrs", tags: ["everyone", "views"], status: "reserve", note: "Open-air floating garden observatory. Go at dusk and stay for the lights.", votable: true },
        { id: "d12-dinner", title: "Dinner in Umeda", kind: "food", dur: "1.5 hrs", tags: ["everyone", "food"], status: "planned", note: "Good candidate for the one nicer group dinner of the Osaka leg." }
      ]
    },
    food: ["nara-mochi", "umeda-yakiniku", "umeda-wagyu"],
    notes: ["Replaces the original Hōryū-ji stop — broader, and far more interesting to teenagers.", "If someone in the group specifically wants ancient Buddhist architecture, Hōryū-ji goes back on the table."]
  },

  /* --------------------------------------------------- 13 */
  {
    n: 13, city: "osaka", title: "Castle & Dōtonbori", jp: "大阪城・道頓堀",
    theme: "One castle, then an entire evening of eating",
    intent: "Dōtonbori isn't a sightseeing stop. It's the night.",
    highlight: true,
    blocks: {
      morning: [
        { id: "d13-castle", title: "Osaka Castle", jp: "大阪城", kind: "sight", dur: "2.5 hrs", tags: ["everyone", "traditional", "views"], status: "planned", note: "The grounds and moat are as good as the keep. The interior is a museum, not a historic interior." }
      ],
      afternoon: [
        { id: "d13-kimono", title: "Kimono rental", jp: "着物", kind: "experience", dur: "Half day", tags: ["everyone", "traditional"], status: "optional", note: "The Kyoto-or-Osaka choice — only do it once.", votable: true },
        { id: "d13-hozenji", title: "Hōzenji Yokochō", jp: "法善寺横丁", kind: "sight", dur: "30 min", tags: ["everyone", "traditional"], status: "planned", note: "Moss-covered statue, stone lane, one block from the neon. The contrast is the point." },
        { id: "d13-shinsaibashi", title: "Shinsaibashi & Amerikamura", jp: "心斎橋・アメ村", kind: "shopping", dur: "2.5 hrs", tags: ["teens", "shopping"], status: "planned", note: "Amerikamura is the streetwear/thrift quarter — a strong teen pick." }
      ],
      evening: [
        { id: "d13-cruise", title: "Tombori River Cruise", jp: "とんぼりリバークルーズ", kind: "experience", dur: "30 min", tags: ["everyone", "views", "relaxed"], status: "reserve", note: "Twenty minutes on the canal under all the signs. Cheap, and the best view of Dōtonbori there is.", votable: true },
        { id: "d13-dotonbori", title: "Dōtonbori food crawl", jp: "道頓堀", kind: "food", dur: "3 hrs", tags: ["everyone", "food", "nightlife", "energy"], status: "planned", note: "Buy small portions at many stalls and share everything. Do not sit down for one big meal.", votable: true }
      ]
    },
    food: ["osaka-takoyaki", "osaka-okonomiyaki", "osaka-kushikatsu", "osaka-cheesecake", "osaka-gyoza"],
    notes: ["Give Dōtonbori the whole evening. It's the single most Osaka thing on the list."]
  },

  /* --------------------------------------------------- 14 */
  {
    n: 14, city: "osaka", title: "Universal — or Osaka wide", jp: "選択日",
    theme: "Last full day, and a real choice",
    intent: "Super Nintendo World is the strongest teen pull of the trip. It's also a whole day.",
    split: true,
    tracks: [
      {
        id: "d14-usj", label: "Universal Studios Japan", jp: "ユニバーサル・スタジオ・ジャパン", tags: ["teens", "energy"],
        blurb: "Super Nintendo World, Wizarding World, Nintendo's Power-Up Band AR game.",
        items: [
          { id: "d14-usj", title: "Universal Studios Japan", kind: "experience", dur: "Full day", tags: ["energy"], status: "reserve", note: "Super Nintendo World may need a timed area ticket on top of park admission. Express Passes are separate again and sell out." }
        ]
      },
      {
        id: "d14-osaka", label: "Osaka wide", jp: "大阪めぐり", tags: ["everyone", "relaxed"],
        blurb: "Aquarium, retro Shinsekai, arcades and a slower last day.",
        items: [
          { id: "d14-kaiyukan", title: "Osaka Aquarium Kaiyūkan", jp: "海遊館", kind: "experience", dur: "3 hrs", tags: ["everyone"], status: "optional", note: "One of the largest aquariums in the world — whale sharks.", votable: true },
          { id: "d14-tempozan", title: "Tempōzan & the ferris wheel", kind: "sight", dur: "1 hr", tags: ["everyone", "views", "relaxed"], status: "optional" },
          { id: "d14-shinsekai", title: "Shinsekai & Tsūtenkaku", jp: "新世界・通天閣", kind: "sight", dur: "2 hrs", tags: ["everyone", "nightlife", "food"], status: "optional", note: "1950s Osaka preserved in neon. Kushikatsu headquarters.", votable: true },
          { id: "d14-round1", title: "Round1 Stadium", kind: "experience", dur: "2 hrs", tags: ["teens", "energy"], status: "optional", note: "Arcade, bowling, batting cages, karaoke — all in one building.", votable: true },
          { id: "d14-animalcafe", title: "Animal café", kind: "experience", dur: "1 hr", tags: ["teens", "relaxed"], status: "optional", votable: true }
        ]
      }
    ],
    blocks: {
      evening: [
        { id: "d14-regroup", title: "Everyone back together", kind: "food", dur: "3 hrs", tags: ["everyone", "food", "nightlife"], status: "planned", note: "Shinsekai or Dōtonbori, then karaoke. Last night — end it loud." }
      ]
    },
    food: ["shinsekai-kushikatsu", "osaka-yakisoba", "osaka-taiyaki"],
    notes: ["Both tracks converge for the final evening. Agree on the meeting point in the morning."]
  },

  /* --------------------------------------------------- 15 */
  {
    n: 15, city: "osaka", title: "Home", jp: "出発",
    theme: "Leave far more buffer than feels necessary",
    intent: "Nine people and an international check-in counter.",
    departBy: "seg-kix",
    blocks: {
      morning: [
        { id: "d15-checkout", title: "Check out", kind: "transit", dur: "1 hr", tags: ["everyone"], status: "planned" },
        { id: "d15-lastkonbini", title: "Final convenience store raid", kind: "food", dur: "30 min", tags: ["everyone", "food"], status: "planned", note: "Kit Kats. All of them." }
      ],
      afternoon: [
        { id: "d15-airport", title: "Transfer to Kansai International", kind: "transit", dur: "1.5 hrs", tags: ["everyone"], status: "reserve", note: "Haruka express, or a pre-booked van for 9 with luggage." },
        { id: "d15-fly", title: "Fly home", kind: "transit", dur: "—", tags: ["everyone"], status: "planned" }
      ]
    },
    food: [],
    notes: ["Be at KIX 3½ hours early. This is not the day to be clever."]
  }
];
