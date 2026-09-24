/* ===========================================================
   RUNTIME — dates, shared store, tiny router
   =========================================================== */

const { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext, Fragment } = React;

/* ---------------------- dates ---------------------- */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseISO(s) {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function toISO(dt) {
  return dt.toISOString().slice(0, 10);
}
function addDays(iso, n) {
  const dt = parseISO(iso);
  dt.setUTCDate(dt.getUTCDate() + n);
  return toISO(dt);
}
function dayDate(anchor, n) {
  return addDays(anchor, n - 1);
}
function fmtDay(iso) {
  const dt = parseISO(iso);
  return { wd: WEEKDAYS[dt.getUTCDay()], d: dt.getUTCDate(), mo: MONTHS_SHORT[dt.getUTCMonth()], full: MONTHS[dt.getUTCMonth()] + " " + dt.getUTCDate() };
}
function fmtRange(anchor, count) {
  const a = fmtDay(anchor), b = fmtDay(dayDate(anchor, count));
  return a.mo === b.mo ? `${a.mo} ${a.d}–${b.d}, 2027` : `${a.mo} ${a.d} – ${b.mo} ${b.d}, 2027`;
}
function daysUntil(iso) {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseISO(iso).getTime() - today) / 86400000);
}

/* ------------------- shared store -------------------
   Writes go to the artifact's shared database when the page
   is published with it, so all nine travelers see the same
   plan. Falls back to this browser only when it isn't there. */

const BLANK = {
  settings: { anchor: TRIP.defaultAnchor },
  votes: {}, status: {}, notes: {}, tracks: {},
  accounts: {},   // google sub / household key -> { travelerId, name, email, picture }
  profiles: {}    // travelerId -> survey answers
};
const LS_KEY = "japan2027.plan.v1";
const StoreCtx = createContext(null);

function deepMerge(base, patch) {
  const out = Object.assign({}, base);
  for (const k of Object.keys(patch)) {
    const v = patch[k];
    if (v && typeof v === "object" && !Array.isArray(v)) out[k] = deepMerge(base[k] && typeof base[k] === "object" ? base[k] : {}, v);
    else out[k] = v;
  }
  return out;
}

function readLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
}
function writeLocal(plan) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(plan)); } catch (e) { /* private mode */ }
}

