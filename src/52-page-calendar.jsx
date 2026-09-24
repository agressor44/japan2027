/* =================== CALENDAR — the state of the group's decisions ===================
   Dates are locked, so this page's job is not "what day is it" — it's
   "where do we still need to decide." Each day is a card showing its
   top-voted picks, a live tally, and a consensus status so the group
   can see at a glance what's settled and what still needs votes. */

/* Score a votable item: an "in" is worth 2, a "maybe" 1, a "pass" 0. */
function tallyVotes(S, itemId) {
  const v = S.votesFor(itemId);
  let yes = 0, maybe = 0, no = 0;
  Object.keys(v).forEach(function (k) {
    if (v[k] === "yes") yes++; else if (v[k] === "maybe") maybe++; else if (v[k] === "no") no++;
  });
  return { yes: yes, maybe: maybe, no: no, cast: yes + maybe + no, score: yes * 2 + maybe };
}

/* Every votable thing that belongs to a given day, from both the
   itinerary activities and the optional-activities pool. */
function votablesForDay(dayN) {
  const out = [];
  const d = dayByN(dayN);
  if (d) {
    allActivities(d).forEach(function (a) {
      if (a.votable) out.push({ id: a.id, title: a.title, city: d.city, link: a.link });
    });
  }
  OPTIONS.forEach(function (o) {
    if (o.day === dayN) out.push({ id: o.id, title: o.title, city: o.city, link: o.link });
  });
  const seen = {};
  return out.filter(function (x) { if (seen[x.id]) return false; seen[x.id] = 1; return true; });
}

/* Rank a day's votables and derive a consensus status for the day. */
function useDayRanking(day) {
  const S = useStore();
  return useMemo(function () {
    const ranked = votablesForDay(day.n)
      .map(function (x) { return Object.assign({}, x, tallyVotes(S, x.id)); })
      .sort(function (a, b) { return b.score - a.score || b.yes - a.yes; });

    const totalCast = ranked.reduce(function (s, r) { return s + r.cast; }, 0);

    let status = "settled";           // no votables → nothing to decide
    if (ranked.length) {
      if (totalCast === 0) status = "open";                 // nobody has voted
      else {
        const lead = ranked[0].score;
        const second = ranked[1] ? ranked[1].score : 0;
        status = (lead - second) >= 3 ? "leading" : "contested";
      }
    }
    return { ranked: ranked, totalCast: totalCast, status: status };
  }, [day.n, S.plan.votes]);
}

const DAY_STATUS = {
  settled:   { label: "Set",        cls: "st-settled" },
  open:      { label: "Needs votes", cls: "st-open" },
  contested: { label: "Toss-up",     cls: "st-contested" },
  leading:   { label: "Front-runner", cls: "st-leading" }
};

/* Compact vote tally: dots for in / maybe, muted for the rest. */
function VoteDots({ item, size }) {
  const S = useStore();
  const votes = S.votesFor(item.id);
  return (
    <span className="votedots" title={item.yes + " in · " + item.maybe + " maybe · " + item.no + " pass"}>
      {S.travelers.map(function (t) {
        const v = votes[t.id] || "";
        return <i key={t.id} className={"vd " + v} />;
      })}
    </span>
  );
}

function DayCard({ day }) {
  const S = useStore();
  const dt = fmtDay(dayDate(S.anchor, day.n));
  const { ranked, status } = useDayRanking(day);
  const st = DAY_STATUS[status];
  const settled = status === "settled";
  const top = ranked.slice(0, 4);
  const extra = ranked.length - top.length;

  return (
    <section className={"cday " + (settled ? "cday-set" : "")} style={{ "--c": cityVar(day.city) }}>
      <div className="cday-top">
        <a className="cday-head" href={"#/itinerary/" + day.n}>
          <span className="cday-n num">{day.n}</span>
          <span className="cday-when">
            <b>{dt.wd} · {dt.mo} {dt.d}</b>
            <em>{CITIES[day.city].name} · {day.title}</em>
          </span>
        </a>
        <span className={"cday-status " + st.cls}>{st.label}</span>
      </div>

      {top.length ? (
        <ol className="cday-picks">
          {top.map(function (x, i) {
            return (
              <li key={x.id} className={"cpick" + (i === 0 && status === "leading" ? " cpick-lead" : "")}>
                <span className="cpick-main">
                  <span className="cpick-title">{x.title}</span>
                  {x.link ? (
                    <a className="cpick-link" href={x.link} target="_blank" rel="noopener noreferrer" aria-label={"Look up " + x.title}>↗</a>
                  ) : null}
                </span>
                <span className="cpick-tally">
                  <VoteDots item={x} />
                  <span className="cpick-count num">{x.cast ? x.yes + "\u2009in" : "—"}</span>
                </span>
              </li>
            );
          })}
          {extra > 0 ? (
            <li className="cpick-more"><a href="#/options">+{extra} more to vote on →</a></li>
          ) : null}
        </ol>
      ) : (
        <p className="cday-fixed">Fixed day — nothing to vote on.</p>
      )}
    </section>
  );
}

/* PageCalendar was removed — the calendar merged into the Vote page.
   The helpers and DayCard above are now used there. */
