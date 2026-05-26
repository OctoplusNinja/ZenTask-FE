# Handoff: ZenTask Product Page

## Overview

The marketing **Product page** for ZenTask — the page someone visits after the homepage when they want to see the actual product before signing up. Seven sections, each carrying one focused idea. The whole page is essentially "show, don't tell": product screenshots with thin captions.

## About the Design Files

The HTML in `reference/` is a **design reference** — a clickable prototype showing the intended look and structure. The "screenshots" inside it are hand-rendered HTML/CSS (not real product captures), so the layouts are intentionally robust to being swapped for real screenshots later.

Your task is to **recreate this page in your codebase's environment** (Next.js, Astro, etc.) using its existing UI primitives, routing, and image pipeline. When you have real product screenshots, swap them in for the HTML mocks — the section layouts won't need to change.

## Fidelity

**High fidelity.** All type, spacing, shadows, and motion specs below should be matched precisely. Map to your codebase's tokens; don't introduce new values.

---

## Route

```
/product   → ZenTask Product.html
```

Linked from the **Product** nav item on Landing and Pricing.

---

## Page structure (top → bottom)

1. **Hero** — headline + lede + a large product screenshot
2. **Kanban close-up** — "Boards that breathe" — cards in detail
3. **Keyboard / command palette** — "Stay in flow"
4. **Views switcher** — Kanban / List / Calendar / Timeline tabs
5. **Compare strip** — "Quiet by default" — typical PM vs ZenTask
6. **Collaboration** — "Built for teams" — cursors + comments
7. **Final CTA** — "Plan calmly. Ship anyway."

---

## Section 1 — Hero

### Copy

- **Eyebrow:** "Product" (sage soft-pill)
- **H1:** "Plan the work, then get back to it." — italic Fraunces accent on *"then get back to it."*
- **Lede:** "ZenTask is the Kanban for teams who'd rather think than triage. One workspace, four views, a keyboard for every action."

### Visual: faux dashboard

A **shot frame** with a chrome bar at the top:
- 3 grey traffic-light dots (10×10px, `--border-strong`, 55% opacity)
- A monospace URL: `zentask.app / Acme / Roadmap` (`--fg-subtle` slim, brand parts in `--fg-muted` 600)

Inside the frame, a **two-column dashboard mock**:
- 200px sidebar with workspace switcher, Nav (Dashboard / Boards [active] / My tasks / Inbox), and Boards group (Roadmap / Sprint 24 / Bug triage with different colored dots).
- Main area with header ("Roadmap · Q2 2026" + "+ New task" sage button) and 4 Kanban columns: Backlog (8), In progress (5), Review (3), Shipped (12) — each with 2–3 task cards showing title, tag chips, and assignee avatars.

Below 800px: sidebar hides, columns collapse to 2-up.

### Frame style

```
background: var(--bg-elevated)
border: 1px solid var(--border)
border-radius: 14px
box-shadow: var(--shadow-lg)
overflow: hidden
```

Chrome bar:
```
background: var(--bg-sunken)
border-bottom: 1px solid var(--border-subtle)
padding: 10px 14px
```

**When you have a real product screenshot:** drop it inside `.shot` and remove the `.hero-shot__body` mock — same outer frame.

---

## Section 2 — Boards that breathe

### Layout
Split (0.85fr text / 1.15fr visual) with text on the left, visual on the right. Stacks below 900px.

### Copy
- **Eyebrow:** "Kanban"
- **H2:** "Boards that *breathe.*" (italic accent on "breathe")
- **Body:** "Generous spacing, clear typography, and cards that hold the things you actually look at — assignee, priority, due date. Drag with the keyboard or the mouse. Whichever's closer."

### Visual
A 2-up grid (collapses to 1 below 600px) of detailed task cards inside a wrapper card:

**Card anatomy:**
- Top row: monospace task ID + priority chip ("High" with red-ish tint, "Med" sage soft)
- Title (13.5px / 600)
- Tag chips (10px, `--bg-sunken` background, sage-tinted ones for "design")
- Bottom row: due date with calendar icon + assignee avatar stack

**Drag state** (`.is-dragging`):
- `transform: rotate(-1.5deg) translateY(-3px)`
- `box-shadow: var(--shadow-md)`
- `border-color: var(--accent)`

