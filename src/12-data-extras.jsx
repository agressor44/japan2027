/* ===========================================================
   FOOD · RESERVATIONS · OPTIONAL ACTIVITIES
   =========================================================== */

const FOOD_CATS = {
  "must":       { label: "Must try",     glyph: "◎" },
  "street":     { label: "Street food",  glyph: "屋" },
  "market":     { label: "Market",       glyph: "市" },
  "restaurant": { label: "Sit-down",     glyph: "店" },
  "snack":      { label: "Snack",        glyph: "軽" },
  "dessert":    { label: "Dessert",      glyph: "甘" },
  "nice":       { label: "Nice dinner",  glyph: "宴" },
  "konbini":    { label: "Convenience store", glyph: "コ" }
};

const FOOD = [
  /* ---- Tokyo ---- */
  { id: "harajuku-crepe", city: "tokyo", name: "Harajuku crepe", jp: "クレープ", cat: "street", where: "Takeshita Street", tags: ["teens", "everyone"], note: "Absurd, enormous, and the single most Harajuku thing there is." },
  { id: "souffle-pancake", city: "tokyo", name: "Soufflé pancakes", jp: "スフレパンケーキ", cat: "dessert", where: "Shibuya / Harajuku", tags: ["teens"], note: "Expect a queue. Worth one." },
  { id: "taiyaki", city: "tokyo", name: "Taiyaki", jp: "たい焼き", cat: "snack", where: "Everywhere", tags: ["everyone"], note: "Fish-shaped, custard or red bean. Cheap and perfect." },
  { id: "tokyo-ramen", city: "tokyo", name: "Ramen", jp: "ラーメン", cat: "must", where: "Shibuya, Shinjuku, Akihabara", tags: ["everyone"], note: "Ticket-machine shops are fast and cheap but seat few — split into twos and threes." },
  { id: "tokyo-curry", city: "tokyo", name: "Japanese curry", jp: "カレー", cat: "restaurant", where: "Akihabara, Shinjuku", tags: ["teens", "everyone"], note: "The safest possible meal for a picky eater." },
  { id: "tokyo-yakitori", city: "tokyo", name: "Yakitori", jp: "焼き鳥", cat: "restaurant", where: "Omoide Yokochō, Shibuya", tags: ["adults"], note: "Skewer by skewer. Order in rounds." },
  { id: "tokyo-tonkatsu", city: "tokyo", name: "Tonkatsu", jp: "とんかつ", cat: "restaurant", where: "Shibuya, Akihabara", tags: ["everyone"] },
  { id: "tokyo-yakiniku", city: "tokyo", name: "Yakiniku", jp: "焼肉", cat: "nice", where: "Shibuya", tags: ["everyone", "group"], note: "Grill-your-own — the easiest great dinner for nine people." },
  { id: "akiba-ramen", city: "tokyo", name: "Akihabara ramen", jp: "ラーメン", cat: "must", where: "Akihabara", tags: ["teens"] },
  { id: "akiba-curry", city: "tokyo", name: "Akihabara curry", jp: "カレー", cat: "restaurant", where: "Akihabara", tags: ["teens"] },
  { id: "akiba-gyukatsu", city: "tokyo", name: "Gyūkatsu", jp: "牛かつ", cat: "must", where: "Akihabara", tags: ["everyone"], note: "Panko-fried beef you finish yourself on a hot stone." },
  { id: "tsukiji-tamago", city: "tokyo", name: "Tamagoyaki on a stick", jp: "玉子焼き", cat: "market", where: "Tsukiji Outer Market", tags: ["everyone"], note: "Warm, sweet, ¥100-ish. Start here." },
  { id: "tsukiji-tuna", city: "tokyo", name: "Tuna & scallops", jp: "マグロ・ホタテ", cat: "market", where: "Tsukiji Outer Market", tags: ["adults"], note: "Grilled scallops in the shell. Do not skip." },
  { id: "tsukiji-wagyu", city: "tokyo", name: "Wagyu skewers", jp: "和牛串", cat: "market", where: "Tsukiji Outer Market", tags: ["everyone"] },
  { id: "tsukiji-daifuku", city: "tokyo", name: "Strawberry daifuku", jp: "いちご大福", cat: "dessert", where: "Tsukiji Outer Market", tags: ["everyone"], note: "Whole strawberry, bean paste, mochi." },
  { id: "chanko", city: "tokyo", name: "Chanko-nabe", jp: "ちゃんこ鍋", cat: "nice", where: "Ryōgoku", tags: ["everyone", "group"], note: "The sumo stew, eaten in the sumo district. One pot, everyone shares." },

  /* ---- Kyoto ---- */
  { id: "nishiki-dashimaki", city: "kyoto", name: "Dashimaki tamago", jp: "だし巻き卵", cat: "market", where: "Nishiki Market", tags: ["everyone"] },
  { id: "nishiki-mochi", city: "kyoto", name: "Mochi & wagashi", jp: "和菓子", cat: "dessert", where: "Nishiki Market", tags: ["everyone"] },
  { id: "nishiki-matcha", city: "kyoto", name: "Matcha everything", jp: "抹茶", cat: "must", where: "Nishiki / Gion", tags: ["everyone"], note: "Soft serve, warabimochi, lattes. Kyoto's signature." },
  { id: "nishiki-donut", city: "kyoto", name: "Soy milk doughnuts", jp: "豆乳ドーナツ", cat: "snack", where: "Nishiki Market", tags: ["teens"] },
  { id: "nishiki-pickles", city: "kyoto", name: "Kyoto pickles", jp: "京漬物", cat: "market", where: "Nishiki Market", tags: ["adults"], note: "Free samples down the whole street." },
  { id: "arashiyama-soba", city: "kyoto", name: "Soba", jp: "そば", cat: "restaurant", where: "Arashiyama", tags: ["everyone"] },
  { id: "arashiyama-udon", city: "kyoto", name: "Udon", jp: "うどん", cat: "restaurant", where: "Arashiyama", tags: ["everyone"] },
  { id: "arashiyama-tofu", city: "kyoto", name: "Yudōfu tofu cuisine", jp: "湯豆腐", cat: "must", where: "Arashiyama", tags: ["adults"], note: "A Kyoto specialty and a temple-cuisine tradition." },
  { id: "arashiyama-matcha", city: "kyoto", name: "Matcha desserts", jp: "抹茶スイーツ", cat: "dessert", where: "Arashiyama", tags: ["everyone"] },
  { id: "arashiyama-softserve", city: "kyoto", name: "Soft serve", jp: "ソフトクリーム", cat: "dessert", where: "Arashiyama", tags: ["teens"] },
  { id: "arashiyama-taiyaki", city: "kyoto", name: "Taiyaki", jp: "たい焼き", cat: "snack", where: "Arashiyama shopping street", tags: ["everyone"] },
  { id: "gion-tempura", city: "kyoto", name: "Tempura", jp: "天ぷら", cat: "restaurant", where: "Gion / Higashiyama", tags: ["everyone"] },
  { id: "gion-shabu", city: "kyoto", name: "Shabu-shabu & sukiyaki", jp: "しゃぶしゃぶ", cat: "nice", where: "Gion", tags: ["everyone", "group"], note: "Another good nine-person format — one table, shared pots." },
  { id: "gion-yakitori", city: "kyoto", name: "Yakitori", jp: "焼き鳥", cat: "restaurant", where: "Pontochō", tags: ["adults"] },
  { id: "kaiseki", city: "kyoto", name: "Kaiseki", jp: "懐石料理", cat: "nice", where: "Gion", tags: ["adults"], note: "Multi-course, seasonal, two-plus hours. Adults who want it — not the whole group." },
  { id: "nara-mochi", city: "nara", name: "Yomogi mochi, pounded to order", jp: "よもぎ餅", cat: "street", where: "Nakatanidou, Nara", tags: ["everyone"], note: "They pound it at speed in the window. Worth standing and watching." },

  /* ---- Osaka ---- */
  { id: "osaka-takoyaki", city: "osaka", name: "Takoyaki", jp: "たこ焼き", cat: "must", where: "Dōtonbori", tags: ["everyone"], note: "Osaka's own. Molten inside — wait longer than you want to." },
  { id: "osaka-okonomiyaki", city: "osaka", name: "Okonomiyaki", jp: "お好み焼き", cat: "must", where: "Dōtonbori / Namba", tags: ["everyone", "group"] },
  { id: "osaka-kushikatsu", city: "osaka", name: "Kushikatsu", jp: "串カツ", cat: "must", where: "Dōtonbori", tags: ["everyone"], note: "One rule and only one: no double-dipping the communal sauce." },
  { id: "shinsekai-kushikatsu", city: "osaka", name: "Shinsekai kushikatsu", jp: "串カツ", cat: "restaurant", where: "Shinsekai", tags: ["everyone"], note: "The original neighborhood for it." },
  { id: "osaka-gyoza", city: "osaka", name: "Gyōza", jp: "餃子", cat: "street", where: "Dōtonbori", tags: ["everyone"] },
  { id: "osaka-yakisoba", city: "osaka", name: "Yakisoba", jp: "焼きそば", cat: "street", where: "Dōtonbori", tags: ["teens"] },
  { id: "osaka-cheesecake", city: "osaka", name: "Japanese cheesecake", jp: "チーズケーキ", cat: "dessert", where: "Dōtonbori", tags: ["everyone"], note: "Jiggly, warm, sold whole out of a window." },
  { id: "osaka-taiyaki", city: "osaka", name: "Taiyaki & dessert stalls", jp: "たい焼き", cat: "dessert", where: "Dōtonbori", tags: ["teens"] },
  { id: "umeda-yakiniku", city: "osaka", name: "Yakiniku", jp: "焼肉", cat: "nice", where: "Umeda", tags: ["everyone", "group"] },
  { id: "umeda-wagyu", city: "osaka", name: "Wagyu & shabu-shabu", jp: "和牛", cat: "nice", where: "Umeda", tags: ["adults", "group"], note: "The candidate for the one properly nice group dinner." },

  /* ---- Everywhere ---- */
  { id: "konbini-onigiri", city: "all", name: "Onigiri", jp: "おにぎり", cat: "konbini", where: "7-Eleven / Lawson / FamilyMart", tags: ["everyone"], note: "Tuna mayo is the gateway. ¥150." },
  { id: "konbini-egg", city: "all", name: "Egg salad sandwich", jp: "たまごサンド", cat: "konbini", where: "Any konbini", tags: ["everyone"], note: "Improbably famous. Deservedly." },
  { id: "konbini-chicken", city: "all", name: "Famichiki / karaage-kun", jp: "ファミチキ", cat: "konbini", where: "FamilyMart / Lawson", tags: ["teens"] },
  { id: "konbini-dessert", city: "all", name: "Konbini desserts & seasonal drinks", jp: "コンビニスイーツ", cat: "konbini", where: "Any konbini", tags: ["everyone"], note: "Rotates constantly. Buy the weird one." }
];

