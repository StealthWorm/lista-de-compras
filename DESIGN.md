---
name: Lista de Compras
description: A one-hand shopping list on warm paper, kept in this browser.
colors:
  clay: '#d96b43'
  moss: '#4a5d4e'
  moss-deep: '#2f3e33'
  sand: '#f5f2eb'
  sand-soft: '#e8e2d5'
  ink: '#2b2d2f'
typography:
  display:
    fontFamily: 'Bricolage Grotesque, sans-serif'
    fontSize: 'clamp(2.5rem, 7vw, 3.4rem)'
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: '-0.03em'
  title:
    fontFamily: 'Atkinson Hyperlegible, sans-serif'
    fontSize: '1.35rem'
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: 'Atkinson Hyperlegible, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: 'Atkinson Hyperlegible, sans-serif'
    fontSize: '1rem'
    fontWeight: 700
    lineHeight: 1.45
rounded:
  badge: '1.15rem'
  control: '0.95rem'
  field: '0.9rem'
  step: '0.7rem'
spacing:
  inset: '1.25rem'
  stack: '1.75rem'
  cluster: '1.15rem'
components:
  button-primary:
    backgroundColor: '{colors.clay}'
    textColor: '{colors.sand}'
    rounded: '{rounded.control}'
    padding: '0.85rem 1.2rem'
  button-primary-hover:
    backgroundColor: 'color-mix(in srgb, #d96b43 82%, #2f3e33)'
    textColor: '{colors.sand}'
  input-field:
    backgroundColor: '{colors.sand-soft}'
    textColor: '{colors.ink}'
    rounded: '{rounded.field}'
    padding: '0.9rem 1rem'
  input-name:
    backgroundColor: '{colors.sand-soft}'
    textColor: '{colors.ink}'
    rounded: '{rounded.field}'
    padding: '0.45rem 0.7rem'
  plate:
    backgroundColor: '{colors.moss-deep}'
    textColor: '{colors.sand}'
    padding: '2.75rem 1.25rem 1.35rem'
  badge:
    backgroundColor: '{colors.sand-soft}'
    textColor: '{colors.ink}'
    rounded: '{rounded.badge}'
    padding: '0.95rem 0.7rem 0.95rem 1.15rem'
  stepper:
    backgroundColor: '{colors.moss}'
    textColor: '{colors.sand}'
    rounded: '{rounded.control}'
    padding: '0.28rem'
    width: '3.35rem'
  stepper-button:
    backgroundColor: 'transparent'
    textColor: '{colors.sand}'
    rounded: '{rounded.step}'
    size: '2.75rem'
  stepper-button-hover:
    backgroundColor: '{colors.moss-deep}'
    textColor: '{colors.sand}'
  button-remove:
    backgroundColor: 'transparent'
    textColor: '{colors.moss-deep}'
    padding: '0.35rem 0.75rem 0.35rem 0'
  button-remove-hover:
    textColor: '{colors.ink}'
  alert:
    backgroundColor: 'color-mix(in srgb, #d96b43 20%, #f5f2eb)'
    textColor: '{colors.moss-deep}'
    rounded: '0.75rem'
    padding: '0.75rem 0.9rem'
---

# Design System: Lista de Compras

## Overview

**Creative North Star: "The Sand Counter"**

Lista de Compras is a one-hand shopping list on warm paper. The counter is the whole picture: a deep-moss plate across the top, then a narrow column where a name, a typed quantity, and a terracotta add action keep each line in this browser. Rows sit far enough apart for a thumb; inside a badge the type is large and the stepper is tall. A grip on the left reorders the line. The browser mark repeats the same three tones: a deep-moss square, Areia bars, and one Terracota dot.

Color works by proportion. Areia is the ground, Areia Suave is every surface you write on, and Grafite is what you read. Moss builds the plate, the steppers, the labels, and the selection. Terracota stays scarce. The pinned brief limited it to Adicionar; the shipped list also uses it for the focus ring, the text caret, and the error wash.

Type has two jobs. Bricolage Grotesque carries the title. Atkinson Hyperlegible carries the list, the fields, and the controls, at 400 for reading and 700 for names, labels, and actions. Changes ease out on a quick curve; when motion is reduced they collapse to a near-instant fade.

**Key Characteristics:**

- Full-width deep-moss plate over a centered column capped at 34rem
- Areia ground, Areia Suave fields and badges, Grafite text
- Terracota limited to Adicionar, focus, the caret, and the error wash
- A vertical moss stepper on the right of each badge, with 1.75rem between badges
- Bricolage Grotesque for the title, Atkinson Hyperlegible for everything else
- Soft moss-tinted shadows under Adicionar and each badge

