# Handoff: ZenTask Marketing & Auth Pages

## Overview

Three public-facing pages for ZenTask: a **landing page** with sign-in, a **pricing page** with three plans plus an Enterprise tier, and a **two-step sign-up flow** (account → workspace setup). All three share the same brand voice, design tokens, and visual language.

## About the Design Files

The HTML files in `reference/` are **design references** — a clickable prototype showing the intended look and flow. They are not production code to drop in. Your task is to **recreate these pages in your codebase's existing environment** (Next.js, Astro, Remix, etc.), using its routing, form libraries, auth provider, and any UI primitive library already in place. If no UI primitives exist, build against your project's stack and conventions.

## Fidelity

**High fidelity.** Recreate pixel-perfectly using your codebase's design tokens. If your tokens differ from the ones listed, map them to the closest equivalent rather than inventing new values.

---

## Routes & flow

```
/                  → ZenTask Landing.html       (hero + sign-in card)
/pricing           → ZenTask Pricing.html       (3 tiers + Enterprise)
/signup            → ZenTask Sign Up.html       (account → workspace)
/signup?plan=free
/signup?plan=starter
/signup?plan=business
/dashboard         → existing dashboard (out of scope here)
```

### Navigation graph

```
Landing  ── "Sign in" form ──────────────────────→  Dashboard
   │
   ├── "Get started" (nav CTA)  ───────────────→  Pricing
   ├── "Pricing" (nav link)     ───────────────→  Pricing
   └── "Start free" footer link of sign-in card → Sign Up (?plan=free)

Pricing  ── "Get started" (Free)       ────────→  Sign Up (?plan=free)
   ├──── "Start with Starter"          ────────→  Sign Up (?plan=starter)
   ├──── "Start with Business"         ────────→  Sign Up (?plan=business)
   └──── "Talk to sales" (Enterprise)  ────────→  Sales contact flow (stub)

Sign Up  ── Step 1 (account) submit  ──────────→  Step 2 (workspace)
   ├──── OAuth (Google / SSO)         ────────→  Step 2 (workspace)
   ├──── Step 2 submit                ────────→  Dashboard
   └──── "Already have an account? Sign in"  ──→  Landing
```

**Key principle:** the nav CTA is **"Get started"** (plan-neutral) and routes to **Pricing** — we want users to see the tiers before signing up. Only the sign-in card's footer link and the Pricing CTAs bypass that.

---

## Page 1 — Landing

### Layout

Two-column grid (1.05fr / 0.95fr), centered in a 1280px max-width container, gap clamps from 40px to 96px. Stacks vertically below 900px.

### Left column (editorial)

- **Beta pill** — small chip with sage "NEW" badge, label, and `→` icon. Background `--bg-elevated`, border `--border`, shadow `--shadow-xs`.
- **Headline H1** — `clamp(40px, 5.5vw, 68px)`, line-height 1.02, letter-spacing −0.035em, weight 700.
  - Includes an italic accent word in **Fraunces serif** (`var(--font-serif)`), weight 400, font-size 1.05em, color `--accent`.
  - Example: `A <em>calmer</em> place to plan the work.`
- **Lede** — 17px / 1.55 / `--fg-muted`, max-width 480px, `text-wrap: pretty`.
- (Commented out for now: "Trusted by teams at" row — restore when you have real logos.)

### Right column (sign-in card)

A 440px-max card, `--bg-elevated`, 1px `--border`, `--shadow-lg`, 16px radius, 36px / 28px padding.

**Contents top→bottom:**
1. **Brand mark** in a 40×40px sage-soft square (rounded 10px).
2. **Title** — "Sign in to ZenTask" (22px / 700 / −0.025em).
3. **Sub** — "Welcome back. Pick up where you left off." (13.5px / `--fg-muted`).
4. **OAuth buttons** — "Continue with Google" (with multi-color Google glyph) and "Continue with SSO" (lock icon). 10px radius, `--bg` background, hover swaps to `--bg-hover` + `--border-strong`.
5. **Divider** — "OR" with `--border-subtle` lines on either side, 11px uppercase tracked text.
6. **Email field** — 10px radius input, focuses with `--shadow-focus` (sage 3px ring) and `--border-focus`.
7. **Password field** — same, plus a "Forgot?" link on the right of the label row.
8. **"Keep me signed in" checkbox** — sage accent-color.
9. **Submit button** — full-width sage primary button (`--btn-primary-bg`), 10px radius, with `→` icon.
10. **Footer** — separated by `--border-subtle`, centered "New to ZenTask? **Start free**" link (links to `/signup`).

