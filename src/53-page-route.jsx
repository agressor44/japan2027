/* =================== ROUTE =================== */

const NODES = {
  tokyo: { x: 826, y: 74,  label: "Tokyo",  jp: "東京", nights: 7 },
  kyoto: { x: 300, y: 96,  label: "Kyoto",  jp: "京都", nights: 4 },
  nara:  { x: 372, y: 186, label: "Nara",   jp: "奈良", nights: 0 },
  osaka: { x: 146, y: 148, label: "Osaka",  jp: "大阪", nights: 3 }
};

const LEGS = [
  { from: "tokyo", to: "kyoto", label: "Tōkaidō Shinkansen", time: "2h15m", thick: true },
  { from: "kyoto", to: "nara", label: "Kintetsu", time: "45m" },
  { from: "nara", to: "osaka", label: "Local", time: "45m" }
];

const CLUSTERS = [
  { city: "tokyo", name: "Shibuya · Harajuku", jp: "渋谷・原宿", items: ["Shibuya Crossing & Hachikō", "PARCO — Nintendo, Pokémon, Capcom, Jump", "Meiji Jingū", "Takeshita St & Cat St", "Shibuya Sky at sunset"] },
  { city: "tokyo", name: "Akihabara · Ueno", jp: "秋葉原", items: ["Super Potato retro games", "Animate & Mandarake", "Gachapon halls", "Arcades", "Maid café (optional)"] },
  { city: "tokyo", name: "Marunouchi · Ginza", jp: "丸の内・銀座", items: ["Imperial Palace East Gardens", "Tokyo Station Character Street", "Tsukiji Outer Market", "Pokémon Center Tokyo DX"] },
  { city: "tokyo", name: "Azabudai · Shinjuku", jp: "麻布台・新宿", items: ["teamLab Borderless", "Tokyo Tower & Zōjō-ji", "Kabukichō & the Godzilla head", "Omoide Yokochō"] },
  { city: "tokyo", name: "Sumida · Ryōgoku", jp: "墨田・両国", items: ["Tokyo Skytree", "Solamachi & Pokémon Center", "Sumo district", "Chanko-nabe"] },
  { city: "kyoto", name: "Central Kyoto", jp: "中京", items: ["Nishiki Market", "Teramachi & Shinkyōgoku arcades", "Cooking class", "Pontochō"] },
  { city: "kyoto", name: "Higashiyama · Gion", jp: "東山・祇園", items: ["Yasaka Shrine", "Hanamikōji", "Kiyomizu-dera", "Sannenzaka & Ninenzaka"] },
  { city: "kyoto", name: "Arashiyama · Kameoka", jp: "嵐山・亀岡", items: ["Hozugawa river boat", "Bamboo Grove", "Tenryū-ji", "Togetsukyō Bridge", "Monkey Park"] },
  { city: "kyoto", name: "Fushimi", jp: "伏見", items: ["Fushimi Inari Taisha", "The torii tunnel to Yotsutsuji"] },
  { city: "nara", name: "Nara Park", jp: "奈良公園", items: ["The deer", "Tōdai-ji & the Great Buddha", "Kasuga Taisha (optional)"] },
  { city: "osaka", name: "Minami · Namba", jp: "ミナミ・難波", items: ["Dōtonbori food crawl", "Tombori River Cruise", "Hōzenji Yokochō", "Shinsaibashi & Amerikamura"] },
  { city: "osaka", name: "Kita · Umeda", jp: "キタ・梅田", items: ["Umeda Sky Building", "Nicer group dinner"] },
  { city: "osaka", name: "Bay · Shinsekai", jp: "湾岸・新世界", items: ["Universal Studios Japan", "Kaiyūkan aquarium", "Tsūtenkaku", "Kushikatsu"] }
];