function StoreProvider({ children }) {
  const [plan, setPlan] = useState(function () { return deepMerge(BLANK, readLocal()); });
  const [sync, setSync] = useState("local");          // local | connecting | shared
  // With Firebase on, identity comes from onAuthStateChanged, not localStorage.
  const [user, setUser] = useState(function () { return FIREBASE_ON ? null : readSession(); });
  const [authReady, setAuthReady] = useState(!FIREBASE_ON);
  const docRef = useRef(null);

  /* --- backend A: Firebase (self-hosted site) ---
     The plan doc is protected by rules that require request.auth. The
     Firestore listener must therefore only open AFTER auth is ready and
     a user is signed in — otherwise the first read races ahead of the
     auth token, gets a terminal permission-denied, and the listener
     never recovers (it pins the app to "local" forever). So we attach
     and tear down the snapshot inside onAuthStateChanged. */
  useEffect(function () {
    if (!FIREBASE_ON) return;
    let alive = true, unsubDoc = null, unsubAuth = null;
    setSync("connecting");
    initFirebase().then(function (f) {
      if (!alive) return;
      if (!f) { setSync("local"); setAuthReady(true); return; }

      const ref = f.db.doc(PLAN_DOC);
      // Firestore's set(..., {merge:true}) deep-merges maps and replaces
      // arrays wholesale — exactly the semantics patch() is written for.
      // Expose both update() and set() so patch()'s set() fallback works
      // against this backend too (a bare Firestore ref has .set; this
      // wrapper must as well or the fallback throws).
      docRef.current = {
        update: function (delta) { return ref.set(delta, { merge: true }); },
        set: function (full) { return ref.set(full, { merge: true }); }
      };

      function stopDoc() { if (unsubDoc) { unsubDoc(); unsubDoc = null; } }

      unsubAuth = f.auth.onAuthStateChanged(function (u) {
        if (!alive) return;
        setUser(fbUser(u));
        setAuthReady(true);

        // Re-evaluate the listener whenever auth changes.
        stopDoc();
        if (!u) { setSync("local"); return; }   // signed out → local only
        setSync("connecting");
        unsubDoc = ref.onSnapshot(function (snap) {
          if (!alive) return;
          setSync("shared");
          if (snap.exists) setPlan(deepMerge(BLANK, snap.data()));
        }, function () { if (alive) setSync("local"); });
      });
    }).catch(function () { if (alive) { setSync("local"); setAuthReady(true); } });
    return function () { alive = false; if (unsubDoc) unsubDoc(); if (unsubAuth) unsubAuth(); };
  }, []);

  /* --- backend B: the Claude artifact's own store --- */
  useEffect(function () {
    if (FIREBASE_ON) return;
    let alive = true, unsub = null;
    setSync("connecting");
    const boot = (window.claude && window.claude.use) ? window.claude.use("db") : Promise.resolve(null);
    boot.then(function (db) {
      if (!alive) return;
      if (!db) { setSync("local"); return; }
      const ref = db.doc(PLAN_DOC);
      docRef.current = ref;
      ref.get().then(function (snap) {
        if (!alive) return;
        if (!snap.exists) return ref.set(deepMerge(BLANK, readLocal()));
      }).catch(function () {});
      unsub = ref.onSnapshot(function (snap) {
        if (!alive) return;
        setSync("shared");
        if (snap.exists) setPlan(deepMerge(BLANK, snap.data()));
      }, function () { if (alive) setSync("local"); });
    }).catch(function () { if (alive) setSync("local"); });
    return function () { alive = false; if (unsub) unsub(); };
  }, []);

  const patch = useCallback(function (delta) {
    setPlan(function (prev) {
      const next = deepMerge(prev, delta);
      writeLocal(next);
      return next;
    });
    const ref = docRef.current;
    if (ref) ref.update(delta).catch(function () { ref.set(deepMerge(BLANK, readLocal())).catch(function () {}); });
  }, []);

  const signIn = useCallback(function (u) {
    if (FIREBASE_ON) return;              // Firebase signs in via its own popup
    writeSession(u); setUser(u);
  }, []);

  const signOut = useCallback(function () {
    if (FIREBASE_ON) {
      initFirebase().then(function (f) { if (f) f.auth.signOut(); }).catch(function () {});
      return;                              // onAuthStateChanged clears the user
    }
    writeSession(null); setUser(null);
  }, []);

  const api = useMemo(function () {
    const account = user ? plan.accounts[user.sub] : null;
    const me = (account && account.travelerId) || "";
    const authStatus = !authReady ? "checking" : !user ? "signed-out" : (me ? "signed-in" : "needs-link");

    return {
      plan: plan, sync: sync, me: me, patch: patch,
      travelers: TRAVELERS,
      auth: { status: authStatus, user: user },
      signIn: signIn,
      signOut: signOut,
      linkTraveler: function (travelerId) {
        if (!user) return;
        patch({ accounts: { [user.sub]: { travelerId: travelerId, name: user.name, email: user.email || "", picture: user.picture || "", provider: user.provider } } });
      },
      accountsByTraveler: function () {
        const out = {};
        Object.keys(plan.accounts).forEach(function (sub) {
          const a = plan.accounts[sub];
          if (a && a.travelerId && (!user || sub !== user.sub)) out[a.travelerId] = a;
        });
        return out;
      },
      profileOf: function (id) { return plan.profiles[id] || {}; },
      saveProfile: function (fieldId, value) {
        if (!me) return;
        patch({ profiles: { [me]: { [fieldId]: value, updatedAt: new Date().toISOString() } } });
      },
      anchor: plan.settings.anchor || TRIP.defaultAnchor,
      setAnchor: function (iso) { patch({ settings: { anchor: iso } }); },
      vote: function (itemId, v) { if (!me) return; patch({ votes: { [itemId]: { [me]: v } } }); },
      votesFor: function (itemId) { return plan.votes[itemId] || {}; },
      myVote: function (itemId) { return (plan.votes[itemId] || {})[me] || ""; },
      setStatus: function (id, s) { patch({ status: { [id]: s } }); },
      statusOf: function (id, fallback) { return plan.status[id] || fallback || ""; },
      setNote: function (id, txt) { patch({ notes: { [id]: txt } }); },
      noteOf: function (id) { return plan.notes[id] || ""; },
      setTrack: function (dayN, travelerId, trackId) { patch({ tracks: { ["d" + dayN]: { [travelerId]: trackId } } }); },
      trackOf: function (dayN, travelerId) { return (plan.tracks["d" + dayN] || {})[travelerId] || ""; },
      tracksFor: function (dayN) { return plan.tracks["d" + dayN] || {}; }
    };
  }, [plan, sync, user, authReady, patch, signIn, signOut]);

  return React.createElement(StoreCtx.Provider, { value: api }, children);
}

