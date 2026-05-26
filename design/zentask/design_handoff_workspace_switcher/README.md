# Handoff: Workspace Switcher Dropdown

## Overview

A functional workspace switcher in the ZenTask sidebar. The trigger sits at the top of the left rail (under the brand mark) and opens a dropdown menu listing the user's workspaces, plus quick actions: create workspace, invite teammates, jump to workspace settings, and log out.

This replaces a previously non-interactive button that just displayed the active workspace's name.

## About the Design Files

The files in `reference/` are **design references created in HTML/JSX** — a prototype showing the intended look and behavior. They are not production code to drop in. Your task is to **recreate the dropdown in your codebase's existing environment** (React, Vue, Svelte, etc.), using its established component primitives (Menu, Popover, DropdownMenu, etc.), routing, and state. If no UI primitive library exists, build it against your project's stack and conventions.

## Fidelity

**High fidelity.** Exact colors, type, spacing, shadows, and transitions are specified below. Recreate pixel-perfectly using your codebase's design tokens — if your tokens differ from the ones listed, map them to the closest equivalent rather than introducing new values.

---

## The Component

### Trigger button

A pill-shaped button that fills the sidebar width (with 8px horizontal padding inside the sidebar's 244px column).

| Property | Value |
|---|---|
| Width | 100% of container (sidebar width − 16px) |
| Padding | 7px 10px |
| Border radius | 8px |
| Border | 1px solid `--border` (closed) → `--border-strong` (open) |
| Background | `--bg-elevated` (closed) → `--bg-hover` (open) |
| Transition | `background 120ms ease-out, border-color 120ms ease-out` |
| Cursor | pointer |

**Contents (left → right, 8px gap):**
1. **Workspace avatar** — 22×22px rounded square (`border-radius: 6px`), tinted background with single letter inside (font-weight 700, size 11px, color matches tint).
2. **Workspace name** — flex:1, `font-size: 12.5px`, `font-weight: 600`, color `--fg`, truncates with ellipsis.
3. **Chevron-down icon** — 14px, color `--fg-subtle`, rotates 180° when menu is open (`transition: transform 160ms ease-out`).

**ARIA:** `aria-haspopup="menu"`, `aria-expanded={open}`.

### Dropdown panel

Absolutely positioned, anchored to the trigger.

| Property | Value |
|---|---|
| Position | `position: absolute; top: calc(100% - 2px); left: 8px; right: 8px;` |
| z-index | 50 |
| Background | `--bg-elevated` |
| Border | 1px solid `--border` |
| Border radius | `--radius-lg` (12px) |
| Shadow | `--shadow-lg` |
| Padding | 6px |
| Animation | 120ms ease-out fade-in (`from { opacity: 0 } to { opacity: 1 }`) |
| Transform origin | top center |

**Width:** matches the trigger (16px less than sidebar width). Do not exceed the sidebar edges.

### Panel contents (top → bottom)

**1. Section label**
- Text: "Workspaces"
- Padding: 6px 10px 4px
- Font: 10.5px / 700 / uppercase / letter-spacing 0.08em
- Color: `--fg-subtle`

**2. Workspace rows** (one per workspace)

Each row is a `button` with `role="menuitemradio"` and `aria-checked` set on the active row.

| Property | Value |
|---|---|
| Layout | flex, align-items: center, gap: 10px |
| Padding | 8px |
| Border radius | 8px |
| Background | transparent → `--bg-hover` on hover |
| Cursor | pointer |

**Contents:**
- **Avatar** — 28×28px rounded square (`border-radius: 7px`), same tint system as trigger.
- **Stacked text** (flex: 1, min-width: 0):
  - Line 1 — name. Font 12.5px / 600 / line-height 1.25, color `--fg`. Ellipsis on overflow.
  - Line 2 — `{plan} · {memberCount} member(s)`. Font 11px / line-height 1.35, color `--fg-subtle`. Use "1 member" (singular) vs "N members" (plural).
- **Right slot:**
  - If active → check icon (14px) in `--accent` color.
  - If inactive → keyboard shortcut hint: monospace 10px text "⌘1", "⌘2", "⌘3" (use the actual ⌘ glyph, U+2318). Wrapped in a tiny chip: 1px 5px padding, `border-radius: 4px`, 1px border `--border`, background `--bg-sunken`, color `--fg-subtle`, font-family `--font-mono`, letter-spacing 0.04em.

**3. Divider** — 1px high, `--border-subtle`, 6px vertical margin, 4px horizontal margin.

**4. Action rows** — three rows, each `role="menuitem"`:

| Icon | Label | Subtitle | Action |
|---|---|---|---|
| `plus` | Create workspace | "Spin up a new space for another team or project." | Opens create-workspace flow |
| `users` | Invite teammates | — | Opens invite modal |
| `settings` | Workspace settings | — | Navigates to Settings panel |

Row layout: flex, align-items: flex-start, gap 10px. Icon column is 28px wide (height 28px if subtitle present, 22px if not), icon 16px in `--fg-muted`. Label 12.5px / 600. Subtitle 11px / line-height 1.4 / `--fg-subtle`, 2px top margin.

**5. Second divider** — same as above.

**6. Log out row** — same structure as action rows but with `icon="arrow_rt"` and muted styling: label color `--fg-muted`, icon color `--fg-subtle`. No subtitle.

---

## Behavior

| Interaction | Result |
|---|---|
| Click trigger | Toggle open/closed |
| Click workspace row | Set active workspace, close menu |
| Click action row | Run action, close menu |
| Click outside panel | Close menu (`mousedown` listener on document, scoped while open) |
| Press **Esc** | Close menu (`keydown` listener on document, scoped while open) |
| Open state change | Chevron rotates 180°, border + bg of trigger swap to "open" tokens |

**Not yet wired (call out to PM/design before implementing):**
- The ⌘1 / ⌘2 / ⌘3 keyboard shortcuts are shown as hints but **not bound** in the reference. Decide whether to actually register them.
- "Create workspace" and "Invite teammates" need real flows — the reference just closes the menu.
- "Log out" needs to be wired to your auth system.

---

## State

Local component state — no global store needed.

```
open: boolean                    // dropdown visibility
activeWorkspaceId: string        // which workspace is selected
```

The active workspace lives in the switcher in the reference; in your codebase, lift it to whatever holds the current workspace context (auth context, workspace provider, router param).

---

## Data shape

```ts
type Workspace = {
  id: string;
  name: string;
  plan: 'Free' | 'Starter' | 'Business' | 'Enterprise';
  members: number;
  initial: string;        // single uppercase letter for the avatar
  tint: 'sage' | 'amber' | 'slate' | ...;  // avatar color key
};
```

Reference seed (replace with real data):

```js
[
  { id: 'acme',   name: 'Acme Co.',         plan: 'Business', members: 24, initial: 'A', tint: 'sage' },
  { id: 'studio', name: 'Northwind Studio', plan: 'Starter',  members: 6,  initial: 'N', tint: 'amber' },
  { id: 'side',   name: 'Side projects',    plan: 'Free',     members: 1,  initial: 'S', tint: 'slate' },
]
```

Avatar tint palette (oklch). Add more as needed — keep them muted; the ZenTask brand uses one saturated accent (sage) and everything else stays quiet.

| Tint  | Background                | Foreground               |
|-------|---------------------------|--------------------------|
| sage  | `var(--sage-200)`         | `var(--sage-800)`        |
| amber | `oklch(92% 0.06 75)`      | `oklch(38% 0.10 75)`     |
| slate | `oklch(92% 0.012 250)`    | `oklch(38% 0.04 250)`    |

---

## Design tokens used

All from `reference/colors_and_type.css`. Use the matching tokens in your codebase.

**Color**
- `--bg-elevated`, `--bg-hover`, `--bg-sunken`
- `--fg`, `--fg-muted`, `--fg-subtle`
- `--border`, `--border-strong`, `--border-subtle`
- `--accent` (sage 500), `--sage-200`, `--sage-800`

**Radius**
- 4px (shortcut chip)
- 6px (trigger avatar)
- 7px (menu-row avatar)
- 8px (trigger button, menu rows)
- `--radius-lg` = 12px (dropdown panel)

**Shadow**
- `--shadow-lg` (dropdown panel)

**Type**
- `--font-sans` (Manrope) — UI text
- `--font-mono` (JetBrains Mono) — shortcut hints
- Sizes: 10px, 10.5px, 11px, 12.5px
- Weights: 600, 700

**Motion**
- 120ms ease-out — hover transitions, panel fade-in
- 160ms ease-out — chevron rotation
- `--ease-out` token

---

## Icons

From the project's icon set (Lucide-style 1.5px stroke, 24-unit viewBox). The reference defines them inline in `reference/icons.jsx`; in your codebase use Lucide React (or equivalent):

| Reference name | Lucide equivalent |
|---|---|
| `chevdown`  | `ChevronDown` |
| `check`     | `Check` |
| `plus`      | `Plus` |
| `users`     | `Users` |
| `settings`  | `Settings` |
| `arrow_rt`  | `ArrowRight` (used for "Log out") |

All icons render at 14–16px, color inherited from parent (`currentColor`).

---

## Accessibility

- Trigger: `aria-haspopup="menu"`, `aria-expanded={open}`.
- Panel: `role="menu"`.
- Workspace rows: `role="menuitemradio"`, `aria-checked={isActive}`.
- Action rows: `role="menuitem"`.
- Esc closes the menu; outside-click closes the menu.
- Focus ring on all buttons must use the design system's `--shadow-focus` (3px sage ring) — do not strip the outline. The reference relies on the base button styles; verify this carries through your component primitives.
- When opened via keyboard, focus should move into the menu (first workspace row). Reference does not implement this — please add when porting.

---

## Files in this handoff

- `reference/Sidebar.jsx` — the React reference with `WorkspaceSwitcher`, `WsAvatar`, `WsMenuRow`, plus the surrounding sidebar for context.
- `reference/icons.jsx` — the icon set used in the reference (Lucide-style paths).
- `reference/colors_and_type.css` — full design-system tokens (color, type, spacing, radius, shadow, motion). Maps to your codebase's token layer.

---

## Visual sanity check

Open the live prototype (`ZenTask Dashboard.html` in the source project) and click "Acme Co." in the sidebar. Confirm your implementation matches:
- Trigger border + background swap on open
- Chevron rotates smoothly
- Active row shows sage check; inactive rows show monospace ⌘N chip
- Panel fades in over ~120ms
- Esc and outside-click both close it
- Menu width matches the trigger width exactly (no overflow past the sidebar)
