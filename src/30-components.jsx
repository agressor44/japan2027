/* ===========================================================
   SHARED COMPONENTS
   =========================================================== */

function cityVar(id) { return "var(--" + (CITIES[id] ? id : "tokyo") + ")"; }

function initials(t) {
  const s = String((t && (t.short || t.name)) || t || "?").trim();
  return s.slice(0, 2).charAt(0).toUpperCase() + s.slice(1, 2).toLowerCase();
}

function Texture({ kind }) {
  return React.createElement("div", { className: "tx tx-" + (kind || "kumiko"), "aria-hidden": "true" });
}

function Tag({ id }) {
  const t = TAGS[id];
  if (!t) return null;
  return (
    <span className={"tag " + (t.group === "who" ? "who-" + id : "")}>
      <span className="kj">{t.glyph}</span>{t.label}
    </span>
  );
}

function StatusPill({ status }) {
  const s = STATUSES[status];
  if (!s) return null;
  return <span className={"pill " + s.tone}>{s.label}</span>;
}

function Avatar({ t, title, onClick, faded }) {
  return (
    <span
      className="av"
      style={{ background: t.color, opacity: faded ? .3 : 1 }}
      title={title || t.name}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } } : undefined}
    >{initials(t)}</span>
  );
}

/* Travelers whose stated interests line up with this activity.
   Silent until people have filled in their preferences. */
function FitChips({ tags }) {
  const S = useStore();
  const who = fitFor(tags, S.plan.profiles);
  if (!who.length) return null;
  return (
    <div className="fit">
      <span className="eyebrow">Matches</span>
      <div className="avatars">
        {who.map(function (t) { return <Avatar key={t.id} t={t} title={t.short + " said they're into this"} />; })}
      </div>
    </div>
  );
}

/* --- voting: in / maybe / out, one vote per traveler --- */
function VoteBar({ itemId, compact }) {
  const S = useStore();
  const votes = S.votesFor(itemId);
  const mine = S.myVote(itemId);
  const counts = { yes: 0, maybe: 0, no: 0 };
  Object.keys(votes).forEach(function (k) { if (counts[votes[k]] !== undefined) counts[votes[k]]++; });
  const cast = counts.yes + counts.maybe + counts.no;

  function set(v) { S.vote(itemId, mine === v ? "" : v); }

  return (
    <div className="vote">
      <div className="vote-btns" role="group" aria-label="Your vote">
        <button className={"yes " + (mine === "yes" ? "on" : "")} onClick={function () { set("yes"); }} disabled={!S.me}>In</button>
        <button className={"maybe " + (mine === "maybe" ? "on" : "")} onClick={function () { set("maybe"); }} disabled={!S.me}>Maybe</button>
        <button className={"no " + (mine === "no" ? "on" : "")} onClick={function () { set("no"); }} disabled={!S.me}>Pass</button>
      </div>
      <div className="vote-tally" title={counts.yes + " in · " + counts.maybe + " maybe · " + counts.no + " pass"}>
        {S.travelers.map(function (t) {
          const v = votes[t.id];
          return <i key={t.id} className={"vt " + (v || "")} />;
        })}
      </div>
      {!compact && (
        <span className="vote-hint">
          {!S.me ? "Sign in to vote"
            : cast === 0 ? "No votes yet"
            : counts.yes + " in · " + counts.maybe + " maybe · " + counts.no + " pass"}
        </span>
      )}
    </div>
  );
}

function ActivityCard({ a, cityId }) {
  const S = useStore();
  const status = S.statusOf(a.id, a.status);
  return (
    <article className={"act " + status} style={{ "--c": cityVar(cityId) }}>
      <div className="act-top">
        <h4 className="act-title">
          {a.title}
          {a.jp ? <span className="jp">{a.jp}</span> : null}
        </h4>
        {a.dur ? <span className="act-dur">{a.dur}</span> : null}
      </div>
      {a.note ? <p className="act-note">{a.note}</p> : null}
      <div className="act-foot">
        <StatusPill status={status} />
        {(a.tags || []).map(function (t) { return <Tag key={t} id={t} />; })}
      </div>
      <FitChips tags={a.tags} />
      {a.votable ? (
        <a className="lookup" href={lookupLink(a)} target="_blank" rel="noopener noreferrer">
          {a.link ? "Official site" : "Look it up"} <span aria-hidden="true">↗</span>
        </a>
      ) : null}
      {a.votable ? <VoteBar itemId={a.id} /> : null}
    </article>
  );
}

const LANES = [
  { id: "morning", kj: "朝", label: "Morning" },
  { id: "afternoon", kj: "昼", label: "Afternoon" },
  { id: "evening", kj: "夜", label: "Evening" }
];

function Lane({ id, kj, label, items, cityId }) {
  if (!items || !items.length) return null;
  return (
    <section className="lane" style={{ "--c": cityVar(cityId) }}>
      <div className="lane-label">
        <span className="kj">{kj}</span>
        <span>{label}</span>
      </div>
      <div className="lane-items">
        {items.map(function (a) { return <ActivityCard key={a.id} a={a} cityId={cityId} />; })}
      </div>
    </section>
  );
}

function DayStrip({ current }) {
  const S = useStore();
  return (
    <div className="daystrip" role="tablist" aria-label="Trip days">
      {DAYS.map(function (d) {
        const dt = fmtDay(dayDate(S.anchor, d.n));
        return (
          <button
            key={d.n}
            role="tab"
            aria-selected={current === d.n}
            className={"daychip " + (current === d.n ? "on" : "")}
            style={{ "--c": cityVar(d.city) }}
            onClick={function () { go("/itinerary/" + d.n); }}
          >
            <b>{d.n}</b>
            <span>{dt.mo} {dt.d}</span>
          </button>
        );
      })}
    </div>
  );
}

function Progress({ segments }) {
  return (
    <div className="progress">
      {segments.map(function (s, i) {
        return <i key={i} style={{ width: s.pct + "%", background: s.color }} title={s.label} />;
      })}
    </div>
  );
}

function SectionHead({ eyebrow, title, right }) {
  return (
    <div className="sec-head">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2 className="display">{title}</h2>
      </div>
      {right || null}
    </div>
  );
}

function PageHead({ jp, eyebrow, title, lede, children }) {
  return (
    <header className="page-head fade">
      <div className="row" style={{ gap: 12 }}>
        <span className="eyebrow">{eyebrow}</span>
        {jp ? <span className="jp" style={{ color: "var(--vermilion)", fontSize: 15, letterSpacing: ".18em" }}>{jp}</span> : null}
      </div>
      <h1>{title}</h1>
      {lede ? <p className="lede">{lede}</p> : null}
      {children}
    </header>
  );
}