function useStore() { return useContext(StoreCtx); }

/* --------------------- routing --------------------- */

const ROUTES = [
  { id: "home",     path: "/",             label: "Overview",     jp: "全" },
  { id: "itinerary",path: "/itinerary",    label: "Itinerary",    jp: "程" },
  { id: "food",     path: "/food",         label: "Food",         jp: "食" },
  { id: "options",  path: "/options",      label: "Vote",         jp: "票" },
  { id: "booking",  path: "/booking",      label: "Bookings",     jp: "予" },
  { id: "crew",     path: "/crew",         label: "Crew",         jp: "仲" },
  { id: "profile",  path: "/profile",      label: "My profile",   jp: "私" }
];

function useRoute() {
  const [hash, setHash] = useState(function () { return window.location.hash.slice(1) || "/"; });
  useEffect(function () {
    function on() { setHash(window.location.hash.slice(1) || "/"); }
    window.addEventListener("hashchange", on);
    return function () { window.removeEventListener("hashchange", on); };
  }, []);
  const parts = hash.split("/").filter(Boolean);
  const base = "/" + (parts[0] || "");
  return { hash: hash, base: base, param: parts[1] || null };
}

function go(path) {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* ------------------ derived helpers ---------------- */

function allActivities(day) {
  const out = [];
  ["morning", "afternoon", "evening"].forEach(function (b) {
    (day.blocks && day.blocks[b] ? day.blocks[b] : []).forEach(function (a) { out.push(Object.assign({ block: b }, a)); });
  });
  (day.tracks || []).forEach(function (tr) {
    (tr.items || []).forEach(function (a) { out.push(Object.assign({ block: "track", track: tr.id }, a)); });
  });
  return out;
}

function everyActivity() {
  const out = [];
  DAYS.forEach(function (d) { allActivities(d).forEach(function (a) { out.push(Object.assign({ day: d.n, city: d.city }, a)); }); });
  return out;
}

/* A "look it up" URL for a votable item. Uses the item's own `link`
   when one is set, otherwise builds a Google search from its title
   (plus the city name) so every card always has something to open. */
function lookupLink(item) {
  if (item && item.link) return item.link;
  const cityName = item && item.city && CITIES[item.city] ? CITIES[item.city].name + " " : "";
  const q = encodeURIComponent(cityName + ((item && item.title) || "") + " Japan");
  return "https://www.google.com/search?q=" + q;
}

function dayByN(n) { return DAYS.filter(function (d) { return d.n === Number(n); })[0]; }
function foodById(id) { return FOOD.filter(function (f) { return f.id === id; })[0]; }
function segAfter(n) { return SEGMENTS.filter(function (s) { return s.afterDay === n; })[0]; }
function cityOf(id) { return CITIES[id] || CITIES.tokyo; }
