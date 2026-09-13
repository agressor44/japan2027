# Putting Japan 2027 on a real domain

Everything here is free except the domain (~$10.44/yr). Budget about an hour.

Order matters: **Firebase project → Firestore → config.js → GitHub → domain.**
The domain is last on purpose — the site works on `japan2027.web.app` before it
ever has a name of its own.

---

## 1. Buy the domain — ~$10.44/yr

[Cloudflare Registrar](https://dash.cloudflare.com) sells at cost, with free WHOIS
privacy and free DNS, and no renewal price jump. Any registrar works, but if you
buy elsewhere you'll still want DNS somewhere you can add records freely.

Keep the tab — you'll come back in step 8.

---

## 2. Create the Firebase project

1. [console.firebase.google.com](https://console.firebase.google.com) → **Create a project**
2. Name it `japan2027` (the project *ID* is what matters — note it down, it may get a
   suffix like `japan2027-a1b2c` if the name is taken)
3. Google Analytics: **off**. Nothing here needs it.

Stay on the **Spark (free)** plan. Don't upgrade to Blaze — you don't need it, and
Blaze is what turns a mistake into a bill.

---

## 3. Turn on Google sign-in

**Build → Authentication → Get started → Sign-in method → Google → Enable.**

Set a support email (yours), then **Save**.

That's the whole auth setup. Firebase handles the OAuth dance, token verification and
sessions — which is exactly the part you don't want to hand-roll.

---

## 4. Create the database

**Build → Firestore Database → Create database**

- **Production mode** (locked by default — correct; the rules in step 5 open it up)
- Location: pick one near you, e.g. `us-central1`. **This cannot be changed later.**

---

## 5. Lock the database to the nine of you

Open the **Rules** tab in Firestore, delete what's there, and paste the contents of
[`firestore.rules`](./firestore.rules) from this repo. Before publishing, fill in the
`crew()` list with everyone's Google account emails:

```
function crew() {
  return [
    'adam.kraus44@gmail.com',
    'cristina@example.com',
    ...
  ];
}
```

Click **Publish**.

Without this the database is either wide open or fully closed. With it, only those
verified email addresses can read or write the plan — and everyone else, signed in or
not, gets nothing. Add a traveler later by editing this list and hitting Publish again.

---

## 6. Get the config into the site

**Project settings (gear icon) → General → Your apps → Web (`</>`) → Register app.**

Name it anything, skip Firebase Hosting setup on that screen, and copy the
`firebaseConfig` object it shows you.

Paste it into [`config.js`](./config.js), replacing every `PASTE_ME`.

This file is committed on purpose. A Firebase web config is public by design — it names
the project, it doesn't grant access. Step 5 is what protects the data. (The build fails
loudly if you forget and leave the placeholders in.)

---

## 7. Push to GitHub, and let it deploy itself

Create an empty repo, then from the project folder:

```bash
git init
git add .
git commit -m "Japan 2027 trip site"
git branch -M main
git remote add origin https://github.com/<you>/japan2027.git
git push -u origin main
```

Now connect the deploy pipeline. Easiest path, from that same folder:

```bash
npx firebase-tools login
npx firebase-tools init hosting:github
```

It will ask for the repo (`<you>/japan2027`), create a service account, and set the
GitHub secret for you. When it offers to overwrite the existing workflow file,
**say no** — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) is already
written.

<details>
<summary>Manual alternative, if you'd rather not install the CLI</summary>

1. [Google Cloud console](https://console.cloud.google.com) → your project →
   **IAM & Admin → Service Accounts → Create**
2. Grant it **Firebase Hosting Admin** and **API Keys Viewer**
3. **Keys → Add key → JSON**, download it
4. GitHub repo → **Settings → Secrets and variables → Actions**
   - **New repository secret**: name `FIREBASE_SERVICE_ACCOUNT`, value = the entire JSON file
   - **Variables tab → New variable**: name `FIREBASE_PROJECT_ID`, value = your project ID
</details>

From here, **every push to `main` builds and deploys automatically.** Watch it under the
repo's Actions tab. The site goes live at `https://<project-id>.web.app`.

Open it and sign in — it should work completely before you touch DNS.

---

## 8. Point the domain at it

**Firebase console → Hosting → Add custom domain**, enter your domain, and Firebase
gives you records to create.

Over in **Cloudflare → your domain → DNS**, add exactly what Firebase asked for —
usually a `TXT` record to verify ownership, then two `A` records.

> **The one that catches everyone:** set those records to **DNS only** (click the orange
> cloud so it turns grey). If Cloudflare proxies them, Firebase can't complete its SSL
> challenge and the domain sits on "needs setup" indefinitely.

Certificates take anywhere from a few minutes to a day. Nothing is broken while it waits.

Last step, and it's easy to miss: **Authentication → Settings → Authorized domains →
Add domain**, and add your new domain. Google sign-in will refuse to run on a domain
that isn't on that list.

---

## What it costs

| | |
|---|---|
| Domain | ~$10.44/yr |
| Hosting — 10 GB storage, 360 MB/day transfer | $0 |
| Auth — 50k monthly users | $0 |
| Firestore — 50k reads + 20k writes/day, 1 GB | $0 |

At nine people this isn't close to the free limits. The daily transfer allowance alone
covers roughly 1,400 cold page loads a day.

---

## Making changes from here on

**From Claude** — I can push straight to the GitHub repo, and the Action deploys it.
Two things to know: this sandbox can only reach `github.com`, so GitHub is the only
route; and the sandbox is wiped between sessions, so credentials have to be handed over
again each time. Say the word when you want that set up.

**Yourself** — edit, `git push`, done.

**Locally, before pushing:**

```bash
node build.mjs        # writes build/ (artifact) and site/ (real site)
npx firebase-tools serve --only hosting
```

---

## Where things live

| Path | What it is |
|---|---|
| `src/1*-data-*.jsx` | All trip content — days, food, bookings, crew, survey questions |
| `src/15-auth.jsx` | Sign-in screen and the Google / Apple / household providers |
| `src/16-firebase.jsx` | Firebase adapter — auth + Firestore |
| `src/20-lib.jsx` | Shared store, dates, routing |
| `src/5*-page-*.jsx` | One file per page |
| `src/styles.css` | The whole design system |
| `config.js` | Your Firebase config |
| `firestore.rules` | Who can read and write |

The same source builds both the Claude artifact and the real site. With no
`config.js` values filled in it falls back to the artifact's store, so the version
in Claude keeps working exactly as it does now.

## Adding Apple sign-in later

The code is written and dormant in `src/15-auth.jsx`. Turning it on needs an
[Apple Developer Program membership](https://developer.apple.com/programs/enroll/)
at **$99/yr** — Sign in with Apple on the web requires a Services ID, which only
exists inside a paid account. Once enrolled: enable Apple in Firebase Auth's sign-in
methods, create the Services ID and key in the Apple developer portal, and point its
return URL at `https://<project-id>.firebaseapp.com/__/auth/handler`.
