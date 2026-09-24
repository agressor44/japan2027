/* =================== FOOD =================== */

function FoodCard({ f }) {
  return (
    <article className="food" style={{ "--c": cityVar(f.city === "all" ? "tokyo" : f.city) }}>
      <div className="food-jp">{f.jp}</div>
      <h4>{f.name}</h4>
      <div className="food-where">{FOOD_CATS[f.cat].glyph} {FOOD_CATS[f.cat].label} · {f.where}</div>
      {f.note ? <p className="food-note">{f.note}</p> : null}
      {(f.tags || []).length ? (
        <div className="act-foot">
          {f.tags.map(function (t) {
            return t === "group"
              ? <span key={t} className="tag"><span className="kj">九</span>Seats nine</span>
              : <Tag key={t} id={t} />;
          })}
        </div>
      ) : null}
      {f.link ? (
        <a className="lookup" href={f.link} target="_blank" rel="noopener noreferrer" style={{ marginTop: 4 }}>
          Browse &amp; book <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </article>
  );
}

function PageFood({ param }) {
  const [city, setCity] = useState(param || "all");
  const [cat, setCat] = useState("all");

  useEffect(function () { if (param) setCity(param); }, [param]);

  const list = FOOD.filter(function (f) {
    const cityOk = city === "all" || f.city === city || (city !== "all" && f.city === "all" && cat === "all");
    const catOk = cat === "all" || f.cat === cat;
    return cityOk && catOk;
  });

  const cities = [{ id: "all", name: "Everywhere" }].concat(CITY_ORDER.map(function (c) { return { id: c, name: CITIES[c].name }; }));

  return (
    <div className="page">
      <PageHead
        eyebrow="Food" jp="食"
        title="Eating is the itinerary"
        lede="Small portions, many stops, shared between nine. Sit-down meals are the exception, not the plan — and the convenience stores count."
      />

      <div className="filters">
        {cities.map(function (c) {
          return (
            <button key={c.id} className={"fb " + (city === c.id ? "on" : "")} onClick={function () { setCity(c.id); }}>
              {c.name}
            </button>
          );
        })}
      </div>
      <div className="filters">
        <button className={"fb " + (cat === "all" ? "on" : "")} onClick={function () { setCat("all"); }}>All kinds</button>
        {Object.keys(FOOD_CATS).map(function (k) {
          return (
            <button key={k} className={"fb " + (cat === k ? "on" : "")} onClick={function () { setCat(k); }}>
              {FOOD_CATS[k].glyph} {FOOD_CATS[k].label}
            </button>
          );
        })}
      </div>

      {list.length ? (
        <div className="foods">{list.map(function (f) { return <FoodCard key={f.id} f={f} />; })}</div>
      ) : <div className="empty">Nothing on the list for that combination yet.</div>}

      <div className="rule" />

      <SectionHead eyebrow="Three rules" title="How to eat as a group of nine" />
      <div className="callout">
        <div>Most restaurants in Japan physically cannot seat nine without notice. Either reserve, or split into threes.</div>
        <div>Markets and food streets — Tsukiji, Nishiki, Dōtonbori — solve the group problem entirely. Buy one of everything and pass it around.</div>
        <div>Keep exactly one properly nice dinner per city. Everything else should be cheap, fast and shared.</div>
      </div>

      <div className="rule" />

      <SectionHead eyebrow="Not optional" title="The three market crawls" />
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))" }}>
        {[
          { city: "tokyo", name: "Tsukiji Outer Market", jp: "築地場外市場", day: 3, note: "Tamagoyaki, grilled scallops, tuna, wagyu skewers, strawberry daifuku. Go before 10am and eat standing up." },
          { city: "kyoto", name: "Nishiki Market", jp: "錦市場", day: 8, note: "Five covered blocks. Dashimaki tamago, pickles, soy-milk doughnuts, matcha everything." },
          { city: "osaka", name: "Dōtonbori", jp: "道頓堀", day: 13, note: "Takoyaki, okonomiyaki, kushikatsu, cheesecake. Give it the whole evening." }
        ].map(function (m) {
          return (
            <a key={m.name} className="card" href={"#/itinerary/" + m.day} style={{ "--c": cityVar(m.city), borderTop: "2px solid " + cityVar(m.city) }}>
              <Texture kind={CITIES[m.city].pattern} />
              <div className="eyebrow" style={{ color: cityVar(m.city) }}>Day {m.day} · {CITIES[m.city].name}</div>
              <h3 className="display" style={{ fontSize: 20, margin: "8px 0 2px", position: "relative" }}>{m.name}</h3>
              <div className="jp" style={{ color: cityVar(m.city), fontSize: 13, position: "relative" }}>{m.jp}</div>
              <p style={{ color: "var(--ink-2)", fontSize: 13.5, marginTop: 9, position: "relative" }}>{m.note}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