### Background

Two subtle radial gradients of `--accent-soft` at top-left (1100×600 at 12% −20%) and bottom-right (900×500 at 92% 110%). Brand guideline: max 6% saturation across the surface — these gradients fade into transparency.

### Nav

Centered brand mark on the left, link list ("Product / Pricing / Customers / Changelog") in the middle (hidden below 900px), **"Get started"** sage primary button on the right. The CTA routes to `/pricing`.

---

## Page 2 — Pricing

### Layout

Single column, max-width 1200px, centered. Below 960px the tier grid collapses to single-column at 440px max.

### Header

Centered, 720px max.

- **Eyebrow pill** — small "PRICING" chip (`--accent-soft`, sage text).
- **H1** — "Pay for the *people*, not the projects." (italic serif on "people").
- **Lede** — "Per-member pricing. Unlimited workspaces on every paid plan. Cancel anytime."

### Billing toggle

Inline-flex pill toggle, `--bg-elevated`, 1px border, 999px radius. Two buttons:
- **Monthly** (active by default)
- **Annual** — with a small "−20%" save tag (`--accent-soft`)

An animated pill (`#billing-pill`) slides between buttons (`transition: left 240ms ease-out`). On change, prices swap between `data-price-monthly` and `data-price-annual` attributes on the `.tier__amount` element. Below each price, the "Billed monthly. Switch anytime." caption swaps to "Billed annually. Save 20%."

### Tier grid

Three columns, equal-height cards, 16px gap.

| Tier | Headline price (monthly) | Annual | Featured? |
|---|---|---|---|
| **Free** | $0 forever | — | no |
| **Starter** | $8 / member / mo | $6 | **yes** ("Most popular" badge) |
| **Business** | $14 / member / mo | $11 | no |

**Featured tier (Starter):** sage 1px border + `inset 0 0 0 1px var(--accent)` + `--shadow-md`. A small "MOST POPULAR" badge sits at top-center, anchored `top: -10px`. Its primary CTA is sage-filled.

**Card anatomy (top→bottom):**
1. Tier name (15px / 700)
2. Pitch (13px / `--fg-muted`, 1.5 line-height, ~39px min-height for alignment)
3. Price row — `$` (22px), big number (44px / 700 / −0.04em / tabular-nums), then unit ("per member / month" or "forever")
4. Billing caption (11.5px / `--fg-subtle`)
5. CTA button — outlined except featured tier
6. Divider — "Everything in {previous tier}, plus" (10.5px uppercase tracked)
7. Feature list — check icon (sage) + label, 13px / 1.5

**Free features:** 1 workspace, 10 members, unlimited boards & tasks, kanban/list/calendar views, 14-day activity history.

**Starter:** unlimited workspaces, 50 members/workspace, custom workflows & automations, weekly auto-summaries (beta), unlimited history, priority email support.

**Business:** unlimited members, SAML SSO & SCIM, audit log + admin roles, cross-workspace reporting, guest access, 99.9% SLA.

### Enterprise strip

Below the tier grid, a wider single card (1.4fr / 1fr two-column at >760px, single-column below):

- Left: "Enterprise" eyebrow, "For larger teams with custom needs." h3, paragraph, two CTAs ("Talk to sales" primary + "Download security pack" outlined).
- Right: 2-col feature grid — custom data residency, dedicated CSM, custom MSA & DPA, SOC 2 Type II & HIPAA, annual invoicing, onboarding & training.

### Footnote

