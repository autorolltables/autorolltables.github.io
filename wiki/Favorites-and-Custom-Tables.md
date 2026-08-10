# Favorites and Custom Tables

## Favorites

Every table in the list has a star. Click it to pin that table to the
**Favorites** category. Click it again to unpin.

Favorites are stored in your browser only. They are not synced anywhere, so to
move them to another device use [Backup and Transfer](Backup-and-Transfer).

Clear them all from **Settings > Favorites & custom tables > Clear all
favorites**. That leaves custom tables alone.

> **Worth knowing:** favorites are stored by table name. If a table is ever
> renamed in an update, that favorite stops showing up. It is not deleted, and
> it reappears if the name comes back.

## Custom tables

You can write your own tables. They roll exactly like built-in ones and live in
**Favorites** with a **Custom** badge.

To add one, open **Favorites** and choose **New custom table**, or use the same
button in **Settings**. Give it:

- a **title**
- a **list of results**, one per line

Rolling it picks one line at random.

To edit or delete a single table, click its edit control in the Favorites list.
Deleting asks twice.

To remove all of them at once, use **Settings > Clear all custom tables**. That
also asks twice, because custom tables are written by hand and nothing restores
them. Export first if you are unsure.

## Inline rolls

A custom table's results can contain inline sub-rolls, using the same syntax the
built-in tables use. Write a die in parentheses followed by a colon, then
numbered options:

```
A guard on the gate (d4): 1. bored; 2. drunk; 3. suspicious; 4. asleep
```

Rolling that gives back one resolved line, for example:

```
(d4) A guard on the gate: suspicious
```

Notes on the syntax:

- The die can be any size: `(d3)`, `(d6)`, `(d100)`.
- Options are numbered `1.`, `2.`, `3.` and separated by `;` or `,`.
- Only the first inline roll in a line is resolved.
- Results containing numbers are safe. The parser only treats a number as an
  option marker at an option boundary, so `2d6 gold` inside a result stays
  intact.

## Where this is stored

| Data | Key in `localStorage` |
|---|---|
| Favorites | `favorites` |
| Custom tables | `art:customTables` |

Custom tables are self-contained: a title and a list of strings. No code change
can invalidate them.
