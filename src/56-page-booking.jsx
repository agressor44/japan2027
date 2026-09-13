/* =================== BOOKINGS / CHECKLIST =================== */

const PRIORITY_LABEL = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };

function PageBooking() {
  const S = useStore();
  const [filter, setFilter] = useState("open");

  const rows = RESERVATIONS.map(function (r) {
    return Object.assign({}, r, {
      status: S.statusOf(r.id, "Not started"),
      owner: S.noteOf("owner:" + r.id)
    });
  });

  const shown = rows.filter(function (r) {
    if (filter === "all") return true;
    if (filter === "open") return r.status === "Not started" || r.status === "Researching";
    if (filter === "done") return r.status === "Booked" || r.status === "Paid" || r.status === "Complete";
    return r.priority === filter;
  });

  const tally = { done: 0, open: 0, skip: 0 };
  rows.forEach(function (r) {
    if (r.status === "Skip") tally.skip++;
    else if (r.status === "Not started" || r.status === "Researching") tally.open++;
    else tally.done++;
  });

  return (
    <div className="page">
      <PageHead
        eyebrow="Bookings" jp="予約"
        title="What has to be bought, and when"
        lede="Sorted by how badly it hurts to leave it late. Statuses and owners here are shared — change one and everyone sees it."
      />

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 21 }}>
            <span className="num">{tally.done}</span> done · <span className="num">{tally.open}</span> open
          </span>
          <span className="eyebrow">{rows.length} line items</span>
        </div>
        <Progress segments={[
          { pct: 100 * tally.done / rows.length, color: "var(--good)", label: "Done" },
          { pct: 100 * tally.skip / rows.length, color: "var(--off)", label: "Skipped" }
        ]} />
      </div>

      <div className="filters" style={{ marginTop: 20 }}>
        {[["open", "Still open"], ["all", "Everything"], ["done", "Sorted"], ["critical", "Critical only"], ["high", "High priority"]].map(function (f) {
          return <button key={f[0]} className={"fb " + (filter === f[0] ? "on" : "")} onClick={function () { setFilter(f[0]); }}>{f[1]}</button>;
        })}
      </div>

      {shown.length ? (
        <div>
          {shown.map(function (r) {
            return (
              <div key={r.id} className={"res " + r.priority}>
                <div>
                  <h4>{r.title}</h4>
                  <div className="res-meta">
                    {PRIORITY_LABEL[r.priority]} · book {r.window}
                    {r.day ? " · day " + r.day : ""}
                    {r.city !== "all" ? " · " + CITIES[r.city].name : ""}
                  </div>
                  {r.note ? <p className="res-note">{r.note}</p> : null}
                </div>
                <div className="res-ctl">
                  <select
                    className="sel" value={r.status} aria-label={"Status for " + r.title}
                    onChange={function (e) { S.setStatus(r.id, e.target.value); }}
                  >
                    {RES_STATUSES.map(function (s) { return <option key={s} value={s}>{s}</option>; })}
                  </select>
                  <select
                    className="sel" value={r.owner || ""} aria-label={"Owner for " + r.title}
                    onChange={function (e) { S.setNote("owner:" + r.id, e.target.value); }}
                  >
                    <option value="">Unassigned</option>
                    {S.travelers.map(function (t) { return <option key={t.id} value={t.id}>{t.name}</option>; })}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      ) : <div className="empty">Nothing here. Try another filter.</div>}

      <div className="rule" />

      <SectionHead eyebrow="Order of operations" title="What to do first" />
      <div className="callout">
        <div><strong style={{ fontWeight: 500 }}>Now —</strong> lock the dates. Nothing else can be booked properly until the window is real.</div>
        <div><strong style={{ fontWeight: 500 }}>Then —</strong> flights and hotels. Nine people in three cities is the hard constraint.</div>
        <div><strong style={{ fontWeight: 500 }}>~3 months out —</strong> theme parks, the cooking class, the samurai experience, the river boat.</div>
        <div><strong style={{ fontWeight: 500 }}>~1 month out —</strong> shinkansen seats (they go on sale 30 days ahead), teamLab, Shibuya Sky, sumo.</div>
        <div><strong style={{ fontWeight: 500 }}>Final week —</strong> restaurants for nine, karaoke, luggage forwarding, eSIMs.</div>
      </div>
    </div>
  );
}
