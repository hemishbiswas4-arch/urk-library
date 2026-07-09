# The URK Library

A no-build, static web app for the team: a browsable 3D library where every reading
module from the prep dossier is a bookshelf and every reading is a book.

**How the room reads:**
- **Colour = module.** Each of the eight modules gets one hue from a validated,
  colourblind-safe palette, so a whole shelf is one identifiable colour (blue =
  "Know the competition", green = climate law, and so on).
- **Book size = reading depth.** The books you must read fully ([READ]) are the
  tallest; reference-only titles ([REF]) are slim. You can see your priorities
  from across the room.
- **Gold glow = done** (per person). **💬 / 📌 badges** = shared notes on a book or
  reminders pinned to a shelf.
- **Work desks** (uniform slate + oak, a deliberately different look from the
  colourful shelves) hold the tools: Fact Bank, Options Bank, Party Mastery,
  Vocabulary, Recency Checklist, 11-Day Plan, Rules & Rubric, priority reading list.

**Getting around:** click a shelf or desk to fly over, click a book to open it,
scroll/pinch to zoom, and use the **Directory** button (top-left) to jump straight
to any shelf or desk — it also shows each module's read-progress and a legend.
Everything (notes, checkmarks, the desk contents) is collaborative and syncs across
all three of you.

It works immediately with **zero setup** (each browser stores its own copy locally).
Follow the steps below to turn on **real-time sync across all three teammates'
devices** — free, takes about 10 minutes.

## 0. Try it locally right now

No install needed — it's plain HTML/CSS/JS. From this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. (Opening `index.html` directly via
`file://` won't work — ES modules require a real server.)

## 1. Turn on shared sync (Firebase, free tier)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** (any name, Google Analytics off is fine).
2. Inside the project: **Build → Firestore Database → Create database**. Choose a region close to you, start in **production mode**.
3. Go to **Firestore → Rules** and replace the contents with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

   This keeps it simple for a 3-person private tool — your Firebase project ID and
   collection names aren't public, and the app's PIN keeps casual visitors out of the
   *login screen*, though not out of the database directly. Don't put anything in
   here you wouldn't want technically-findable; for a competition prep dashboard
   that's a fine trade-off. (If you want it locked down harder, restrict `allow
   write` to require a `request.resource.data.author` field matching a known list —
   ask an AI coding assistant to tighten these rules if you want that.)

4. Back in the project overview, click the **`</>`** (web app) icon to register a new
   web app. Skip Firebase Hosting when asked. Copy the `firebaseConfig` object it
   shows you.
5. Open [`firebase-config.js`](firebase-config.js) in this folder and paste your
   real values in, replacing the `YOUR_...` placeholders.
6. Reload the app — the small status line under the login form should switch from
   "Running in local-only mode" to "Connected to shared backend".

That's it. `firebaseConfig` values are not secret for client web apps (Firebase's
security model relies on the Firestore rules above, not on hiding this config) —
it's safe to commit/deploy.

## 2. Put it online so everyone can reach it

Any static host works since there's no build step. Easiest options:

- **Netlify Drop** — go to [app.netlify.com/drop](https://app.netlify.com/drop) and
  drag this whole `aenc-dashboard` folder in. You get a live URL in seconds. Free.
- **Vercel** — `npx vercel` from this folder (needs Node, or use their web upload
  flow instead).
- **GitHub Pages** — push this folder to a repo, enable Pages on it, done.

Share the resulting URL with your teammates, along with the team PIN you agree on.

## 3. How login works

There's no real user/password system — it's a shared team PIN plus your name, which
is enough for a private 3-person tool:

- The **first** person to log in sets the team PIN (whatever they type becomes it).
- Everyone after must enter the same PIN to get in.
- Your name is just a label — pick something your teammates will recognize, and use
  the same one every time so your checkmarks and notes stay attributed to you.
- "Switch user" on a shared computer just clears *that browser's* remembered name —
  it doesn't log anyone out remotely.

## 4. One thing to check with the organisers

Rule 7.3 in the rulebook forbids teams from receiving "external advice or assistance
after the release of role allocations and Confidential Information." The dossier
already flags this as ambiguous for AI research tools generally — the same question
applies to a tool like this one if it was built or is still being edited after your
role allocation. Send the one-line clarification email the dossier suggests
(`elsa@nuslawclub.com`) before relying on this in the lead-up to the competition, and
stop editing/adding content through it once you're inside the actual rounds (it's a
prep tool, not something to have open during a session anyway — devices aren't
allowed in the room).

## Project structure

```
index.html          shell + login screen + HUD + side panel container
styles.css           all styling (dark/light aware)
firebase-config.js    your real Firebase config goes here (gitignored-worthy)
firebase-config.example.js   template/instructions
data/content.js       all dossier content — readings, links, plan, banks, vocab
data/tools.js         the 8 desk stations (Fact Bank, Rules, Plan, etc.)
data/palette.js       shared colour system — one hue per module, short shelf labels, legend
js/dataService.js     Firestore-or-localStorage abstraction
js/auth.js            name + shared-PIN login
js/store.js            shared reactive state (members, notes, progress, banks)
js/scene.js            the Three.js library — room, shelves, books, desks, camera, raycasting
js/panel.js             renders the side-panel content (reading detail, module reminders, desk tools)
js/utils.js             small formatting helpers
js/app.js               orchestrator — login flow, boots the store + scene, the Directory overlay
```

To edit content (add a reading, fix a link, adjust the plan), edit
[`data/content.js`](data/content.js) directly — it's plain JS objects/arrays, no
build step required. The 3D layout (room size, shelf/desk positions) lives in
[`js/scene.js`](js/scene.js).

Three.js loads from a CDN via an import map in `index.html` — no npm needed, same
no-build approach as everything else here.
