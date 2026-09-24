/* =================== CREW =================== */

function PageCrew() {
  const S = useStore();
  const splitDays = DAYS.filter(function (d) { return d.tracks; });
  const bdays = birthdaysDuringTrip(S.anchor, TRIP.dayCount);
  const claimed = (function () {
    const out = {};
    Object.keys(S.plan.accounts).forEach(function (sub) {
      const a = S.plan.accounts[sub];
      if (a && a.travelerId) out[a.travelerId] = a;
    });
    return out;
  })();

  const gaps = TRAVELERS.filter(function (t) { return t.needs && t.needs.length; });

  /* aggregate stated interests across everyone who has answered */
  const interestField = SURVEY[0].fields[0];
  const tally = interestField.options.map(function (o) {
    const who = TRAVELERS.filter(function (t) {
      const p = S.plan.profiles[t.id];
      return p && (p.interests || []).indexOf(o.id) >= 0;
    });
    return { o: o, who: who };
  }).filter(function (x) { return x.who.length; })
    .sort(function (a, b) { return b.who.length - a.who.length; });

  const dietary = TRAVELERS.map(function (t) {
    const p = S.plan.profiles[t.id] || {};
    const avoid = (p.foodAvoid || []).map(function (id) {
      const opt = SURVEY[1].fields[3].options.filter(function (o) { return o.id === id; })[0];
      return opt ? opt.label : id;
    });
    return { t: t, note: p.dietary || "", avoid: avoid };
  }).filter(function (x) { return x.note || x.avoid.length; });

  const answered = TRAVELERS.filter(function (t) { return profileCompletion(S.plan.profiles[t.id]) > 0; }).length;

  return (
    <div className="page">
      <PageHead
        eyebrow="Crew" jp="仲"
        title="Nine of us, three households"
        lede="The roster is fixed. What each person wants out of the trip is a separate thing entirely — that comes from the preference survey, and it's what will eventually drive suggestions."
      />

      {/* ---------- family structure ---------- */}
      <div className="fams">
        {FAMILIES.map(function (f) {
          const members = TRAVELERS.filter(function (t) { return t.family === f.id; });
          return (
            <section key={f.id} className="fam" style={{ "--c": f.color }}>
              <header className="fam-head">
                <h3 className="display">{f.name}</h3>
                <span className="eyebrow">{f.sub}</span>
              </header>
              <div className="fam-body">
                {members.map(function (t) {
                  const pct = profileCompletion(S.plan.profiles[t.id]);
                  const acct = claimed[t.id];
                  return (
                    <div key={t.id} className={"pcard " + (S.me === t.id ? "me" : "")}>
                      <Avatar t={t} />
                      <div className="pcard-b">
                        <div className="pcard-n">
                          {t.short}
                          {t.milestone ? <span className="grad" title={t.milestone}>🎓</span> : null}
                          {S.me === t.id ? <span className="pill neutral" style={{ marginLeft: 6 }}>You</span> : null}
                        </div>
                        <div className="pcard-m">
                          {ROLE_LABEL[t.role]}
                          {t.age ? " · " + (t.ageApprox || t.age) : ""}
                          {t.occupation ? " · " + t.occupation : ""}
                        </div>
                        {t.tripRole ? <div className="pcard-r">{t.tripRole}</div> : null}
                        {t.loves ? <div className="pcard-loves"><span aria-hidden="true">♥</span> {t.loves}</div> : null}
                        <div className="pcard-p">
                          <Progress segments={[{ pct: pct, color: t.color, label: "Profile" }]} />
                          <span className="num">{pct}%</span>
                        </div>
                        <div className="pcard-s">
                          {acct ? "signed in" : "not signed in yet"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ---------- the graduation ---------- */}
      <section className="card grad-card" style={{ marginTop: 16 }}>
        <Texture kind="asanoha" />
        <div className="row" style={{ gap: 14, position: "relative", alignItems: "flex-start" }}>
          <span className="grad-mark">🎓</span>
          <div>
            <div className="eyebrow">The occasion</div>
            <h3 className="display" style={{ fontSize: 21, margin: "6px 0 6px" }}>Lucy's graduation trip</h3>
          </div>
        </div>
      </section>

      {/* ---------- profile status ---------- */}
      <div className="rule" />
      <SectionHead
        eyebrow="Preferences"
        title="Who has filled in their survey"
        right={S.me ? <a className="btn sm primary" href="#/profile">Fill in mine</a> : null}
      />
      <p className="lede" style={{ fontSize: 14, marginBottom: 16 }}>
        {answered === 0
          ? "Nobody has answered yet. Once people do, activity cards start showing who each thing is actually a good fit for."
          : answered + " of 9 have started. Interests below feed the match chips on activity cards."}
      </p>

      {tally.length ? (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))" }}>
          {tally.map(function (x) {
            return (
              <div key={x.o.id} className="card" style={{ padding: 14 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14.5, fontWeight: 500 }}>{x.o.label}</span>
                  <span className="eyebrow num">{x.who.length}</span>
                </div>
                <div className="avatars" style={{ marginTop: 9 }}>
                  {x.who.map(function (t) { return <Avatar key={t.id} t={t} />; })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty">No survey answers yet. The survey lives on <a href="#/profile" style={{ color: "var(--indigo)", textDecoration: "underline" }}>My profile</a>.</div>
      )}

      {dietary.length ? (
        <>
          <div className="rule" />
          <SectionHead eyebrow="Before booking anything" title="Dietary needs on record" />
          <div className="callout">
            {dietary.map(function (d) {
              return (
                <div key={d.t.id}>
                  <strong style={{ fontWeight: 500 }}>{d.t.short}</strong>
                  {d.note ? " — " + d.note : ""}
                  {d.avoid.length ? (d.note ? "; avoids " : " — avoids ") + d.avoid.join(", ") : ""}
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      {/* ---------- birthdays in the window ---------- */}
      {bdays.length ? (
        <>
          <div className="rule" />
          <SectionHead eyebrow="Noticed" title="Birthdays inside the current dates" />
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))" }}>
            {bdays.map(function (b) {
              const d = dayByN(b.day);
              const dt = fmtDay(b.iso);
              return (
                <a key={b.traveler.id} className="card" href={"#/itinerary/" + b.day} style={{ borderLeft: "3px solid " + b.traveler.color }}>
                  <div className="eyebrow">{dt.wd} {dt.full} · Day {b.day}</div>
                  <div className="row" style={{ gap: 10, marginTop: 9 }}>
                    <Avatar t={b.traveler} />
                    <div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 17 }}>{b.traveler.short}'s birthday</div>
                      <div style={{ fontSize: 13, color: "var(--ink-2)" }}>in {CITIES[d.city].name} — {d.title}</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </>
      ) : null}

      {/* ---------- roster gaps ---------- */}
      {gaps.length ? (
        <>
          <div className="rule" />
          <SectionHead eyebrow="Still missing" title="Roster gaps" />
          <div className="callout">
            {gaps.map(function (t) {
              return <div key={t.id}><strong style={{ fontWeight: 500 }}>{t.short}</strong> — needs {t.needs.join(", ")}{t.ageApprox ? " (age listed as " + t.ageApprox + ")" : ""}.</div>;
            })}
          </div>
        </>
      ) : null}

      {/* ---------- split days ---------- */}
      <div className="rule" />
      <SectionHead eyebrow="Split days" title="Who's where" right={<span className="eyebrow">{splitDays.length} days split</span>} />
      <p className="lede" style={{ fontSize: 14, marginBottom: 16 }}>
        Some days deliberately break the group in two. Assign people here or on the day itself — same list either way.
      </p>
      <div className="whowhere">
        {splitDays.map(function (d) {
          const assigned = S.tracksFor(d.n);
          const dt = fmtDay(dayDate(S.anchor, d.n));
          return (
            <div key={d.n} className="ww" style={{ "--c": cityVar(d.city) }}>
              <div className="ww-d">
                <b>Day {d.n}</b>
                {dt.mo} {dt.d} · {CITIES[d.city].name}
              </div>
              <div className="ww-tracks">
                {d.tracks.map(function (tr) {
                  const members = S.travelers.filter(function (t) { return assigned[t.id] === tr.id; });
                  return (
                    <div key={tr.id} className="ww-t">
                      <span>{tr.label}</span>
                      <div className="avatars">
                        {members.length
                          ? members.map(function (t) { return <Avatar key={t.id} t={t} onClick={function () { S.setTrack(d.n, t.id, ""); }} />; })
                          : <span style={{ fontSize: 12, color: "var(--ink-3)" }}>—</span>}
                      </div>
                    </div>
                  );
                })}
                <div className="ww-t">
                  <span style={{ color: "var(--ink-3)" }}>Undecided</span>
                  <div className="avatars">
                    {S.travelers.filter(function (t) { return !assigned[t.id]; }).map(function (t) {
                      return (
                        <Avatar
                          key={t.id} t={t} faded
                          title={t.short + " — tap to put on " + d.tracks[0].label}
                          onClick={function () { S.setTrack(d.n, t.id, d.tracks[0].id); }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- what the mix means ---------- */}
      <div className="rule" />
      <SectionHead eyebrow="Group considerations" title="Planning for nine" />
      <div className="callout">
        <div>Interests vary widely across the group — the survey is what tells us who's actually up for what, so fill it in.</div>
        <div>Keep room for at least one calmer, grown-up evening that nobody's dragged into — that's what the split days are for.</div>
        <div>Nine people means reservations, reserved train seats, and a standing meeting point every single day.</div>
        <div>Everyone should have data on their phone and the hotel address written down. Phones die.</div>
      </div>

      {/* ---------- account ---------- */}
      <div className="rule" />
      <SectionHead eyebrow="Account" title="You're signed in" />
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", gap: 14 }}>
          <div className="row" style={{ gap: 11 }}>
            {S.me ? <Avatar t={travelerById(S.me)} /> : null}
            <div>
              <div style={{ fontSize: 15 }}>{S.auth.user ? S.auth.user.name : ""}</div>
              <div className="eyebrow" style={{ textTransform: "none", letterSpacing: ".04em" }}>
                {S.auth.user && S.auth.user.provider === "google" ? S.auth.user.email + " · Google" : "Household sign-in"}
                {" · linked to "}{travelerById(S.me) ? travelerById(S.me).name : "—"}
              </div>
            </div>
          </div>
          <button className="btn" onClick={function () { S.signOut(); }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
