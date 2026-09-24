/* ===========================================================
   AUTHENTICATION

   Three providers, one result shape:
      { sub, email, name, picture, provider }
   which is then linked to exactly one traveler on the roster.

   1. GOOGLE — Google Identity Services. Switches on when a client
      ID is present on the page:
          window.JAPAN2027_GOOGLE_CLIENT_ID = "….apps.googleusercontent.com"

   2. APPLE — Sign in with Apple JS. Switches on when its config is
      present (both values are required by Apple):
          window.JAPAN2027_APPLE_CLIENT_ID   = "com.example.japan2027"   // Services ID
          window.JAPAN2027_APPLE_REDIRECT_URI = "https://your.site/"     // must match the Services ID exactly
      Apple hands over the person's name ONLY on the very first
      authorization, so it is captured then and kept in the account
      record; later sign-ins arrive with the id token alone.

   3. HOUSEHOLD — the fallback, and what runs while this site is
      published as a Claude artifact: that sandbox only loads scripts
      from a short allowlist, and neither Apple's nor Google's host
      is on it. Same linking, no identity provider.

   TRUST: both social providers are decoded in the browser, which is
   fine for gating a family trip site. It is NOT a security boundary.
   If this ever guards anything that matters, post the credential to a
   server, verify the signature and `aud` against the provider's public
   keys, and mint your own session there.
   =========================================================== */

const GOOGLE_CLIENT_ID = (typeof window !== "undefined" && window.JAPAN2027_GOOGLE_CLIENT_ID) || "";
const APPLE_CLIENT_ID = (typeof window !== "undefined" && window.JAPAN2027_APPLE_CLIENT_ID) || "";
const APPLE_REDIRECT_URI = (typeof window !== "undefined" && window.JAPAN2027_APPLE_REDIRECT_URI) || "";
const APPLE_READY = !!(APPLE_CLIENT_ID && APPLE_REDIRECT_URI);

const SESSION_KEY = "japan2027.session.v1";
const GSI_SRC = "https://accounts.google.com/gsi/client";
const APPLE_SRC = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

function decodeJwt(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(atob(part).split("").map(function (c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
    return JSON.parse(json);
  } catch (e) { return null; }
}

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch (e) { return null; }
}
function writeSession(u) {
  try { u ? localStorage.setItem(SESSION_KEY, JSON.stringify(u)) : localStorage.removeItem(SESSION_KEY); } catch (e) {}
}

/* Load a third-party script once; resolve null if it never arrives.
   In a locked-down sandbox this is the quiet path to the fallback. */
const scriptCache = {};
function loadScript(src, check) {
  if (scriptCache[src]) return scriptCache[src];
  scriptCache[src] = new Promise(function (resolve) {
    if (check()) return resolve(check());
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    const timer = setTimeout(function () { resolve(null); }, 6000);
    s.onload = function () { clearTimeout(timer); resolve(check() || null); };
    s.onerror = function () { clearTimeout(timer); resolve(null); };
    document.head.appendChild(s);
  });
  return scriptCache[src];
}

/* ---------------- Google ---------------- */
function GoogleButton({ onCredential, onResolved }) {
  const host = useRef(null);
  const [state, setState] = useState(GOOGLE_CLIENT_ID ? "loading" : "off");

  useEffect(function () {
    let alive = true;
    if (!GOOGLE_CLIENT_ID) { onResolved("google", false); return; }
    loadScript(GSI_SRC, function () { return window.google && window.google.accounts ? window.google : null; })
      .then(function (g) {
        if (!alive) return;
        if (!g) { setState("blocked"); onResolved("google", false); return; }
        try {
          g.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: function (res) {
              const c = decodeJwt(res.credential);
              if (!c) return;
              onCredential({
                sub: "google:" + c.sub, email: c.email || "",
                name: c.name || c.email || "Google user",
                picture: c.picture || "", provider: "google"
              });
            }
          });
          g.accounts.id.renderButton(host.current, { theme: "outline", size: "large", shape: "pill", text: "signin_with", width: 280 });
          setState("ready");
          onResolved("google", true);
        } catch (e) { setState("blocked"); onResolved("google", false); }
      });
    return function () { alive = false; };
  }, []);

  if (state === "off" || state === "blocked") return null;
  return (
    <div className="gbtn">
      <div ref={host} />
      {state === "loading" ? <span className="eyebrow">Loading Google sign-in…</span> : null}
    </div>
  );
}