Centered, 13px, `--fg-muted`: "Prices in USD. See full feature comparison · Read pricing FAQs"

---

## Page 3 — Sign Up

### Layout

Single centered column, 520px max-width. Steps swap inside the same card via show/hide, with a 220ms fade+translate animation on each panel.

### Nav

Brand mark on the left links to `/`. On the right, a quiet "Already have an account? **Sign in**" link (no button — the sign-in flow is on `/`, not here).

### Step indicator

Horizontal: `[1] Account ── [2] Workspace`.

- Active step: filled sage dot, `--fg` label.
- Done step: sage-soft dot with sage text, `--fg-muted` label.
- Future step: outlined dot, `--fg-subtle` label.
- 28px-wide connector line, `--border` color.

Transitions: 200ms ease-out on all properties.

### Step 1 — Account

Same card style as the sign-in card on the landing.

- Brand mark + "Create your account" + sub-copy.
- Sub-copy is **plan-aware**: reads `?plan=` from URL, swaps among:
  - `free` (default): "Start on the Free plan. Upgrade your workspace anytime."
  - `starter`: "Starting on the Starter plan — $8 per member / month."
  - `business`: "Starting on the Business plan — $14 per member / month."
- **OAuth** — "Sign up with Google" + "Sign up with SSO". Clicking either skips straight to Step 2.
- **Divider** — "OR".
- **Fields** — Name, Work email, Password (8+ chars).
- **Terms checkbox** — required; links to Terms / Privacy.
- **Continue button** — sage primary, full-width.
- **Footer** — "Already have an account? **Sign in**" → `/`.

### Step 2 — Workspace setup

- Workspace icon mark (board-style svg) in the sage-soft square.
- Title: "Set up your workspace".
- Sub: "A workspace is where your team lives. You can rename it or invite people anytime."
- **Workspace name** — text input, autocomplete="organization".
- **Workspace URL** — composite input with a `--bg-sunken` "zentask.app/" prefix and a monospaced slug input. The slug **auto-derives** from the name (lowercase, kebab-case, ASCII only) **until the user edits it manually**, after which it sticks. Pattern: `[a-z0-9-]+`.
- **Starter template picker** — 2×2 grid of toggle buttons (`role="radiogroup"`, `aria-pressed` on each):
  - Roadmap (default) — "Quarterly themes, in progress, shipped."
  - Sprint — "Backlog, this week, doing, done."
  - Marketing calendar — "Ideas, drafting, scheduled, live."
  - Blank — "An empty board. Roll your own."
  - Selected state: sage border + `--accent-soft` background + 1px sage inset ring. Icon avatar background flips to white when selected.
- **Actions** — "Back" (ghost, outlined) + "Create workspace" (sage primary, takes remaining width).

### Pre-fill behavior (nice touch)

When the user submits Step 1, if the workspace name field is empty, derive it from the email's domain:

```
"alex@acme.com"  →  name: "Acme",  slug: "acme"
```

Domain → first label, capitalized. Slug → same, lowercased and ASCII-cleaned.

### Auto-slug logic

```js
slug = name
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');
```

Track a `slugTouched` flag — once the user types in the slug input, stop auto-deriving.

### Submit behavior

Step 1 submit → goes to Step 2 (plus the pre-fill if applicable), scrolls to top smoothly.
Step 2 submit → `/dashboard`.
"Back" → goes to Step 1 (state preserved — both panels live in DOM, just hidden).

---

## Shared design tokens

All from `reference/colors_and_type.css`.

**Color**
- `--bg`, `--bg-elevated`, `--bg-hover`, `--bg-sunken`
- `--fg`, `--fg-muted`, `--fg-subtle`
- `--border`, `--border-strong`, `--border-subtle`, `--border-focus`
- `--accent` (sage 500), `--accent-soft`, `--accent-soft-fg`
- `--btn-primary-bg`, `--btn-primary-bg-hover`, `--btn-primary-bg-pressed`, `--btn-primary-fg`