/* ---------- Reservations & booking checklist ---------- */
const RES_STATUSES = ["Not started", "Researching", "Booked", "Paid", "Complete", "Skip"];

const RESERVATIONS = [
  { id: "r-hotels", title: "Hotels — Tokyo, Kyoto, Osaka", city: "all", day: null, priority: "critical", window: "9–12 months out", note: "Nine people is 3–4 rooms per city. Book before anything else." },
  { id: "r-flights", title: "International flights ×9", city: "all", day: null, priority: "critical", window: "10–11 months out", note: "Decide HND vs NRT in, KIX out. Open-jaw saves a day." },
  { id: "r-shink", title: "Shinkansen Tokyo → Kyoto ×9", city: "tokyo", day: 8, priority: "critical", window: "1 month out (opens 30 days prior)", note: "Reserved seats together. Ask for the Fuji side." },
  { id: "r-teamlab", title: "teamLab Borderless", city: "tokyo", day: 6, priority: "critical", window: "Tickets drop monthly — set a reminder", note: "The most likely thing to sell out before you book it." },
  { id: "r-disneysea", title: "Tokyo DisneySea ×N", city: "tokyo", day: 3, priority: "high", window: "~2 months out", note: "Date-specific. Confirm headcount first." },
  { id: "r-disneyland", title: "Tokyo Disneyland (if chosen)", city: "tokyo", day: 4, priority: "medium", window: "~2 months out", note: "Only if day 3 leaves people wanting more." },
  { id: "r-shibuyasky", title: "Shibuya Sky sunset slot ×9", city: "tokyo", day: 2, priority: "high", window: "4 weeks out", note: "Sunset slots go first." },
  { id: "r-skytree", title: "Tokyo Skytree timed entry", city: "tokyo", day: 5, priority: "medium", window: "2–4 weeks out" },
  { id: "r-sumo", title: "Sumo — tournament or show", city: "tokyo", day: 7, priority: "high", window: "As soon as dates lock", note: "Check whether the May Grand Tournament overlaps. Tournament tickets sell out in minutes." },
  { id: "r-chanko", title: "Chanko-nabe dinner for 9", city: "tokyo", day: 7, priority: "medium", window: "2–4 weeks out" },
  { id: "r-ghibli", title: "Ghibli Museum lottery", city: "tokyo", day: 4, priority: "medium", window: "Monthly lottery, months ahead", note: "Nine together is a long shot. Decide who enters." },
  { id: "r-karaoke", title: "Private karaoke room for 9", city: "tokyo", day: 4, priority: "low", window: "Same week / walk-in" },
  { id: "r-luggage1", title: "Luggage forwarding Tokyo → Kyoto", city: "tokyo", day: 7, priority: "medium", window: "Hotel front desk, day before", note: "Yamato takuhaibin. Next-day delivery." },
  { id: "r-cooking", title: "Kyoto cooking class (private, 9)", city: "kyoto", day: 8, priority: "high", window: "2–3 months out", note: "Public classes rarely seat nine — ask for a private booking." },
  { id: "r-hozugawa", title: "Hozugawa river boat ×9", city: "kyoto", day: 9, priority: "high", window: "1–2 months out", note: "Weather-dependent. Have a backup plan." },
  { id: "r-foodtour", title: "Kyoto food tour ×9", city: "kyoto", day: 10, priority: "medium", window: "1–2 months out" },
  { id: "r-sagano", title: "Sagano scenic railway", city: "kyoto", day: 10, priority: "low", window: "1 month out", note: "Only if it wins the day-10 vote." },
  { id: "r-samurai", title: "Samurai / ninja experience ×9", city: "kyoto", day: 11, priority: "high", window: "1–2 months out" },
  { id: "r-kaiseki", title: "Kaiseki for the adults", city: "kyoto", day: 11, priority: "low", window: "1–2 months out", note: "Adults-only split. Confirm the headcount first." },
  { id: "r-luggage2", title: "Luggage forwarding Kyoto → Osaka", city: "kyoto", day: 12, priority: "medium", window: "Hotel front desk, day before" },
  { id: "r-umeda", title: "Umeda Sky Building", city: "osaka", day: 12, priority: "low", window: "Walk-up usually fine" },
  { id: "r-tombori", title: "Tombori River Cruise ×9", city: "osaka", day: 13, priority: "medium", window: "1–2 weeks out" },
  { id: "r-usj", title: "Universal Studios Japan ×N", city: "osaka", day: 14, priority: "high", window: "2–3 months out", note: "Park ticket + Super Nintendo World timed entry + Express Pass are three separate purchases." },
  { id: "r-groupdinners", title: "Restaurants that seat 9", city: "all", day: null, priority: "medium", window: "Rolling", note: "Most Japanese restaurants cannot take nine without notice. Book the ones that matter." },
  { id: "r-airport", title: "Osaka → KIX transfer for 9 + bags", city: "osaka", day: 15, priority: "high", window: "1 month out" },
  { id: "r-esim", title: "eSIMs / pocket wifi ×9", city: "all", day: null, priority: "medium", window: "2 weeks out", note: "Nine people who will absolutely split up need their own data." },
  { id: "r-ic", title: "Suica / ICOCA cards ×9", city: "all", day: 1, priority: "medium", window: "Before departure", note: "Welcome Suica or Apple Wallet Suica avoids nine people at one machine." }
];

