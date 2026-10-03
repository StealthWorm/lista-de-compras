# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React with Vite. The user asked for a simple React Vite app.

## Users

A person building a shopping list for themselves, in Portuguese, and returning to the same list later.

## Product Purpose

A single shopping list: add an item with a quantity, edit the name, change the quantity, or delete the line. Success means the list is fast to change with one hand and still there on the next visit.

## Positioning

Each item carries its quantity from the moment it is added. The number is typed beside the name, shown on the right of the item, and changed with plus and minus controls. Lines can be reordered by dragging the grip.

## Operating Context

Used in the browser, including a phone held in one hand. The list is stored in the browser's local storage under this origin.

## Capabilities and Constraints

- Add an item with a name and a quantity typed beside that name, on a numeric keyboard.
- Edit an item's name.
- Delete an item.
- Reorder items by dragging the grip on the left of a line.
- Show the quantity on the right of each item.
- Change that quantity with a plus control above the number and a minus control below it, with space between items so neighboring controls are not easy to hit by mistake.
- Persist the list in localStorage.
- Interface copy is Portuguese.
- The visible name is Lista de Compras.
- No accounts, sharing, prices, categories, or check-off were requested.

## Brand Commitments

The user pinned this palette and its proportion:

- 70% principal ground Areia Claro `#F5F2EB` (245, 242, 235); secondary ground and cards Areia Suave `#E8E2D5` (232, 226, 213); text Grafite Escuro `#2B2D2F` (43, 45, 47).
- 20% Verde-Musgo Tradicional `#4A5D4E` (74, 93, 78) and Verde-Musgo Profundo `#2F3E33` (47, 62, 51).
- 10% accent and call to action Terracota `#D96B43` (217, 107, 67).

## Evidence on Hand

No catalog, prices, logos, or sample items were provided. The list starts empty. Do not invent products as if they were the user's list.

## Product Principles

- The list is the whole product; extra modules wait until they are asked for.
- Quantity is part of the item, not a separate screen.
- The same list should survive a reload in this browser.
- Controls say what they do, in Portuguese.
- Neighboring quantity controls stay far enough apart to forgive a thumb.