**Radius**
- 8px — small buttons, nav CTA, oauth buttons
- 10px — primary buttons, inputs, sub-cards
- 12px — small cards (template tiles)
- 16px — auth card, tier card, enterprise card
- 999px — pills, billing toggle, badges, checkboxes

**Shadow**
- `--shadow-xs` — pill chips
- `--shadow-sm` — featured-tier badge
- `--shadow-md` — featured tier card
- `--shadow-lg` — auth card, signup card
- `--shadow-focus` — input focus ring (sage 3px)

**Type**
- `--font-sans` (Manrope) — UI text
- `--font-serif` (Fraunces) — italic accent words only
- `--font-mono` (JetBrains Mono) — URL slug input, future shortcut hints

**Motion**
- 80ms ease-out — button press scale (0.985)
- 120ms ease-out — hover state transitions (bg, border)
- 160ms ease-out — borders on cards
- 200ms ease-out — step indicator
- 220ms ease-out — panel fade-in (translate 4px + opacity)
- 240ms ease-out — billing pill slide
- `--ease-out` token

---

## State

All three pages are mostly stateless except:

**Pricing**
- `billingPeriod: 'monthly' | 'annual'` — local; could be persisted to localStorage if you want it to survive page reloads.

**Sign Up**
- `currentStep: 1 | 2`
- `slugTouched: boolean` (auto-derive guard)
- `selectedTemplate: 'roadmap' | 'sprint' | 'marketing' | 'blank'`
- All form values — in real implementation, lift to a multi-step form library (React Hook Form, Formik, or your codebase's equivalent).

---

## What's stubbed / TODO when porting

- **Real OAuth** — Google and SSO buttons currently just navigate. Wire to your auth provider (NextAuth, Clerk, Auth0, etc.).
- **Form validation** — uses native HTML5 only. Add proper inline error messaging + a password-strength indicator.
- **Sign-up actually creating an account** — the current Step 2 submit just navigates to `/dashboard`. In production this needs to: create user → create workspace → seed starter board → log them in → redirect.
- **Plan persistence** — `?plan=…` query is read but never stored. When the user finishes signup, your backend needs to receive the plan choice and provision accordingly. For paid plans (Starter, Business) you'll also need to insert a Stripe checkout step between Step 2 and dashboard.
- **"Talk to sales" / "Download security pack"** — both stubs. Wire to HubSpot, Pipedrive, or a contact form.
- **Activity-history limit, member limits, etc.** — these are positioned as plan-gated features. Your backend needs to enforce them; the UI inside the dashboard needs to nudge users to upgrade when they hit a wall.

---

## Icons

The reference uses inline SVGs (Lucide-style 1.75px stroke, 24-unit viewBox). When porting, swap to your icon library:

| Inline | Lucide | Used in |
|---|---|---|
| arrow-right svg | `ArrowRight` | hero pill, CTAs |
| arrow-left svg | `ArrowLeft` | "Back" button |
| check (2.5px stroke) | `Check` | feature lists, selected templates |
| lock | `Lock` | "Sign up with SSO" |
| chart/wave | `TrendingUp` | Roadmap template |
| clock | `Clock` | Sprint template |
| calendar | `Calendar` | Marketing calendar template |
| square | `Square` | Blank template |
| board | `LayoutGrid` or `Columns` | workspace-setup card icon |
| ZenTask mark | custom — three stacked diagonal rectangles. Lift from any of the reference files. |

---

## Files in this handoff

```
design_handoff_marketing/
├── README.md                                ← this file
└── reference/
    ├── ZenTask Landing.html
    ├── ZenTask Pricing.html
    ├── ZenTask Sign Up.html
    └── colors_and_type.css                  ← full token system
```

---

## Visual sanity check

Open each reference file in the source project to confirm your implementation matches:

- Landing: type kerning is tight, italic serif "calmer" reads clearly, sign-in card's shadow has the right softness.
- Pricing: the Monthly/Annual pill slides smoothly (240ms), prices swap on toggle, the Starter tier sits visually forward.
- Sign Up: step indicator transitions correctly, slug auto-fills from name, OAuth click jumps to Step 2 without flashing Step 1's submit state.
