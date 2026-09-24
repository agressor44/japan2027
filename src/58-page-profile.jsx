/* =================== MY PROFILE — the preference survey =================== */

function PageProfile() {
  const S = useStore();
  const me = travelerById(S.me);
  if (!me) return <div className="page"><div className="empty">No traveler linked to this account.</div></div>;

  const profile = S.profileOf(me.id);
  const pct = profileCompletion(profile);
  const [section, setSection] = useState(SURVEY[0].id);
  const current = SURVEY.filter(function (s) { return s.id === section; })[0] || SURVEY[0];
  const idx = SURVEY.map(function (s) { return s.id; }).indexOf(current.id);

  return (
    <div className="page">
      <PageHead
        eyebrow="My profile" jp="私"
        title={"What " + me.short + " wants out of Japan"}
        lede="Answer what you like, skip what you don't. These answers sit next to the itinerary and get used to suggest activities, sort split days, and flag anything that's a bad fit for someone."
      />

      <div className="card" style={{ "--c": me.color, borderLeft: "3px solid " + me.color }}>
        <div className="row" style={{ justifyContent: "space-between", gap: 14 }}>
          <div className="row" style={{ gap: 12 }}>
            <Avatar t={me} />
            <div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 19 }}>
                {me.name} {me.milestone ? <span title={me.milestone}>🎓</span> : null}
              </div>
              <div className="eyebrow">
                {ROLE_LABEL[me.role]}{me.age ? " · " + me.age : ""}
                {me.occupation ? " · " + me.occupation : ""}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", minWidth: 120 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 26 }} className="num">{pct}%</div>
            <div className="eyebrow">complete</div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Progress segments={[{ pct: pct, color: me.color, label: "Answered" }]} />
        </div>
      </div>

      <div className="filters" style={{ marginTop: 22 }}>
        {SURVEY.map(function (s, i) {
          const done = s.fields.filter(function (f) { return fieldAnswered(f, profile[f.id]); }).length;
          return (
            <button key={s.id} className={"fb " + (section === s.id ? "on" : "")} onClick={function () { setSection(s.id); }}>
              {i + 1}. {s.title} <span style={{ opacity: .65 }}>{done}/{s.fields.length}</span>
            </button>
          );
        })}
      </div>

      <section className="survey">
        <header className="survey-head">
          <div className="row" style={{ gap: 10 }}>
            <span className="eyebrow">Section {idx + 1} of {SURVEY.length}</span>
            <span className="jp" style={{ color: "var(--vermilion)", letterSpacing: ".16em" }}>{current.jp}</span>
          </div>
          <h2 className="display">{current.title}</h2>
          <p className="lede" style={{ fontSize: 14 }}>{current.blurb}</p>
        </header>

        {current.fields.map(function (f) {
          return <Field key={f.id} f={f} value={profile[f.id]} onChange={function (v) { S.saveProfile(f.id, v); }} />;
        })}

        <div className="dayfoot">
          {idx > 0
            ? <button className="btn" onClick={function () { setSection(SURVEY[idx - 1].id); window.scrollTo(0, 0); }}>← {SURVEY[idx - 1].title}</button>
            : <span />}
          {idx < SURVEY.length - 1
            ? <button className="btn primary" onClick={function () { setSection(SURVEY[idx + 1].id); window.scrollTo(0, 0); }}>{SURVEY[idx + 1].title} →</button>
            : <a className="btn primary" href="#/crew">See everyone's answers →</a>}
        </div>
      </section>

      <p className="eyebrow" style={{ marginTop: 18, textTransform: "none", letterSpacing: ".04em" }}>
        Saved as you type — change any answer whenever you like. {S.sync === "shared" ? "Updates are shared with the group instantly." : "Held in this browser until the shared store is reachable."}
      </p>

      {/* ---------- account & sign out ---------- */}
      <div className="rule" />
      <SectionHead eyebrow="Account" title="Signed in" />
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", gap: 14 }}>
          <div className="row" style={{ gap: 11 }}>
            <Avatar t={me} />
            <div>
              <div style={{ fontSize: 15 }}>{S.auth.user ? S.auth.user.name : me.name}</div>
              <div className="eyebrow" style={{ textTransform: "none", letterSpacing: ".04em" }}>
                {S.auth.user && S.auth.user.provider === "google" ? S.auth.user.email + " · Google" : "Signed in"}
                {" · linked to "}{me.name}
              </div>
            </div>
          </div>
          <button className="btn" onClick={function () { S.signOut(); }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- one survey field ---------------- */
function Field({ f, value, onChange }) {
  return (
    <div className="qfield">
      <label className="qlabel" htmlFor={"q-" + f.id}>{f.label}</label>
      {f.help ? <p className="qhelp">{f.help}</p> : null}

      {f.type === "chips" ? (
        <div className="chips">
          {f.options.map(function (o) {
            const on = (value || []).indexOf(o.id) >= 0;
            return (
              <button
                key={o.id} className={"chip " + (on ? "on" : "")} aria-pressed={on}
                onClick={function () {
                  const cur = (value || []).slice();
                  const i = cur.indexOf(o.id);
                  if (i >= 0) cur.splice(i, 1); else cur.push(o.id);
                  onChange(cur);
                }}
              >{o.label}</button>
            );
          })}
        </div>
      ) : null}

      {f.type === "choice" ? (
        <div className="choices">
          {f.options.map(function (o) {
            const on = value === o.id;
            return (
              <button key={o.id} className={"choice " + (on ? "on" : "")} aria-pressed={on}
                onClick={function () { onChange(on ? "" : o.id); }}>
                <b>{o.label}</b>
                {o.sub ? <em>{o.sub}</em> : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {f.type === "scale" ? (
        <div className="scale">
          <div className="scale-ends"><span>{f.ends[0]}</span><span>{f.ends[1]}</span></div>
          <div className="scale-row">
            {Array.from({ length: f.max - f.min + 1 }).map(function (_, i) {
              const n = f.min + i;
              return (
                <button key={n} className={"scale-dot " + (value === n ? "on" : "")}
                  aria-label={f.marks[i]} title={f.marks[i]}
                  onClick={function () { onChange(value === n ? "" : n); }}>
                  <span className="num">{n}</span>
                </button>
              );
            })}
          </div>
          <div className="scale-mark">{value ? f.marks[value - f.min] : "Not answered"}</div>
        </div>
      ) : null}

      {f.type === "text" ? (
        <input id={"q-" + f.id} className="field" value={value || ""} placeholder={f.placeholder || ""}
          onChange={function (e) { onChange(e.target.value); }} />
      ) : null}

      {f.type === "textarea" ? (
        <textarea id={"q-" + f.id} className="field" rows={3} value={value || ""} placeholder={f.placeholder || ""}
          onChange={function (e) { onChange(e.target.value); }} />
      ) : null}
    </div>
  );
}