---

## Section 3 — Stay in flow

### Layout
Reverse split (visual left, text right). Stacks below 900px.

### Visual: command palette

Card with `var(--shadow-lg)`, 14px radius, 520px max-width.

**Search bar** at top:
- Magnifying glass icon (16px, `--fg-subtle`)
- Input (15px, transparent, borderless) — pre-filled "new task"
- `⌘K` kbd chip on the right (mono 10.5px, `--bg-sunken`, 1px `--border`, 4px radius)

**Result list:**
- Section header "Actions" (10px tracked uppercase, `--fg-subtle`)
- Active row: sage-soft background, icon flipped to white-on-sage
  - "New task" + `⌘N` hint
- Plain row: "New board" + `⌘⇧N`
- Section header "Jump to"
- "Roadmap · board"
- "Sprint 24 · board"

### Copy
- **Eyebrow:** "Keyboard-first"
- **H2:** "Stay in *flow.*"
- **Body:** "Every action has a shortcut. ⌘K opens the palette — type what you want, hit return. Power users never need the mouse."

### Cheat-sheet (2-column grid)

| Action | Shortcut |
|---|---|
| Open palette | ⌘K |
| New task | ⌘N |
| Switch workspace | ⌘1–9 |
| Toggle sidebar | ⌘\ |
| Move card | ⌥←/→ |
| Assign to me | A · M |

Style: each row has `--fg-muted` label + mono kbd chip, separated by `--border-subtle` 1px lines.

---

## Section 4 — Views switcher

### Background
Subtle vertical gradient strip: `transparent → accent-soft 30% → transparent` to set this section apart.

### Header
Centered:
- **Eyebrow:** "Views"
- **H2:** "See it your way."
- **Body:** "Same tasks, four shapes. Plan in Kanban, review in List, schedule in Calendar, ship in Timeline."

### Tabs
Inline-flex pill toggle, `--bg-elevated` background, 1px `--border`, 999px radius. Four tabs: **Kanban / List / Calendar / Timeline**.

Animated sliding pill (`#views-pill`):
- `position: absolute`
- Slides via `transition: left 240ms ease-out, width 240ms ease-out`
- White background, `--shadow-xs`
- Recalculate on resize

### Four view panels (one visible at a time, others `hidden`)

**Kanban panel** — 4 Kanban columns inside a card (`var(--shadow-md)`). Collapses to 2-up below 720px.

**List panel** — 5-column table:
- Checkbox (32px) / Task / Status / Due / Assignee
- Header row: `--bg-sunken` background, uppercase tracked
- Rows: 12px padding, separated by `--border-subtle`
- Status chips: Backlog (plain), In progress (blue tint), In review (amber), Shipped (sage)
- Done rows: filled sage checkbox + strikethrough `--fg-subtle` title
- Below 720px: hide Due + Assignee columns

**Calendar panel** — 7-col grid, 14 day cells (110px tall, 80px on mobile):
- Header row with day abbreviations (Mon–Sun) in `--bg-sunken`
- Cells: day number top-left + 1–2 event chips below
- "Other month" cells: 60% opacity, `--bg-sunken`
- Today's number: `--accent` color
- Event chips: sage, blue, or amber tints

**Timeline panel** — Gantt-style:
- Header: W18–W25 across the top (140px label column on the left)
- 6 rows with task labels and absolute-positioned colored bars
- Bar colors: sage (default), blue, amber, ghost (25% sage for "Planned")
- Bars contain a label in white 11px (e.g. "Design", "Build", "Patch")
- Below 720px: 80px label column

### Switching behavior

```js
function setView(name) {
  tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.view === name ? 'true' : 'false'));
  panels.forEach(p => p.hidden = p.dataset.panel !== name);
  positionPill();
}
```

No fade animation between panels — the tab pill animates, the content swaps instantly. Keep it calm.

---

## Section 5 — Quiet by default

This is the **opinion section** — the differentiator. Don't soften it.

### Copy
- **Eyebrow:** "The Principle" (centered)
- **H2:** "Quiet by *default.*"
- **Lede:** "We removed the things that distract you from work. Then we removed a few more."

### Two side-by-side cards

