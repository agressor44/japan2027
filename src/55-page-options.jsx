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

  // Trip-wide decision summary (from the calendar dashboard).
  const summary = useMemo(function () {
    const c = { open: 0, contested: 0, decided: 0, fixed: 0 };
    DAYS.forEach(function (d) {
      const items = votablesForDay(d.n);
      if (!items.length) { c.fixed++; return; }
      const ranked = items.map(function (x) { return tallyVotes(S, x.id); });
      const totalCast = ranked.reduce(function (s, r) { return s + r.cast; }, 0);
      if (totalCast === 0) { c.open++; return; }
      const sorted = ranked.map(function (r) { return r.score; }).sort(function (a, b) { return b - a; });
      const lead = sorted[0] || 0, second = sorted[1] || 0;
      if (lead - second >= 3) c.decided++; else c.contested++;
    });
    return c;
  }, [S.plan.votes]);

  return (
    <div className="page">
      <PageHead
        eyebrow="Vote" jp="投票"
        title="What the group wants"
        lede="Every optional activity stays on the list even when something else wins its slot — nothing's deleted, it's ranked. Say In, Maybe or Pass, and the tallies are shared with everyone."
      />

      {/* --- decision dashboard: where each day stands --- */}
      <div className="calsum">
        <div className="calsum-cell st-decided"><b className="num">{summary.decided}</b><span>Front-runner</span></div>
        <div className="calsum-cell st-contested"><b className="num">{summary.contested}</b><span>Toss-up</span></div>
        <div className="calsum-cell st-open"><b className="num">{summary.open}</b><span>Needs votes</span></div>
        <div className="calsum-cell st-fixed"><b className="num">{summary.fixed}</b><span>Set</span></div>
      </div>
      <details className="daydash">
        <summary>See where each day stands →</summary>
        <div className="calgrid" style={{ marginTop: 14 }}>
          {DAYS.map(function (d) { return <DayCard key={d.n} day={d} />; })}
        </div>
      </details>

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
              <a className="lookup" href={lookupLink(o)} target="_blank" rel="noopener noreferrer">
                {o.link ? "Official site" : "Look it up"} <span aria-hidden="true">↗</span>
              </a>
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
              <a className="lookup" href={lookupLink(a)} target="_blank" rel="noopener noreferrer">
                {a.link ? "Official site" : "Look it up"} <span aria-hidden="true">↗</span>
              </a>
              <VoteBar itemId={a.id} />
            </article>
          );
        })}
      </div>
    </div>
  );
}
