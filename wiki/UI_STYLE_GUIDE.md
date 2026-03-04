# UI Style Guide — Money Manager

Reference screenshots: `wiki/example-ui/`

---

## Design Language

**Editorial Minimalism / Swiss Brutalist**

Pure monochromatic palette, editorial typography with period punctuation, sharp geometry, generous whitespace. Zero decorative elements — every visual element carries meaning.

---

## Color Palette

| Role | Value |
|------|-------|
| Background | `#FFFFFF` (pure white) |
| Surface / Card | `#FFFFFF` with `1px solid #000` border |
| Foreground / Primary text | `#000000` (pure black) |
| Muted text | `#6B6B6B` (gray, for labels and secondary info) |
| Border | `#000000` (1px, no radius) |
| Primary action | `#000000` background + `#FFFFFF` text |
| Inactive toggle | `#FFFFFF` background + `#000000` text |

**No accent colors.** No gradients. No shadows.

> Exception: status indicators (income/expense amounts) may use a muted green/red only where functionally necessary — keep saturation very low.

---

## Typography

### Scale

| Element | Style |
|---------|-------|
| Page title | Bold, ~48–64px, ends with a period ("Transactions.") |
| Page subtitle | Regular, ~14px, muted gray, 1–2 lines |
| Section breadcrumb | Uppercase, ~11px, letter-spacing wide, preceded by a small black square ■ |
| Card section header | Uppercase, ~10–11px, letter-spacing wide, muted gray |
| Body / labels | Regular, ~14px |
| Data values (amounts, times) | Bold or Medium, ~28–36px — numbers are the hero |
| Footer / metadata | ~11px, muted gray |

### Rules
- Page titles always end with a **period** — "Dashboard.", "Transactions.", "History."
- Section labels (breadcrumbs) are **ALL CAPS** with wide letter spacing
- Font family: system sans-serif or a geometric sans (Inter, DM Sans) — match existing `styles.css`

---

## Layout

### Page Structure
```
■ SECTION NAME                           (breadcrumb, top-left)

Page Title.                              (large bold, left-aligned)
Short description sentence here.        (muted, left-aligned)

[Content area]

FOOTER METADATA         PAGE N — TOTAL  (bottom bar, left + right)
```

### Grid
- Left-aligned content (not centered), max-width ~900px
- Generous padding: `px-8 py-10` minimum
- No sidebar on mobile; sidebar collapses to top nav

---

## Components

### Cards / Containers

```
┌─────────────────────────────────────────┐  ← 1px solid black border
│  SECTION HEADER (uppercase, muted)      │  ← inner header section
├─────────────────────────────────────────┤  ← 1px divider
│  Content area                           │
│                                         │
│  LABEL           VALUE                  │
│  Large bold data                        │
└─────────────────────────────────────────┘
```
- **0px border-radius** (sharp corners)
- Inner sections separated by `1px solid #000` horizontal dividers
- Multiple columns inside a card use `1px solid #000` vertical dividers

### Input Fields
- **Underline only** — no box border
- Label: ALL CAPS, ~11px, above the input
- Placeholder: muted gray
- No rounded corners, no focus ring colors — use outline

### Buttons
- Full-width black rectangle, white text, ALL CAPS, ~13px letter-spacing wide
- No border-radius
- Hover: slight opacity reduction
- Secondary/ghost: white background + black border + black text

### Segmented Toggle
```
┌──────────────┬──────────────┐
│  ANDROID     │     IOS      │  ← active side: black bg + white text
└──────────────┴──────────────┘
```
- No border-radius
- Sharp fill swap, no animation

### List / Table Rows
- Bordered rectangle per row (1px black border)
- Label in muted uppercase top-left
- Large bold value bottom-left
- Secondary info right-aligned
- Consistent vertical rhythm — rows equal height

### Pagination
```
‹  ›                    01 — 83
```
- Minimal prev/next arrows (bordered square buttons)
- Page count bottom-right: `01 — TOTAL` style

### Status Badges
- Small rectangle, filled black, white uppercase text (e.g., "IN", "OUT", "OK")
- No rounded corners
- Placed inline at row start

---

## Page-Level Patterns

### List Pages (Transactions, History, Reports)
```
■ SECTION                               (breadcrumb)

Page Title.
Description.

[Row card]
[Row card]
[Row card]

‹  ›                        01 — N      (pagination)
FOOTER LABEL           SECONDARY INFO
```

### Form Pages (New Transaction, New Account)
```
■ SECTION                               (breadcrumb)

Form Title.
Helper description.

┌─────────────────────────────┐
│  SECTION LABEL              │
│  [segmented toggle]         │
├─────────────────────────────┤
│  FIELD LABEL                │
│  _________________________  │ (underline input)
├─────────────────────────────┤
│  ANOTHER FIELD    OPTIONAL  │
│  _________________________  │
└─────────────────────────────┘

┌─────────────────────────────┐
│  SUBMIT ACTION              │ (full-width black button)
└─────────────────────────────┘

ALL FIELDS REQUIRED UNLESS MARKED OPTIONAL   (footer note)
```

### Dashboard
- Grid of bordered stat cards
- Large numbers are the hero (total balance, monthly spend)
- Section headers in uppercase above each widget group
- Charts (if any): minimal, monochrome or very muted colors

---

## Tailwind v4 Token Mapping

Given the existing `styles.css` custom theme, map these design tokens:

```css
/* Override/extend in styles.css */
--radius: 0;               /* sharp corners everywhere */
--border: 1px solid #000;

/* Typography scale */
--display-font-size: 3.5rem;   /* page titles */
--label-font-size: 0.6875rem;  /* ALL CAPS labels */
--label-spacing: 0.1em;        /* letter-spacing */
```

Shadcn component overrides needed:
- `Button`: remove `rounded-md` → `rounded-none`, background black
- `Input`: underline only, remove border box
- `Card`: sharp corners, black border
- `Badge`: sharp corners, black fill

---

## Do's and Don'ts

| Do | Don't |
|----|-------|
| Use large bold numbers for key financial values | Use color-coding as primary communication |
| End page titles with a period | Use rounded corners |
| Use ALL CAPS for field labels and section headers | Add drop shadows or gradients |
| Use 1px black borders for containers | Use multiple font weights decoratively |
| Keep whitespace generous | Crowd the layout with too many elements per view |
| Make amounts the visual hero | Use icon-heavy design |