**Left card — "A typical PM tool"** (the bad version):
- Diagonal red stripe overlay background (44° repeating, ~4% red, every 12px)
- Red eyebrow color (`oklch(48% 0.14 25)`)
- Each item has a red X icon
- Items:
  - "Notification badges on every menu item"
  - "Confetti when you check off a task"
  - "AI suggestions everywhere, all the time"
  - "Five colors of red, urgent, panic, mayday"
- Sample at bottom: a red pill badge with "12" and the literal text `🎉 Great job team! You're on fire! 🔥` — this is the ONE place emoji appears on the page; it's intentional irony.

**Right card — "ZenTask"** (the good version):
- Calm, no overlay
- Sage check icons
- Items:
  - "One inbox. Read it when you're ready."
  - "Tasks move quietly. The work is the reward."
  - "AI helpers exist. You opt in, not the other way around."
  - "Priority is a label, not a color war."
- Sample at bottom: monospace "3 updates · since Mon" with a quiet "Open inbox →" link

Both cards: 22px padding, 14px radius, `var(--shadow-sm)`.

---

## Section 6 — Built for teams

### Layout
Split (text left, visual right). Same as section 2 structure.

### Copy
- **Eyebrow:** "Collaboration"
- **H2:** "Built for *teams.*"
- **Body:** "See who's where, mention who needs to know, and ship together — without the noise. Multiplayer without the chaos."

### Visual

Wrapper card containing:
1. A task card (`.closeup__card`) with title "Workspace switcher dropdown", design+sidebar tags, due "Fri", three assignee avatars.
2. **Two live cursors** absolutely positioned inside the card:
   - "Marcus" — purple `oklch(60% 0.16 280)`, top-right area
   - "June" — amber `oklch(58% 0.14 50)`, bottom-center
   - Each: arrow SVG + colored pill with the name
3. **Two comments** below the card:
   - Marcus's: includes a `@June` mention chip (sage-soft background, sage text)
   - June's: short reply ("Looks great. Approved.")

Comment style:
- 28×28px circular avatar with initials in white
- Name (12.5px / 600) + timestamp (`--fg-subtle`)
- Body text 13px / 1.5
- Wrapper: `--bg` background, `--border-subtle` 1px, 10px radius, 12px / 14px padding

---

## Section 7 — Final CTA

Centered, generous vertical padding (~120px top, ~140px bottom).

- **H2:** "Plan calmly. *Ship anyway.*"
- **Lede:** "Free for teams up to 10. No credit card required."
- Two buttons:
  - **Primary** (sage filled) — "Get started" → `/signup?plan=free`
  - **Secondary** (outlined) — "See pricing" → `/pricing`

---

## Shared building blocks

### Brand mark icon

Three stacked diagonal rectangles in sage:

```html
<svg width="22" height="22" viewBox="0 0 64 64" fill="none">
  <rect x="8" y="8" width="48" height="13" rx="6.5" fill="currentColor"/>
  <rect x="2" y="25.5" width="60" height="13" rx="6.5" fill="currentColor" transform="rotate(-40 32 32)"/>
  <rect x="8" y="43" width="48" height="13" rx="6.5" fill="currentColor"/>
</svg>
```

### Avatar with initials

```css
.hs-av {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1.5px solid var(--bg);    /* halo for overlap stacks */
  font-size: 9px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center;
  margin-left: -6px;                 /* stacks negative-overlap */
}
.hs-av:first-child { margin-left: 0; }
```

Backgrounds for the four characters used throughout (June, Marcus, Rita, Sam):
- **JL** (June): `oklch(70% 0.12 50)` — amber/peach
- **MK** (Marcus): `oklch(68% 0.13 280)` — purple
- **RT** (Rita): `oklch(70% 0.13 180)` — teal
- **SC** (Sam): `oklch(72% 0.10 25)` — terracotta

White initials in all cases.

### Headline accent pattern

Every H1 and H2 includes one italicized **Fraunces serif** word for emphasis:

```css
.accent {
  font-family: var(--font-serif);   /* Fraunces */
  font-style: italic;
  font-weight: 400;
  font-size: 1.05em;
  color: var(--accent);              /* sage */
}
```

Used in: "*then get back to it.*", "*breathe.*", "*flow.*", "*default.*", "*teams.*", "*Ship anyway.*"

