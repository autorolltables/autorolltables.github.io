# Adding Tables

Tables are plain JavaScript data. Adding one means editing a list, not writing
code. There is no build step: save the file and reload the page.

Two files are involved for every table.

1. A **data file** (`js/roll_*.js`) holding the results.
2. The **menu file** (`js/roll_menu.js`) saying which table appears where, and
   what it rolls.

## 1. Add the results

Data files export an array. `js/roll_plots.js` starts with `top.plots = [` and
ends with `// end of plots`. Each entry is one rollable list:

```js
  {
    title: "d8 Roadside Shrines",
    id: "d8roadsideshrines_travel",
    roll: [
      "A cairn of river stones, each painted with an eye.",
      "A weathered post with a rusted bell that no longer rings.",
      // ...
    ],
  },
```

- **`title`** is what appears next to the result. By convention it opens with the
  die size, which is decorative: a roll always picks uniformly from the array, so
  the list can be any length.
- **`id`** must be unique within its file. The convention is the die size, the
  slugified title, then an underscore and a group suffix.
- **`roll`** is the list of results.

Pick the file by subject: `roll_npcs.js`, `roll_monsters.js`, `roll_dungeons.js`,
`roll_settlements.js`, `roll_wilderness.js`, `roll_objects.js`, `roll_magic.js`,
`roll_food.js`, `roll_factions.js`, `roll_plots.js`.

## 2. Add it to the menu

`js/roll_menu.js` holds `top.menu`, an array of sections. Each section has an
`id` and a list of `items`. An item is one entry in the left-hand list:

```js
      {
        title: "Roadside Shrines",
        use: "Roll when the party passes a wayside marker.",
        main_rolls: ["plots/d8roadsideshrines_travel"],
        sub_rolls: [],
      },
```

- **`title`** is the name in the list. Prefix it with `"- "` to show it indented
  as a variant of the entry above.
- **`use`** is the suggested-use line shown with the result.
- **`main_rolls`** is a list of `"file/id"` references. **Every one of them is
  rolled**, in order, which is how a single click produces a whole scene.
- **`sub_rolls`** is for rolling a quantity of something. Leave it `[]` unless
  you need it.

The `file` part of a reference is the data file's short name: `plots`,
`npcs`, `monsters`, `dungeons`, `settlements`, `wilderness`, `objects`, `magic`,
`food`, `factions`, `subrolls`.

> **Add the item twice.** Once in the **All** section and once in its category
> section. All is a full copy, not a generated view, so a table only added to one
> will be missing from the other.

Items appear in the order they are listed. There is no sorting at display time.

## Table types

### Standard

`main_rolls` names one or more lists, all of which are rolled.

### Pick

`pick_rolls` names several lists; **one** is chosen at random and only that one
is rolled. The list it landed on is named alongside the result.

```js
      {
        title: "Random Plot Hook",
        use: "One roll picks an environment, a second draws a hook from it.",
        main_rolls: [],
        sub_rolls: [],
        pick_rolls: [
          "plots/d50arctic_plothooks",
          "plots/d50coastal_plothooks",
          // ...
        ],
      },
```

Use it when the lists are alternatives rather than parts of one result.

### Count

`sub_rolls` references entries in `js/roll_subrolls.js`, which roll a quantity
and then that many results:

```js
  {
    title: "5d6 Castle Rooms",
    singular: "Castle Room",
    id: "castle5d6rooms",
    roll_type: "amount",   // "amount" lists results, "type" counts by kind
    number: "5d6",         // how many
    percent_to: "100",     // chance this sub-roll happens at all
    percent_of: "100",     // percentage of the rolled number actually used
    roll: castle_rooms,
  },
```

## Inline rolls

Any result string can contain a sub-roll that is resolved before display:

```
"A guard on the gate (d4): 1. bored; 2. drunk; 3. suspicious; 4. asleep"
```

Write the die in parentheses followed by a colon, then numbered options
separated by `;` or `,`. Only the first inline roll in a string is resolved.

## Checklist

- [ ] Results added to a `js/roll_*.js` file with a unique `id`
- [ ] Menu item added to the **All** section
- [ ] Menu item added to its **category** section
- [ ] `node --check js/roll_whatever.js` passes
- [ ] Rolled it in the browser and the results look right

## Renaming or removing a table

Favorites are stored by table **name**. Renaming a table's `title` orphans it for
anyone who starred it, and the table stops appearing in their Favorites until the
old name comes back.

Adding tables is always safe. If a rename is genuinely needed, raise it in the
pull request so an alias can be added.