## Colors

A warm paper ground, a moss structure, and one terracotta action. The scheme is light only.

### Primary

- **Terracota** (#d96b43): The action color. It fills Adicionar, draws the focus ring (2px, 3px offset), colors the field caret, and tints the error wash at 20% into Areia. Hover on Adicionar mixes Terracota at 82% with Verde-Musgo Profundo.

### Secondary

- **Verde-Musgo** (#4a5d4e): The stepper fill, placeholder text, the scrollbar thumb, and text selection (with Areia as the selection text).
- **Verde-Musgo Profundo** (#2f3e33): The header plate, field labels, the empty-list line, Remover at rest, the stepper button on hover, the shadow tint, and the browser theme color.

### Neutral

- **Areia** (#f5f2eb): The page ground, plate text, stepper text, and the Adicionar label.
- **Areia Suave** (#e8e2d5): Fields, item badges, and the scrollbar track.
- **Grafite** (#2b2d2f): Item names, field text, and Remover on hover.

### Named Rules

**The Terracotta Scarcity Rule.** Terracota fills Adicionar, draws the 2px focus ring, colors the caret, and tints the error wash. It stays off the plate, the badges, the labels, and the item names.

**The Moss Structure Rule.** Moss and deep moss are the structure: the plate, the steppers, the field labels, placeholder text, selection, and the scrollbar.

## Typography

**Display Font:** Bricolage Grotesque (with sans-serif)
**Body Font:** Atkinson Hyperlegible (with sans-serif)

**Character:** A tight grotesque for the single title, and a highly legible grotesque for the list. The loaded weights are 600 for Bricolage and 400 plus 700 for Atkinson.

### Hierarchy

- **Display** (600, clamp(2.5rem, 7vw, 3.4rem), line-height 0.95, letter-spacing -0.03em): The page title on the plate, with balanced wrapping. Below 380px the size is 2.35rem.
- **Title** (700, 1.35rem, line-height 1.25): The item name, left-aligned, free to wrap. Below 380px it is 1.2rem. Editing replaces it with a field at the same size and weight.
- **Body** (400, 1rem, line-height 1.45): The default reading text. The quantityOfItems under the title is 1.0625rem. Fields use 1.0625rem at line-height 1.35. The empty line is 1.125rem, deep moss, capped at 36ch.
- **Label** (700, 1rem, line-height 1.45): Field labels in deep moss, in ordinary capitalization. Adicionar is 1.25rem at weight 700. Remover is 0.98rem at weight 700, underlined, with the offset at 0.22em. The stepper count is 1.25rem at weight 700, with tabular figures.

### Named Rules

**The One Display Face Rule.** Bricolage Grotesque is used for the page title only. Every other line is Atkinson Hyperlegible.

## Layout

The page is a single column. A full-width plate sits on top. Under it, a sheet centers a column at min(34rem, 100%) and insets the sides by 1.25rem, the same inset the plate uses inside the column. The sheet pads 1.75rem on top and 4rem on the bottom.

The composer stacks in a 1.15rem gap: the name field and a numeric quantity field side by side, then Adicionar across the full width. The list starts 1.75rem below the composer. Each badge is a three-column grid, grip and name and Remover on the left, stepper on the right. Badges are at least 8.6rem tall. Below 420px the side inset and the badge gap tighten; below 380px the title and the item names step down. The column stays one column. On a short landscape screen the plate padding collapses so the form stays in reach. Safe-area insets keep the plate under the notch and the last stepper above the home indicator.

### Named Rules

**The Narrow Column Rule.** The plate is full width. Under it, the list sits in one centered column at min(34rem, 100%), with 1.25rem of side inset.

**The Thumb Gap Rule.** Item badges stack in a single column with 1.75rem between them.

## Elevation & Depth

Depth is a change of tone. Areia is the ground, Areia Suave is the writing surface, and moss is the instrument. Two soft shadows, both tinted with deep moss, sit under the action and under each badge. Focus is a Terracota outline, not a glow.

### Shadow Vocabulary

- **Badge lift** (`drop-shadow(0 14px 12px rgba(47, 62, 51, 0.22))`): On the item row, so the shadow follows the badge silhouette.
- **Action lift** (`box-shadow: 0 12px 22px -14px rgba(47, 62, 51, 0.7)`): Under Adicionar only.

### Named Rules

**The Soft Moss Shadow Rule.** Resting depth is a change of tone: Areia, then Areia Suave, then moss. The only shadows are soft and tinted with deep moss: a drop under each badge and a short lift under Adicionar.

## Shapes

Outer shells share a soft corner. Fields are 0.9rem. Adicionar and the stepper shell are 0.95rem. Badges are 1.15rem, and the same radius clips a line as it enters. Stepper buttons are 0.7rem. The error wash is 0.75rem. Fills do the separating: fields, badges, and buttons have no border. The focus ring is the only outline.

### Named Rules

**The Shared Soft Corner Rule.** Outer shells use a 0.9rem field corner, a 0.95rem corner on Adicionar and the stepper, and a 1.15rem badge corner. Stepper buttons (0.7rem) and the error wash (0.75rem) stay inside that same soft family.

## Components

### Buttons

Adicionar is the only filled action: a full-width Terracota button in the composer row, Areia label at 1.25rem and weight 700, padding 0.85rem 1.2rem, corner 0.95rem, and a floor of 3.25rem. Hover mixes Terracota at 82% with deep moss over 0.3s. Press shifts it down 1px. The same ease, cubic-bezier(0.16, 1, 0.3, 1), runs the color and the shift.

Remover is a text button under the item name: transparent, deep moss, 0.98rem, weight 700, underlined. Hover turns the label Grafite. It has no fill and no shadow.

### Inputs / Fields

The composer name field is borderless Areia Suave, corner 0.9rem, padding 0.9rem 1rem, type 1.0625rem at line-height 1.35. Beside it, the quantity field uses the same fill and corner, centered tabular figures at 1.25rem and weight 700, and opens a numeric keyboard. The caret is Terracota. The placeholder is moss at full opacity. The label above each field is deep moss, weight 700, 0.4rem above the field. Below 40rem the quantity label reads Qtd; from 40rem it reads Quantidade.

Editing a name uses the same fill and corner, tightened to padding 0.45rem 0.7rem, at the title size (1.35rem, weight 700).

Focus on fields and buttons is the global ring: 2px solid Terracota, 3px offset.

Errors arrive as one toast at the top: Terracota at 20% into Areia, deep-moss text at weight 700, corner 0.75rem. The same toast carries a missing name on the form, a quantity outside 1–99, and a blank name while editing.

The empty list is one deep-moss line, 1.125rem, max 36ch, 1.5rem below the composer.

### Navigation

The plate is the only header. It is full-width deep moss, padding 2.75rem 1.25rem 1.35rem, with the title and, 0.7rem below it, the quantityOfItems in Areia at 1.0625rem. There are no links.

### Item badge

Each line is a badge, not a card in a grid. Areia Suave, corner 1.15rem, padding 0.95rem 0.7rem 0.95rem 1.15rem, at least 8.6rem tall. The name sits left, Grafite, 1.35rem, weight 700. Remover sits under the name. The moss stepper sits on the right. A deep-moss drop shadow lifts the row. A new line reveals itself through a 1.15rem clip over 0.42s, blur clearing from 8px; leaving reverses the clip. Reduced motion keeps a 0.01s fade.

### Quantity stepper

The count on a badge is a vertical moss control, 3.35rem wide, corner 0.95rem, padding 0.28rem, Areia marks. Plus is on top, the number in the middle, minus below. Each button is 2.75rem, corner 0.7rem, transparent until hover, when it fills with deep moss over 0.25s. The number is 1.25rem, weight 700, tabular, in a 1.85rem window. A step slides 12px and clears a 3px blur over 0.28s. At 1 and at 99 the blocked button falls to 38% opacity. On a badge the stepper sits on the right. The quantity typed at the composer is a field, not this stepper.

### Named Rules

**The Vertical Count Rule.** On a badge, quantity is a vertical stepper: plus above the number, minus below, on the right. At the composer, quantity is typed in the field beside the name.

## Do's and Don'ts

### Do:

- **Do** keep the page on Areia (#f5f2eb) and put fields and item badges on Areia Suave (#e8e2d5).
- **Do** set the page title in Bricolage Grotesque at weight 600, and every other line in Atkinson Hyperlegible.
- **Do** keep quantity in a vertical moss stepper: plus above the number, minus below.
- **Do** leave 1.75rem between item badges.
- **Do** reserve Terracota for Adicionar, the 2px focus ring, the text caret, and the error wash.
- **Do** keep the working column at min(34rem, 100%) under a full-width deep-moss plate.

### Don't:

- **Don't** lay the list out as a card grid or a dashboard.
- **Don't** paint the plate, badges, labels, or item names with Terracota.
- **Don't** add a second display face or set the title in a system sans.
- **Don't** use a hard offset shadow.
- **Don't** place plus and minus side by side.
- **Don't** set labels in tracked uppercase, and don't put an eyebrow above the title.