function PageRoute() {
  const S = useStore();
  return (
    <div className="page">
      <PageHead
        eyebrow="Route" jp="経路"
        title="One line down the Tōkaidō"
        lede="Three bases, one day trip, and about three and a half hours of actual train time across the whole fortnight."
      />

      <div className="mapwrap">
        <Texture kind="seigaiha" />
        <svg className="mapsvg" viewBox="0 0 900 250" role="img" aria-label="Route from Tokyo to Kyoto to Nara to Osaka">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-3)" />
            </marker>
          </defs>

          {LEGS.map(function (leg) {
            const a = NODES[leg.from], b = NODES[leg.to];
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 26;
            return (
              <g key={leg.from + leg.to}>
                <path
                  d={"M" + a.x + " " + a.y + " Q " + mx + " " + my + " " + b.x + " " + b.y}
                  fill="none" stroke="var(--ink-3)"
                  strokeWidth={leg.thick ? 2.5 : 1.5}
                  strokeDasharray={leg.thick ? "none" : "5 4"}
                  markerEnd="url(#arrow)" opacity=".55"
                />
                <text x={mx} y={my + 6} textAnchor="middle" fill="var(--ink-3)" fontFamily="var(--mono)" fontSize="11" letterSpacing="1">
                  {leg.time}
                </text>
                <text x={mx} y={my + 21} textAnchor="middle" fill="var(--ink-3)" fontFamily="var(--sans)" fontSize="11" opacity=".8">
                  {leg.label}
                </text>
              </g>
            );
          })}

          {CITY_ORDER.map(function (cid) {
            const nd = NODES[cid];
            const c = CITIES[cid];
            const right = cid === "tokyo";
            return (
              <g key={cid} style={{ cursor: "pointer" }} onClick={function () { go("/itinerary/" + c.days[0]); }}>
                <circle cx={nd.x} cy={nd.y} r="22" fill={cityVar(cid)} opacity=".13" />
                <circle cx={nd.x} cy={nd.y} r="7" fill={cityVar(cid)} />
                <text x={nd.x + (right ? -14 : 16)} y={nd.y - 4} textAnchor={right ? "end" : "start"}
                      fill="var(--ink)" fontFamily="var(--serif)" fontSize="21">{nd.label}</text>
                <text x={nd.x + (right ? -14 : 16)} y={nd.y + 13} textAnchor={right ? "end" : "start"}
                      fill={cityVar(cid)} fontFamily="var(--serif)" fontSize="13" letterSpacing="2">{nd.jp}</text>
                <text x={nd.x + (right ? -14 : 16)} y={nd.y + 29} textAnchor={right ? "end" : "start"}
                      fill="var(--ink-3)" fontFamily="var(--mono)" fontSize="10" letterSpacing="1.4">
                  {nd.nights ? nd.nights + " NIGHTS" : "DAY TRIP"}
                </text>
              </g>
            );
          })}

          <text x="880" y="228" textAnchor="end" fill="var(--ink-3)" fontFamily="var(--mono)" fontSize="10" letterSpacing="2.5">
            ← WEST · EAST →
          </text>
        </svg>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", marginTop: 16 }}>
        {SEGMENTS.map(function (s) {
          return (
            <div key={s.id} className="card">
              <div className="eyebrow">{s.from} → {s.to}</div>
              <h3 className="display" style={{ fontSize: 17, margin: "7px 0 4px" }}>{s.label}</h3>
              <p style={{ fontSize: 13, color: "var(--ink-2)" }}>{s.detail}</p>
              <ul style={{ margin: "10px 0 0", paddingLeft: 16, fontSize: 12.5, color: "var(--ink-3)" }}>
                {s.todo.map(function (t, i) { return <li key={i}>{t}</li>; })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="rule" />

      <SectionHead eyebrow="Within each city" title="Where things actually cluster" />
      <p className="lede" style={{ marginBottom: 18, fontSize: 14 }}>
        Days are built around neighbourhoods, not individual sights. Each block below is walkable end to end.
      </p>

      {CITY_ORDER.map(function (cid) {
        const list = CLUSTERS.filter(function (c) { return c.city === cid; });
        if (!list.length) return null;
        return (
          <section key={cid} style={{ marginBottom: 26 }}>
            <h3 className="display" style={{ fontSize: 19, marginBottom: 12 }}>
              {CITIES[cid].name} <span className="jp" style={{ color: cityVar(cid), fontSize: 14 }}>{CITIES[cid].jp}</span>
            </h3>
            <div className="clusters">
              {list.map(function (cl) {
                return (
                  <div key={cl.name} className="cluster" style={{ "--c": cityVar(cid) }}>
                    <h3>{cl.name} <span className="jp">{cl.jp}</span></h3>
                    <ul>{cl.items.map(function (it, i) { return <li key={i}>{it}</li>; })}</ul>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
