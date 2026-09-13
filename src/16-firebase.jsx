/* ===========================================================
   FIREBASE BACKEND — auth + shared data, for the self-hosted site.

   Switches on when config/config.js has put a real config on the page:
       window.JAPAN2027_FIREBASE_CONFIG = { apiKey: …, projectId: … }

   With it on:
     · Sign-in is Firebase Auth (Google provider, popup).
     · The shared plan lives in Firestore at plan/board.
   With it off (the Claude artifact, or a local file):
     · The artifact's own store, then localStorage. Nothing changes.

   The compat SDK is used deliberately — its API is the one this app
   was already written against (doc / set / update / onSnapshot), and
   it needs no bundler. It is fetched only when config exists, so the
   artifact build never reaches for a script it isn't allowed to load.

   A Firebase web config is NOT a secret. It identifies the project;
   it doesn't authorise anything. What actually protects the data is
   firestore.rules, which pins writes to the nine signed-in emails.
   =========================================================== */

const FIREBASE_CONFIG = (typeof window !== "undefined" && window.JAPAN2027_FIREBASE_CONFIG) || null;
const FIREBASE_ON = !!(FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
const FB_VERSION = "12.19.0";
const FB_BASE = "https://www.gstatic.com/firebasejs/" + FB_VERSION + "/";
const PLAN_DOC = "plan/board";

let fbPromise = null;
function initFirebase() {
  if (fbPromise) return fbPromise;
  fbPromise = (async function () {
    if (!FIREBASE_ON) return null;
    // Each part needs its own readiness check — once the core is on the
    // page `window.firebase` is truthy, so a shared check would skip the
    // auth and firestore loads entirely.
    const parts = [
      ["firebase-app-compat.js", function () { const f = window.firebase; return f && f.initializeApp ? f : null; }],
      ["firebase-auth-compat.js", function () { const f = window.firebase; return f && f.auth ? f : null; }],
      ["firebase-firestore-compat.js", function () { const f = window.firebase; return f && f.firestore ? f : null; }]
    ];
    for (const part of parts) {
      const ok = await loadScript(FB_BASE + part[0], part[1]);
      if (!ok) return null;
    }
    try {
      const fb = window.firebase;
      if (!fb.apps.length) fb.initializeApp(FIREBASE_CONFIG);
      return { fb: fb, auth: fb.auth(), db: fb.firestore() };
    } catch (e) { return null; }
  })();
  return fbPromise;
}

/* A Firebase user, flattened into the shape the rest of the app uses. */
function fbUser(u) {
  if (!u) return null;
  return {
    sub: "firebase:" + u.uid,
    uid: u.uid,
    email: u.email || "",
    name: u.displayName || u.email || "Signed in",
    picture: u.photoURL || "",
    provider: "google"
  };
}

function FirebaseGoogleButton() {
  const S = useStore();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function signIn() {
    if (busy) return;
    setBusy(true); setErr("");
    initFirebase().then(function (f) {
      if (!f) { setBusy(false); setErr("Couldn't reach Firebase. Check your connection and try again."); return; }
      const provider = new f.fb.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      return f.auth.signInWithPopup(provider).then(function () { setBusy(false); });
    }).catch(function (e) {
      setBusy(false);
      const code = (e && e.code) || "";
      setErr(
        code === "auth/popup-closed-by-user" ? "Sign-in window closed before finishing."
        : code === "auth/unauthorized-domain" ? "This domain isn't on the Firebase authorised list yet."
        : "Sign-in didn't complete. Try again."
      );
    });
  }

  return (
    <div className="gbtn">
      <button className="btn google" onClick={signIn} disabled={busy}>
        <svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true" focusable="false">
          <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.5h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.6z"/>
          <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2a5.4 5.4 0 0 1-8-2.8H1.1v2.3A9 9 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M4 10.7a5.4 5.4 0 0 1 0-3.4V5H1.1a9 9 0 0 0 0 8l2.9-2.3z"/>
          <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 1.1 5L4 7.3A5.4 5.4 0 0 1 9 3.6z"/>
        </svg>
        {busy ? "Opening Google…" : "Sign in with Google"}
      </button>
      {err ? <span className="gerr">{err}</span> : null}
    </div>
  );
}