/* ---------------- Apple ---------------- */
function AppleButton({ onCredential, onResolved }) {
  const [state, setState] = useState(APPLE_READY ? "loading" : "off");
  const [busy, setBusy] = useState(false);

  useEffect(function () {
    let alive = true;
    if (!APPLE_READY) { onResolved("apple", false); return; }
    loadScript(APPLE_SRC, function () { return window.AppleID || null; }).then(function (a) {
      if (!alive) return;
      if (!a) { setState("blocked"); onResolved("apple", false); return; }
      try {
        a.auth.init({
          clientId: APPLE_CLIENT_ID,
          scope: "name email",
          redirectURI: APPLE_REDIRECT_URI,
          usePopup: true
        });
        setState("ready");
        onResolved("apple", true);
      } catch (e) { setState("blocked"); onResolved("apple", false); }
    });
    return function () { alive = false; };
  }, []);

  function signIn() {
    if (busy || !window.AppleID) return;
    setBusy(true);
    window.AppleID.auth.signIn().then(function (res) {
      setBusy(false);
      const token = res && res.authorization && res.authorization.id_token;
      const c = token ? decodeJwt(token) : null;
      if (!c) return;
      // Apple sends the name once, on first authorization only.
      const n = res.user && res.user.name;
      const full = n ? [n.firstName, n.lastName].filter(Boolean).join(" ") : "";
      onCredential({
        sub: "apple:" + c.sub, email: c.email || "",
        name: full || c.email || "Apple user",
        picture: "", provider: "apple"
      });
    }).catch(function () { setBusy(false); });
  }

  if (state === "off" || state === "blocked") return null;
  return (
    <button className="btn apple" onClick={signIn} disabled={state !== "ready" || busy}>
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M11.2 8.5c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.6-2.3.6-.5 0-1.2-.5-2-.5-1 0-2 .6-2.5 1.6-1.1 1.9-.3 4.6.8 6.1.5.7 1.1 1.5 1.9 1.5.8 0 1-.5 2-.5s1.2.5 2 .5 1.3-.7 1.8-1.5c.6-.8.8-1.7.8-1.7s-1.6-.6-1.6-2.6zM9.8 3.8c.4-.5.7-1.2.6-1.9-.6 0-1.4.4-1.8.9-.4.5-.7 1.2-.6 1.9.7.1 1.4-.4 1.8-.9z"/>
      </svg>
      {busy ? "Waiting for Apple…" : "Sign in with Apple"}
    </button>
  );
}

