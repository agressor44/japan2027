/* =================== ITINERARY =================== */

function PageItinerary({ param }) {
  const S = useStore();
  if (param) return <DayDetail n={Number(param)} />;

  return (
    <div className="page">
      <PageHead
        eyebrow="Itinerary" jp="旅程"
        title="Fifteen days, still in pencil"
        lede="Two major experiences a day, room to wander in between. Every day below can move — nothing here is booked until the checklist says it is."
      />
      <DayStrip current={null} />
      <div className="rule" />
      {CITY_ORDER.map(function (cid) {
        const c = CITIES[cid];
        const dayList = DAYS.filter(function (d) { return d.city === cid; });
        if (!dayList.length) return null;
        return (
          <section key={cid} style={{ marginBottom: 42 }}>
            <SectionHead
              eyebrow={"Day " + dayList[0].n + (dayList.length > 1 ? "–" + dayList[dayList.length - 1].n : "")}
              title={<span>{c.name} <span className="jp" style={{ color: cityVar(cid), fontSize: 16 }}>{c.jp}</span></span>}
            />
            <p className="lede" style={{ marginBottom: 16, fontSize: 14 }}>{c.note}</p>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {dayList.map(function (d) {
                const dt = fmtDay(dayDate(S.anchor, d.n));
                const acts = allActivities(d);
                const reserve = acts.filter(function (a) { return S.statusOf(a.id, a.status) === "reserve"; }).length;
                return (
                  <a key={d.n} className="card" href={"#/itinerary/" + d.n} style={{ "--c": cityVar(cid), borderLeft: "3px solid " + cityVar(cid) }}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="eyebrow" style={{ color: cityVar(cid) }}>Day {d.n}</span>
                      <span className="eyebrow">{dt.wd} {dt.mo} {dt.d}</span>
                    </div>
                    <h3 className="display" style={{ fontSize: 19, margin: "9px 0 5px" }}>{d.title}</h3>
                    <p style={{ color: "var(--ink-2)", fontSize: 13.5 }}>{d.theme}</p>
                    <div className="act-foot">
                      {d.split ? <span className="tag who-split"><span className="kj">分</span>Splits</span> : null}
                      {d.startEarly ? <span className="tag"><span className="kj">朝</span>{d.startEarly}</span> : null}
                      {reserve ? <span className="pill warn">{reserve} to book</span> : null}
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function DayDetail({ n }) {
  const S = useStore();
  const d = dayByN(n);
  if (!d) return <div className="page"><div className="empty">No day {n}.</div></div>;
  const c = CITIES[d.city];
  const dt = fmtDay(dayDate(S.anchor, d.n));
  const arrive = d.arriveBy ? SEGMENTS.filter(function (s) { return s.id === d.arriveBy; })[0] : null;
  const depart = d.departBy ? SEGMENTS.filter(function (s) { return s.id === d.departBy; })[0] : null;
  const foods = (d.food || []).map(foodById).filter(Boolean);

  return (
    <div className="page">
      <DayStrip current={d.n} />

      <header className="dayhead fade" style={{ "--c": cityVar(d.city), marginTop: 18 }}>
        <Texture kind={c.pattern} />
        <div className="dayhead-top">
          <span className="dayhead-n">Day {d.n} of {TRIP.dayCount}</span>
          <span className="eyebrow">{dt.wd} · {dt.full}, 2027</span>
          <span className="eyebrow" style={{ color: cityVar(d.city) }}>{c.name}</span>
          {d.startEarly ? <span className="tentative">Early start {d.startEarly}</span> : null}
        </div>
        <h2>{d.title} <span className="jp">{d.jp}</span></h2>
        <p className="theme">{d.theme}</p>
        {d.intent ? <p className="intent">{d.intent}</p> : null}
      </header>

      {arrive ? <TransitCard seg={arrive} /> : null}

      {LANES.map(function (L) {
        return <Lane key={L.id} id={L.id} kj={L.kj} label={L.label} items={(d.blocks && d.blocks[L.id]) || []} cityId={d.city} />;
      })}

      {d.tracks ? <TrackPicker day={d} /> : null}

      {depart ? <TransitCard seg={depart} /> : null}

      {foods.length ? (
        <>
          <div className="rule" />
          <SectionHead eyebrow="Eat here" title="Food for the day" right={<a className="btn sm" href={"#/food/" + d.city}>All {c.name} food</a>} />
          <div className="foods">
            {foods.map(function (f) { return <FoodCard key={f.id} f={f} />; })}
          </div>
        </>
      ) : null}

      {d.notes && d.notes.length ? (
        <>
          <div className="rule" />
          <SectionHead eyebrow="Worth remembering" title="Notes" />
          <div className="callout">
            {d.notes.map(function (t, i) { return <div key={i}>{t}</div>; })}
          </div>
        </>
      ) : null}

      <div className="dayfoot">
        {d.n > 1 ? <a className="btn" href={"#/itinerary/" + (d.n - 1)}>← Day {d.n - 1}</a> : <span />}
        {d.n < TRIP.dayCount ? <a className="btn" href={"#/itinerary/" + (d.n + 1)}>Day {d.n + 1} →</a> : <span />}
      </div>
    </div>
  );
}

function TransitCard({ seg }) {
  return (
    <section className="card" style={{ marginTop: 26, borderStyle: "dashed" }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="eyebrow">{seg.from} → {seg.to}</div>
          <h3 className="display" style={{ fontSize: 20, marginTop: 6 }}>
            {seg.label} <span className="jp" style={{ fontSize: 14, color: "var(--ink-3)" }}>{seg.jp}</span>
          </h3>
        </div>
      </div>
      <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 8 }}>{seg.detail}</p>
      <ul style={{ margin: "12px 0 0", paddingLeft: 18, color: "var(--ink-2)", fontSize: 13.5 }}>
        {seg.todo.map(function (t, i) { return <li key={i} style={{ marginBottom: 3 }}>{t}</li>; })}
      </ul>
    </section>
  );
}

/* --- split days: who goes where --- */
function TrackPicker({ day }) {
  const S = useStore();
  const assigned = S.tracksFor(day.n);

  return (
    <>
      <div className="rule" />
      <SectionHead
        eyebrow="Split day"
        title="Two ways to spend it"
        right={<span className="eyebrow">Tap a face to move them</span>}
      />
      <div className="tracks">
        {day.tracks.map(function (tr) {
          const members = S.travelers.filter(function (t) { return assigned[t.id] === tr.id; });
          return (
            <div key={tr.id} className="track" style={{ "--c": cityVar(day.city) }}>
              <div className="track-head">
                <h3>{tr.label} <span className="jp">{tr.jp}</span></h3>
                <p>{tr.blurb}</p>
                <div className="act-foot">{(tr.tags || []).map(function (t) { return <Tag key={t} id={t} />; })}</div>
              </div>
              <div className="track-body">
                {tr.items.map(function (a) { return <ActivityCard key={a.id} a={a} cityId={day.city} />; })}
              </div>
              <div className="track-who">
                <span className="eyebrow">Going · {members.length}</span>
                <div className="avatars">
                  {members.length
                    ? members.map(function (t) {
                        return <Avatar key={t.id} t={t} title={t.name + " — tap to unassign"} onClick={function () { S.setTrack(day.n, t.id, ""); }} />;
                      })
                    : <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>Nobody yet</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <span className="eyebrow">Undecided</span>
        <div className="avatars" style={{ marginTop: 10 }}>
          {S.travelers.filter(function (t) { return !assigned[t.id]; }).map(function (t) {
            return (
              <span key={t.id} className="row" style={{ gap: 4, alignItems: "center", marginRight: 10 }}>
                <Avatar t={t} faded />
                <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{t.name}</span>
                {day.tracks.map(function (tr) {
                  return (
                    <button key={tr.id} className="btn sm" onClick={function () { S.setTrack(day.n, t.id, tr.id); }}>
                      {tr.label}
                    </button>
                  );
                })}
              </span>
            );
          })}
          {S.travelers.filter(function (t) { return !assigned[t.id]; }).length === 0
            ? <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>Everyone has picked a side.</span> : null}
        </div>
      </div>
    </>
  );
}