/* ---------- Optional activities pool ----------
   Kept rather than deleted when something else wins. --------- */
const OPTIONS = [
  { id: "o-disneysea", title: "Tokyo DisneySea", jp: "ディズニーシー", city: "tokyo", day: 3, tags: ["teens", "energy"], why: "The only DisneySea in the world. If you do one park, do this one.", cost: "¥¥¥", time: "Full day", link: "https://www.tokyodisneyresort.jp/en/tds/" },
  { id: "o-disneyland", title: "Tokyo Disneyland", jp: "ディズニーランド", city: "tokyo", day: 4, tags: ["teens", "energy"], why: "Familiar, but very well executed. Competes with a whole free Tokyo day.", cost: "¥¥¥", time: "Full day", link: "https://www.tokyodisneyresort.jp/en/tdl/" },
  { id: "o-ghibli", title: "Ghibli Museum", jp: "ジブリ美術館", city: "tokyo", day: 4, tags: ["everyone", "traditional"], why: "Small, strange, wonderful. Getting nine tickets is the hard part.", cost: "¥", time: "3 hrs", link: "https://www.ghibli-museum.jp/en/" },
  { id: "o-joypolis", title: "Tokyo Joypolis", city: "tokyo", day: 4, tags: ["teens", "energy", "anime"], why: "Indoor Sega theme park in Odaiba. Pure teen fuel.", cost: "¥¥", time: "3 hrs", link: "https://tokyo-joypolis.com/language/en/" },
  { id: "o-gundam", title: "Unicorn Gundam at DiverCity", jp: "ユニコーンガンダム", city: "tokyo", day: 4, tags: ["teens", "anime"], why: "Life-size, and it transforms on a schedule.", cost: "Free", time: "1 hr" },
  { id: "o-maid", title: "Maid café", city: "tokyo", day: 5, tags: ["teens", "anime"], why: "Either the funniest hour of the trip or a hard no.", cost: "¥¥", time: "1 hr" },
  { id: "o-karaoke", title: "Private-room karaoke", jp: "カラオケ", city: "tokyo", day: 4, tags: ["everyone", "energy"], why: "One room fits all nine. Cheapest great memory available.", cost: "¥", time: "2 hrs" },
  { id: "o-tokyotower", title: "Tokyo Tower", city: "tokyo", day: 6, tags: ["everyone", "views"], why: "Competes with Shibuya Sky and Skytree. Three towers is two too many.", cost: "¥¥", time: "1 hr", link: "https://www.tokyotower.co.jp/en/" },
  { id: "o-monkey", title: "Iwatayama Monkey Park", city: "kyoto", day: 9, tags: ["teens", "outdoor"], why: "A real climb, wild macaques, and the best view over Kyoto.", cost: "¥", time: "1.5 hrs", link: "https://www.monkeypark.jp/english/" },
  { id: "o-sagano", title: "Sagano scenic railway", city: "kyoto", day: 9, tags: ["everyone", "relaxed"], why: "Open-sided train through the gorge. Reserve ahead.", cost: "¥", time: "1 hr", link: "https://www.sagano-kanko.co.jp/en/" },
  { id: "o-tea", title: "Tea ceremony", jp: "茶道", city: "kyoto", day: 9, tags: ["adults", "traditional"], why: "Quiet, formal, and genuinely different from everything else on the trip.", cost: "¥¥", time: "1 hr" },
  { id: "o-kimono", title: "Kimono rental", jp: "着物", city: "kyoto", day: 9, tags: ["everyone", "traditional"], why: "Kyoto or Osaka — pick one. Kyoto has the better backdrops.", cost: "¥¥", time: "Half day" },
  { id: "o-onsen", title: "Onsen or foot bath", jp: "温泉", city: "kyoto", day: 8, tags: ["adults", "relaxed"], why: "After the river day. Check tattoo policies per facility.", cost: "¥", time: "1.5 hrs" },
  { id: "o-kasuga", title: "Kasuga Taisha", city: "nara", day: 11, tags: ["adults", "traditional"], why: "Three thousand lanterns. Adds an hour to the Nara stop.", cost: "¥", time: "1 hr", link: "https://www.kasugataisha.or.jp/en/" },
  { id: "o-horyuji", title: "Hōryū-ji", jp: "法隆寺", city: "nara", day: 11, tags: ["adults", "traditional"], why: "The oldest wooden buildings on earth. Cut in favour of Nara Park — back on the table if someone wants it.", cost: "¥", time: "2 hrs", cut: true, link: "https://www.horyuji.or.jp/en/" },
  { id: "o-usj", title: "Universal Studios Japan", city: "osaka", day: 13, tags: ["teens", "energy"], why: "Super Nintendo World. One of the strongest single pulls of the trip.", cost: "¥¥¥", time: "Full day", link: "https://www.usj.co.jp/web/en/us" },
  { id: "o-kaiyukan", title: "Osaka Aquarium Kaiyūkan", city: "osaka", day: 13, tags: ["everyone"], why: "Whale sharks. One of the largest aquariums anywhere.", cost: "¥¥", time: "3 hrs", link: "https://www.kaiyukan.com/language/eng/" },
  { id: "o-round1", title: "Round1 Stadium", city: "osaka", day: 13, tags: ["teens", "energy"], why: "Arcade, bowling, batting cages and karaoke stacked in one building.", cost: "¥¥", time: "2 hrs" },
  { id: "o-animalcafe", title: "Animal café", city: "osaka", day: 13, tags: ["teens", "relaxed"], why: "Cats, hedgehogs, owls — quality varies wildly. Research the specific one.", cost: "¥", time: "1 hr" },
  { id: "o-shinsekai", title: "Shinsekai & Tsūtenkaku", city: "osaka", day: 13, tags: ["everyone", "nightlife"], why: "1950s Osaka, preserved in neon and deep-fried skewers.", cost: "¥", time: "2 hrs", link: "https://www.tsutenkaku.co.jp/" },

  /* ---- more Tokyo options ---- */
  { id: "o-mario", title: "Go-kart street tour", jp: "公道カート", city: "tokyo", day: 4, tags: ["teens", "energy"], why: "Drive tiny karts through real Tokyo streets in costume. Needs an international driving permit for drivers.", cost: "¥¥", time: "2 hrs" },
  { id: "o-sumo-morning", title: "Morning sumo stable practice", jp: "朝稽古", city: "tokyo", day: 6, tags: ["adults", "traditional"], why: "Watch wrestlers train up close at a stable. Early, quiet, and unforgettable — book through a guide.", cost: "¥¥", time: "2 hrs" },
  { id: "o-teamlab-planets", title: "teamLab Planets", jp: "チームラボプラネッツ", city: "tokyo", day: 5, tags: ["everyone", "anime", "energy"], why: "The barefoot, wade-through-water sister to Borderless. Toyosu. A different show, if Borderless sells out.", cost: "¥¥", time: "2 hrs", link: "https://www.teamlab.art/e/planets/" },
  { id: "o-kart-nope", title: "Nintendo Tokyo & Pokémon Center", jp: "任天堂・ポケモン", city: "tokyo", day: 2, tags: ["everyone", "anime", "shopping"], why: "The flagship character stores in Shibuya PARCO — worth budgeting real time and yen.", cost: "¥¥", time: "2 hrs" },
  { id: "o-golden-gai", title: "Golden Gai bar alley walk", jp: "ゴールデン街", city: "tokyo", day: 5, tags: ["adults", "nightlife"], why: "A warren of tiny six-seat bars in Shinjuku. Adults-only wander after the kids are back.", cost: "¥", time: "1.5 hrs" },
  { id: "o-harajuku-owl", title: "Kawaii Monster / themed café", city: "tokyo", day: 2, tags: ["everyone", "food"], why: "Harajuku's over-the-top themed cafés. Peak sensory Tokyo — love it or hate it.", cost: "¥¥", time: "1 hr" },

  /* ---- more Kyoto options ---- */
  { id: "o-nijo", title: "Nijō Castle", jp: "二条城", city: "kyoto", day: 10, tags: ["everyone", "traditional"], why: "Shogun's palace with 'nightingale' floors that chirp to foil intruders. Real castle, real history.", cost: "¥", time: "1.5 hrs" },
  { id: "o-kinkakuji", title: "Kinkaku-ji (Golden Pavilion)", jp: "金閣寺", city: "kyoto", day: 9, tags: ["everyone", "traditional", "views"], why: "The gold temple over the pond. The postcard shot of Kyoto — busy, but iconic for a reason.", cost: "¥", time: "1 hr" },
  { id: "o-gion-geisha", title: "Gion evening walking tour", city: "kyoto", day: 7, tags: ["adults", "traditional"], why: "A guided dusk walk through the geisha district, with the etiquette explained so you don't intrude.", cost: "¥¥", time: "2 hrs" },
  { id: "o-nishiki-tour", title: "Nishiki Market food tour", jp: "錦市場", city: "kyoto", day: 7, tags: ["everyone", "food"], why: "Guided grazing so nine people actually know what they're eating. Solves the group-in-a-market problem.", cost: "¥¥", time: "2.5 hrs" },
  { id: "o-manga-museum", title: "Kyoto International Manga Museum", jp: "京都国際マンガミュージアム", city: "kyoto", day: 10, tags: ["everyone", "anime", "relaxed"], why: "Former school stuffed with 300,000 manga you can pull off the wall and read. A rainy-day winner.", cost: "¥", time: "2 hrs", link: "https://www.kyotomm.jp/en/" },

  /* ---- more Osaka / Nara options ---- */
  { id: "o-usj-express", title: "USJ Express Pass", city: "osaka", day: 13, tags: ["everyone", "energy"], why: "Skip-the-line pass for Universal. Pricey but turns a 12-hour park day into a sane one for a big group.", cost: "¥¥¥", time: "add-on", link: "https://www.usj.co.jp/web/en/us/ticket-pass/express-pass" },
  { id: "o-namba-yasaka", title: "Namba Yasaka Shrine", jp: "難波八阪神社", city: "osaka", day: 12, tags: ["everyone", "traditional", "views"], why: "The giant lion-head stage. A quick, striking photo stop between Dōtonbori runs.", cost: "Free", time: "30 min" },
  { id: "o-cupnoodle", title: "Cup Noodles Museum", jp: "カップヌードルミュージアム", city: "osaka", day: 12, tags: ["everyone", "relaxed"], why: "Design your own cup noodle in Ikeda. Genuinely fun for the whole group, and cheap.", cost: "¥", time: "2 hrs", link: "https://www.cupnoodles-museum.jp/en/osaka_ikeda/" },
  { id: "o-spa-world", title: "Spa World", jp: "スパワールド", city: "osaka", day: 13, tags: ["everyone", "relaxed"], why: "Giant themed bathhouse near Shinsekai — floors of baths from around the world, plus pools. Family-friendly.", cost: "¥¥", time: "3 hrs" },
  { id: "o-nara-mochi", title: "Nakatanidō mochi pounding", jp: "中谷堂", city: "nara", day: 11, tags: ["everyone", "food"], why: "Watch them pound mochi at absurd speed, then eat it warm. A two-minute show worth planning around.", cost: "¥", time: "30 min" },
  { id: "o-nara-naramachi", title: "Naramachi old town", jp: "ならまち", city: "nara", day: 11, tags: ["adults", "traditional", "relaxed"], why: "Lattice-front merchant houses and quiet cafés — a calmer counterpoint to the deer crowds.", cost: "Free", time: "1.5 hrs" }
];
