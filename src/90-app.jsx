/* =================== APP SHELL =================== */

function Nav({ base, className }) {
  return (
    <nav className={className}>
      {ROUTES.map(function (r) {
        const on = base === r.path || (r.path !== "/" && base.indexOf(r.path) === 0);
        return (
          <a key={r.id} href={"#" + r.path} className={on ? "on" : ""}>
            <span className="kj">{r.jp}</span>
            {r.label}
          </a>
        );
      })}
    </nav>
  );
}

function SyncDot() {
  const S = useStore();
  return (
    <div className={"syncdot " + (S.sync === "shared" ? "shared" : "")}>
      <i />{S.sync === "shared" ? "Shared with the group" : "This browser only"}
    </div>
  );
}

function Splash() {
  return (
    <div className="splash">
      <div className="brand-jp" style={{ fontSize: 32 }}>日本 2027</div>
      <div className="eyebrow">Signing you in…</div>
    </div>
  );
}

function App() {
  const route = useRoute();
  const S = useStore();

  useEffect(function () { window.scrollTo(0, 0); }, [route.hash]);

  if (S.auth.status === "checking") return <Splash />;
  if (S.auth.status === "signed-out") return <AuthGate />;
  if (S.auth.status === "needs-link") return <LinkGate />;

  let body;
  switch (route.base) {
    case "/itinerary": body = <PageItinerary param={route.param} />; break;
    case "/food":      body = <PageFood param={route.param} />; break;
    case "/options":   body = <PageOptions />; break;
    case "/booking":   body = <PageBooking />; break;
    case "/crew":      body = <PageCrew />; break;
    case "/profile":   body = <PageProfile />; break;
    default:           body = <PageHome />;
  }

  const me = travelerById(S.me);

  return (
    <div className="shell">
      <aside className="rail">
        <a className="brand" href="#/">
          <div className="brand-jp">日本 2027</div>
          <div className="brand-en">Family trip</div>
          <div className="brand-dates num">{fmtRange(S.anchor, TRIP.dayCount)}</div>
        </a>
        <Nav base={route.base} className="railnav" />
        <div className="rail-foot">
          <SyncDot />
          <a className="row" href="#/profile" style={{ gap: 8, alignItems: "center" }}>
            {me ? <Avatar t={me} /> : <span className="av ghost">?</span>}
            <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{me ? me.short : "Sign in"}</span>
          </a>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-in">
            <a className="brand-jp" href="#/" style={{ textDecoration: "none" }}>日本 2027</a>
            <a href="#/crew" style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {me ? <Avatar t={me} /> : <span className="av ghost">?</span>}
            </a>
          </div>
          <Nav base={route.base} className="topnav" />
        </header>
        {body}
      </div>
    </div>
  );
}

(function start() {
  const mount = document.getElementById("root");
  ReactDOM.createRoot(mount).render(
    React.createElement(StoreProvider, null, React.createElement(App, null))
  );
})();