### Section eyebrows

Two flavors:
- `.eyebrow` — sage soft pill, used in the centered hero/h2 sections (Hero, Views, Principle, Final)
- `.eyebrow--plain` — no background, just tracked uppercase `--fg-subtle` text, used in the split sections (Kanban, Keyboard, Collaboration)

---

## Design tokens used

All from `reference/colors_and_type.css`.

**Color**
- `--bg`, `--bg-elevated`, `--bg-hover`, `--bg-sunken`
- `--fg`, `--fg-muted`, `--fg-subtle`
- `--border`, `--border-strong`, `--border-subtle`
- `--accent`, `--accent-soft`, `--accent-soft-fg`, `--sage-200`, `--sage-800`
- `--btn-primary-bg`, `--btn-primary-bg-hover`, `--btn-primary-fg`

**Radius**
- 4px — kbd chips, tag chips
- 6px — small dots, list checkboxes
- 7px — small CTA buttons
- 8px — nav cta, sidebar nav rows
- 10px — task cards, comments, palette rows
- 14px — section frames (shot, palette, view panels)
- 999px — pills, badges, avatars

**Shadow**
- `--shadow-xs` — task cards inside the dashboard mock, tab pill
- `--shadow-sm` — compare cards
- `--shadow-md` — view panels, collab card, dragging card
- `--shadow-lg` — hero shot, palette

**Type**
- `--font-sans` (Manrope) — UI text
- `--font-serif` (Fraunces) — italic accent words only
- `--font-mono` (JetBrains Mono) — URLs in chrome bars, kbd chips, timestamps in compare-card sample

**Motion**
- 80ms ease-out — button press scale
- 120ms ease-out — hover transitions
- 200ms ease-out — tab color
- 240ms ease-out — tab pill slide
- `--ease-out` token

---

## Behavior & interactions

The page is **mostly static**. The only interactive bits:

1. **Views tab switcher** — clicking a tab swaps the `[hidden]` panel and slides the pill. No URL state, no localStorage. Defaults to Kanban.
2. **Hover states** — buttons, nav links, CTAs all have subtle hover treatments (`--bg-hover`, `--border-strong`).
3. **Press scale** — primary buttons scale to 0.985 on `:active`.

No scroll-triggered animations. No parallax. The brand is calm; the page is calm.

---

## What's stubbed / TODO when porting

- **Real product screenshots** — replace the HTML mocks (hero dashboard, palette, view panels, collab card) with PNG/WebP captures from the real product. The frames around them (`.shot`, `.palette`, etc.) stay.
- **Real cursor positions** — the two cursors in the collaboration section are hard-positioned. If you do an animated version, drive them with a `<canvas>` or absolute-positioned divs animated on a 4–6s loop. Keep it slow and quiet.
- **Customer logos** — when you have permission to use real customer logos, consider adding a thin logo row above the Final CTA (NOT in the hero — keeps the hero focused).
- **"Customers" and "Changelog" nav links** — currently stub `#`. Build those next.
- **The "typical PM tool" sample text** — `🎉 Great job team! You're on fire! 🔥` is intentionally cringe to make the point. Keep it. Marketing may want to soften it; push back.
- **Accessibility:** The tab roles are wired (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`). Add keyboard nav (left/right arrows) when porting — the reference doesn't have this.

---

## Files in this handoff

```
design_handoff_product_page/
├── README.md                              ← this file
└── reference/
    ├── ZenTask Product.html
    └── colors_and_type.css                ← full token system
```

---

## Visual sanity check

Open the reference file in the source project. Confirm your implementation matches:

- Hero shot: traffic-light chrome, 4-col Kanban with cards that have IDs / tags / assignees.
- Boards section: the dragging card is rotated −1.5° with sage border + lifted shadow.
- Palette: ⌘K chip on the right, active row uses `--accent-soft` background with sage icon-bg.
- Views switcher: pill slides smoothly between tabs (240ms ease-out), each panel renders fully.
- Compare section: the red-card has a diagonal stripe pattern; the right card stays calm.
- Collab section: two cursor labels (Marcus purple, June amber) overlap the task card; mention chip in the comment is sage-soft.
- Final CTA: italic "Ship anyway." reads as one phrase with the upright "Plan calmly."