/* ---------------- sign-in screen ---------------- */
function AuthGate() {
  const S = useStore();
  // null = still checking, false = unavailable here, true = ready.
  // Anything without config is settled before the first paint.
  const [providers, setProviders] = useState({
    google: GOOGLE_CLIENT_ID ? null : false,
    apple: APPLE_READY ? null : false
  });
  const [name, setName] = useState("");

  const resolved = providers.google !== null && providers.apple !== null;
  const anySocial = providers.google || providers.apple;

  function onResolved(which, ok) {
    setProviders(function (p) {
      const next = Object.assign({}, p);
      next[which] = !!ok;
      return next;
    });
  }

  function signInHousehold() {
    const clean = name.trim();
    if (!clean) return;
    S.signIn({
      sub: "household:" + clean.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      email: "", name: clean, picture: "", provider: "household"
    });
  }

  return (
    <div className="gate">
      <div className="gate-art" aria-hidden="true">
        <div className="gate-sun" />
        <div className="gate-vert">東京 · 京都 · 奈良 · 大阪</div>
        <Texture kind="kumiko" />
      </div>
      <div className="gate-panel">
        <div className="gate-brand">
          <div className="brand-jp" style={{ fontSize: 34 }}>日本 2027</div>
          <div className="brand-en">Family trip · Tokyo → Kyoto → Osaka</div>
        </div>

        <h1 className="display">Sign in to plan</h1>
        <p className="lede" style={{ fontSize: 14.5 }}>
          The itinerary is open to the nine of us. Signing in links you to your name on the
          roster, so your votes, your split-day choices and your preferences stay yours.
        </p>

        {/* Firebase, when the site is self-hosted, owns sign-in outright —
            anyone who got in another way could not write to Firestore. */}
        {FIREBASE_ON ? (
          <div className="providers">
            <FirebaseGoogleButton />
            <p className="gate-why" style={{ marginTop: 12 }}>
              Use the Google account the trip invite went to. If it says the account isn't
              recognised, ask Adam to add it to the list.
            </p>
          </div>
        ) : (
          <div className="providers">
            <GoogleButton onCredential={function (u) { S.signIn(u); }} onResolved={onResolved} />
            <AppleButton onCredential={function (u) { S.signIn(u); }} onResolved={onResolved} />
          </div>
        )}

        {!FIREBASE_ON && resolved ? (
          <div className="gate-alt">
            <div className="gate-or"><span>{anySocial ? "or" : "sign in"}</span></div>
            {!anySocial ? (
              <p className="gate-why">
                Google and Apple sign-in aren't reachable from this copy of the site — the page is
                running in a sandbox that only loads scripts from a short allowlist, and neither
                provider is on it. Household sign-in works exactly the same way from here.
              </p>
            ) : null}
            <label className="eyebrow" htmlFor="gate-name">Continue with your name</label>
            <div className="row" style={{ gap: 8, marginTop: 7 }}>
              <input
                id="gate-name" className="field" value={name} placeholder="e.g. Cristina"
                autoComplete="given-name"
                onChange={function (e) { setName(e.target.value); }}
                onKeyDown={function (e) { if (e.key === "Enter") signInHousehold(); }}
                style={{ flex: 1, minWidth: 160 }}
              />
              <button className="btn primary" onClick={signInHousehold} disabled={!name.trim()}>Continue</button>
            </div>
          </div>
        ) : !FIREBASE_ON ? (
          <div className="gate-alt"><span className="eyebrow">Checking sign-in options…</span></div>
        ) : null}

        <p className="gate-foot">
          Nine travelers · {fmtRange(S.anchor, TRIP.dayCount)}
        </p>
      </div>
    </div>
  );
}

/* ---------------- after sign-in: which traveler are you ---------------- */
function LinkGate() {
  const S = useStore();
  const taken = S.accountsByTraveler();

  return (
    <div className="gate">
      <div className="gate-art" aria-hidden="true">
        <div className="gate-sun" />
        <Texture kind="asanoha" />
      </div>
      <div className="gate-panel wide">
        <div className="gate-brand">
          <div className="brand-jp" style={{ fontSize: 28 }}>日本 2027</div>
          <div className="brand-en">Signed in as {S.auth.user.name}</div>
        </div>
        <h1 className="display">Which one are you?</h1>
        <p className="lede" style={{ fontSize: 14.5 }}>
          Pick your name once. It links this account to the roster so the group knows whose
          votes and preferences are whose.
        </p>

        <div className="linklist">
          {FAMILIES.map(function (f) {
            const members = TRAVELERS.filter(function (t) { return t.family === f.id; });
            return (
              <div key={f.id} className="linkfam" style={{ "--c": f.color }}>
                <div className="eyebrow">{f.name}</div>
                <div className="linkrow">
                  {members.map(function (t) {
                    const claimedBy = taken[t.id];
                    return (
                      <button
                        key={t.id} className="linkbtn" disabled={!!claimedBy}
                        onClick={function () { S.linkTraveler(t.id); }}
                        title={claimedBy ? "Already claimed by " + claimedBy.name : "This is me"}
                      >
                        <Avatar t={t} />
                        <span>
                          <b>{t.short}</b>
                          <em>{claimedBy ? "claimed" : (ROLE_LABEL[t.role] + (t.age ? " · " + t.age : ""))}</em>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn" style={{ marginTop: 18 }} onClick={function () { S.signOut(); }}>
          Not you? Sign out
        </button>
      </div>
    </div>
  );
}
