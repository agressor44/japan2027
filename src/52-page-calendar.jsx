/* =================== CALENDAR =================== */

function PageCalendar() {
  const S = useStore();
  const anchor = S.anchor;
  const end = dayDate(anchor, TRIP.dayCount);

  // map ISO date -> day object
  const byDate = useMemo(function () {
    const m = {};
    DAYS.forEach(function (d) { m[dayDate(anchor, d.n)] = d; });
    return m;
  }, [anchor]);

  const months = useMemo(function () {
    const a = parseISO(anchor), b = parseISO(end);
    const list = [];
    let y = a.getUTCFullYear(), m = a.getUTCMonth();
    for (let i = 0; i < 4; i++) {
      list.push({ y: y, m: m });
      if (y === b.getUTCFullYear() && m === b.getUTCMonth() && list.length >= 2) break;
      m++; if (m > 11) { m = 0; y++; }
    }
    return list;
  }, [anchor, end]);

  function nudge(n) { S.setAnchor(addDays(anchor, n)); }

  return (
    <div className="page">
      <PageHead
        eyebrow="Calendar" jp="暦"
        title="A window, not a decision"
        lede="The whole itinerary hangs off one tentative start date. Slide it and every day, every booking window and every countdown moves with it. Day-level events become clickable here once the dates are real."
      />

      <div className="calbar">
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="eyebrow">Current window</div>
          <div className="calbar-main">{fmtRange(anchor, TRIP.dayCount)}</div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Slide the window</div>
          <div className="nudge">
            <button onClick={function () { nudge(-7); }} title="One week earlier">−7d</button>
            <button onClick={function () { nudge(-1); }}>−1d</button>
            <button onClick={function () { nudge(1); }}>+1d</button>
            <button onClick={function () { nudge(7); }} title="One week later">+7d</button>
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Day 1 lands on</div>
          <input
            id="anchor-date" className="field" type="date" value={anchor}
            min="2027-01-01" max="2027-12-18"
            onChange={function (e) { if (e.target.value) S.setAnchor(e.target.value); }}
            style={{ width: 160, fontFamily: "var(--mono)" }}
          />
        </div>
        {anchor !== TRIP.defaultAnchor ? (
          <button className="btn sm" onClick={function () { S.setAnchor(TRIP.defaultAnchor); }}>Reset</button>
        ) : null}
      </div>

      <div className="notice" style={{ marginTop: 12 }}>
        <strong style={{ fontWeight: 500 }}>Tentative.</strong> Late May into early June sits after Golden Week and before the rainy season really settles in — good weather, lower crowds than cherry-blossom season. Check the sumo tournament dates before locking anything.
      </div>

      <div className="months">
        {months.map(function (mo) { return <Month key={mo.y + "-" + mo.m} y={mo.y} m={mo.m} byDate={byDate} />; })}
      </div>

      <div className="callegend">
        {CITY_ORDER.map(function (cid) {
          return (
            <span key={cid} className="cl" style={{ "--c": cityVar(cid) }}>
              <i /> {CITIES[cid].name} <span style={{ color: "var(--ink-3)" }}>{CITIES[cid].jp}</span>
            </span>
          );
        })}
      </div>

      <div className="rule" />

      <SectionHead eyebrow="Day by day" title="The window, laid out" right={<span className="eyebrow">Click any row</span>} />
      <div className="agenda">
        {DAYS.map(function (d) {
          const iso = dayDate(anchor, d.n);
          const dt = fmtDay(iso);
          return (
            <button key={d.n} className="ag" style={{ "--c": cityVar(d.city) }} onClick={function () { go("/itinerary/" + d.n); }}>
              <span className="ag-date num">{dt.wd} {dt.mo} {dt.d}</span>
              <span className="ag-n num">{d.n}</span>
              <span className="ag-t">{d.title}<em>{d.theme}</em></span>
              <span className="ag-c">{CITIES[d.city].name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Month({ y, m, byDate }) {
  const first = new Date(Date.UTC(y, m, 1));
  const startPad = first.getUTCDay();
  const nDays = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= nDays; d++) cells.push(d);

  return (
    <div className="month">
      <h3>{MONTHS[m]} <span>{y}</span></h3>
      <div className="mgrid">
        {WEEKDAYS.map(function (w) { return <div key={w} className="wd">{w[0]}</div>; })}
        {cells.map(function (d, i) {
          if (d === null) return <div key={"p" + i} className="cell pad" />;
          const iso = toISO(new Date(Date.UTC(y, m, d)));
          const day = byDate[iso];
          if (!day) return <div key={iso} className="cell">{d}</div>;
          const prev = byDate[addDays(iso, -1)];
          const next = byDate[addDays(iso, 1)];
          const cls = ["cell", "trip"];
          if (!prev) cls.push("edge-l");
          if (!next) cls.push("edge-r");
          return (
            <div
              key={iso}
              className={cls.join(" ")}
              style={{ "--c": cityVar(day.city) }}
              title={"Day " + day.n + " — " + day.title}
              role="button"
              tabIndex={0}
              onClick={function () { go("/itinerary/" + day.n); }}
              onKeyDown={function (e) { if (e.key === "Enter") go("/itinerary/" + day.n); }}
            >
              <span className="num">{d}</span>
              <span className="dn num">D{day.n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
