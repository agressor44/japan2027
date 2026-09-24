/* =================== OVERVIEW =================== */

function PageHome() {
  const S = useStore();
  const acts = useMemo(everyActivity, []);
  const days = daysUntil(S.anchor);

  const tally = useMemo(function () {
    const t = { "Not started": 0, "Researching": 0, "Booked": 0, "Paid": 0, "Complete": 0, "Skip": 0 };
    RESERVATIONS.forEach(function (r) { t[S.statusOf(r.id, "Not started")]++; });
    return t;
  }, [S.plan.status]);

  const locked = tally.Booked + tally.Paid + tally.Complete;
  const urgent = RESERVATIONS.filter(function (r) {
    const st = S.statusOf(r.id, "Not started");
    return (r.priority === "critical" || r.priority === "high") && (st === "Not started" || st === "Researching");
  });

  const needsVotes = useMemo(function () {
    return acts.filter(function (a) { return a.votable; })
      .map(function (a) { return { a: a, n: Object.keys(S.votesFor(a.id)).filter(function (k) { return S.votesFor(a.id)[k]; }).length }; })
      .sort(function (x, y) { return x.n - y.n; })
      .slice(0, 6);
  }, [acts, S.plan.votes]);

  const myPct = profileCompletion(S.plan.profiles[S.me]);
  const bdays = birthdaysDuringTrip(S.anchor, TRIP.dayCount);

  return (
    <div className="page">
      {/* ---------- hero ---------- */}
      <section className="hero fade">
        <Texture kind="kumiko" />
        <div className="hero-sun" aria-hidden="true" />
        <div className="hero-in">
          <div>
            <div className="hero-jp">日本<em>二〇二七</em></div>
            <h1>Japan 2027 · Family Trip</h1>
            <div className="hero-route">
              {CITY_ORDER.map(function (c, i) {
                return (
                  <Fragment key={c}>
                    {i > 0 ? <span>→</span> : null}
                    <b style={{ color: cityVar(c) }}>{CITIES[c].name}</b>
                  </Fragment>
                );
              })}
            </div>
            <div className="row" style={{ marginTop: 18 }}>
              {TRIP.datesFinal ? null : <span className="tentative">Dates tentative</span>}
              <span className="eyebrow" style={{ letterSpacing: ".1em" }}>{fmtRange(S.anchor, TRIP.dayCount)}</span>
            </div>
            <a className="occasion" href="#/crew">
              <span>🎓</span> Lucy's graduation trip
            </a>
          </div>
          <div className="count">
            <div className="count-n num">{days > 0 ? days : 0}</div>
            <div className="count-l">days out{days > 0 ? "" : " · in progress"}</div>
          </div>
        </div>
      </section>

      {/* ---------- stats ---------- */}
      <div className="stats" style={{ marginTop: 16 }}>
        <div className="stat"><b>{TRIP.dayCount}</b><span>Days</span></div>
        <div className="stat"><b>{TRIP.party.total}</b><span>Travelers</span></div>
        <div className="stat"><b>4</b><span>Cities</span></div>
        <div className="stat"><b>{acts.length}</b><span>Things on the list</span></div>
      </div>

      <div className="rule" />

      {/* ---------- booking state ---------- */}
      <SectionHead
        eyebrow="Where things stand"
        title="Booking progress"
        right={<a className="btn sm" href="#/booking">Open the checklist</a>}
      />
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 20 }}>
            <span className="num">{locked}</span> of <span className="num">{RESERVATIONS.length}</span> locked in
          </span>
          <span className="eyebrow">{tally["Not started"]} not started · {tally.Researching} researching</span>
        </div>
        <Progress segments={[
          { pct: 100 * (tally.Complete + tally.Paid) / RESERVATIONS.length, color: "var(--good)", label: "Paid / complete" },
          { pct: 100 * tally.Booked / RESERVATIONS.length, color: "var(--matcha)", label: "Booked" },
          { pct: 100 * tally.Researching / RESERVATIONS.length, color: "var(--warn)", label: "Researching" }
        ]} />
        {urgent.length ? (
          <div style={{ marginTop: 18 }}>
            <div className="eyebrow" style={{ marginBottom: 9 }}>Time-sensitive and still open</div>
            <div className="grid" style={{ gap: 7 }}>
              {urgent.slice(0, 5).map(function (r) {
                return (
                  <div key={r.id} className="row" style={{ justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--line-soft)", paddingBottom: 7 }}>
                    <span style={{ fontSize: 14 }}>{r.title}</span>
                    <span className="eyebrow" style={{ textTransform: "none", letterSpacing: ".04em" }}>{r.window}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : <p className="lede" style={{ marginTop: 14, fontSize: 14 }}>Nothing urgent is open. Nice.</p>}
      </div>

      {bdays.length ? (
        <div className="bdays">
          <span className="eyebrow">Falls inside these dates</span>
          {bdays.map(function (b) {
            const dt = fmtDay(b.iso);
            return (
              <a key={b.traveler.id} className="bday" href={"#/itinerary/" + b.day} style={{ "--c": b.traveler.color }}>
                <Avatar t={b.traveler} />
                <span><b>{b.traveler.short}'s birthday</b><em>{dt.mo} {dt.d} · day {b.day} in {CITIES[dayByN(b.day).city].name}</em></span>
              </a>
            );
          })}
        </div>
      ) : null}

      <div className="rule" />

      {/* ---------- votes wanted ---------- */}
      <SectionHead eyebrow="Group decisions" title="Waiting on votes" right={<a className="btn sm" href="#/options">All options</a>} />
      {myPct < 100 ? (
        <div className="notice" style={{ marginBottom: 14 }}>
          Your preference survey is {myPct}% filled in. <a href="#/profile" style={{ color: "var(--indigo)", textDecoration: "underline" }}>Finish it</a> — it's what teaches the site which days are a good fit for you.
        </div>
      ) : null}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
        {needsVotes.map(function (x) {
          return (
            <div key={x.a.id} className="card" style={{ "--c": cityVar(x.a.city) }}>
              <div className="eyebrow" style={{ color: cityVar(x.a.city) }}>Day {x.a.day} · {CITIES[x.a.city].name}</div>
              <h3 style={{ fontSize: 16.5, margin: "7px 0 0", fontWeight: 500 }}>{x.a.title}</h3>
              {x.a.note ? <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 7 }}>{x.a.note}</p> : null}
              <VoteBar itemId={x.a.id} />
            </div>
          );
        })}
      </div>

      <div className="rule" />

      {/* ---------- philosophy ---------- */}
      <SectionHead eyebrow="Ground rules" title="How this trip is supposed to feel" />
      <div className="callout">
        {TRIP.philosophy.map(function (p, i) { return <div key={i}>{p}</div>; })}
      </div>
    </div>
  );
}
