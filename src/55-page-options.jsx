/* =================== VOTE / OPTIONAL ACTIVITIES =================== */

function PageOptions() {
  const S = useStore();
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState("day");

  const scored = useMemo(function () {
    return OPTIONS.map(function (o) {
      const v = S.votesFor(o.id);
      let yes = 0, maybe = 0, no = 0;
      Object.keys(v).forEach(function (k) {
        if (v[k] === "yes") yes++; else if (v[k] === "maybe") maybe++; else if (v[k] === "no") no++;
      });
      return Object.assign({}, o, { yes: yes, maybe: maybe, no: no, score: yes * 2 + maybe });
    });
  }, [S.plan.votes]);

  const list = scored
    .filter(function (o) { return city === "all" || o.city === city; })
    .sort(function (a, b) { return sort === "day" ? a.day - b.day : b.score - a.score; });

  const votableActs = useMemo(function () {
    return everyActivity().filter(function (a) { return a.votable; });
  }, []);

  return (
    <div className="page">
      <PageHead
        eyebrow="Vote" jp="投票"
        title="Nothing gets deleted, it gets ranked"
        lede="Every optional activity stays on this list even when something else wins the slot. Say In, Maybe or Pass — the tallies are shared with the whole group."
      />

      <div className="notice" style={{ marginBottom: 18 }}>
        Voting as <strong style={{ fontWeight: 500 }}>{(travelerById(S.me) || {}).name}</strong>. Fill in <a href="#/profile" style={{ color: "var(--indigo)", textDecoration: "underline" }}>your preferences</a> and these cards start showing who else each one suits.
      </div>

      <div className="filters">
        <button className={"fb " + (city === "all" ? "on" : "")} onClick={function () { setCity("all"); }}>Everywhere</button>
        {CITY_ORDER.map(function (c) {
          return <button key={c} className={"fb " + (city === c ? "on" : "")} onClick={function () { setCity(c); }}>{CITIES[c].name}</button>;
        })}
        <span style={{ flex: 1 }} />
        <button className={"fb " + (sort === "day" ? "on" : "")} onClick={function () { setSort("day"); }}>By day</button>
        <button className={"fb " + (sort === "score" ? "on" : "")} onClick={function () { setSort("score"); }}>Most wanted</button>
      </div>

      <div className="opts">
        {list.map(function (o) {
          return (
            <article key={o.id} className={"opt " + (o.cut ? "cut" : "")} style={{ "--c": cityVar(o.city) }}>
              <div className="opt-top">
                <h3>
                  {o.title}
                  {o.jp ? <span className="jp">{o.jp}</span> : null}
                </h3>
                <span className="opt-meta">{o.cost} · {o.time}</span>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <span className="eyebrow" style={{ color: cityVar(o.city) }}>Day {o.day} · {CITIES[o.city].name}</span>
                {o.cut ? <span className="pill off">Cut</span> : null}
              </div>
              <p className="opt-why">{o.why}</p>
              <div className="act-foot">{(o.tags || []).map(function (t) { return <Tag key={t} id={t} />; })}</div>
              <FitChips tags={o.tags} />
              <VoteBar itemId={o.id} />
            </article>
          );
        })}
      </div>

      <div className="rule" />

      <SectionHead
        eyebrow="Also up for a vote"
        title="Things already in the itinerary"
        right={<span className="eyebrow">{votableActs.length} items</span>}
      />
      <p className="lede" style={{ fontSize: 14, marginBottom: 16 }}>
        These are penciled into a day already, but they're still worth a temperature check — especially the ones that cost money or a whole morning.
      </p>
      <div className="opts">
        {votableActs.map(function (a) {
          return (
            <article key={a.id} className="opt" style={{ "--c": cityVar(a.city) }}>
              <div className="opt-top">
                <h3>{a.title}{a.jp ? <span className="jp">{a.jp}</span> : null}</h3>
                <span className="opt-meta">{a.dur}</span>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <a className="eyebrow" style={{ color: cityVar(a.city) }} href={"#/itinerary/" + a.day}>Day {a.day} · {CITIES[a.city].name} →</a>
                <StatusPill status={S.statusOf(a.id, a.status)} />
              </div>
              {a.note ? <p className="opt-why">{a.note}</p> : null}
              <VoteBar itemId={a.id} />
            </article>
          );
        })}
      </div>
    </div>
  );
}
