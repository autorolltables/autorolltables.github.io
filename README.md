# Auto Roll Tables

**Hundreds of random tables for tabletop RPGs, rolled in a click.**

**Live at [autorolltables.github.io](https://autorolltables.github.io)**

Pick a table, click it, get a fully rolled result: an NPC with a name, a look, a motive and a rumour; a tavern with its regulars and its stew; a dungeon with its smell. 340 tables drawing on 2,000 underlying roll tables and 28,000 written results, plus two map generators. Everything runs in your browser. No account, no server, no tracking, and your favorites never leave your device.

## Features

### Tables
Every table is one click to roll, and each roll is a whole scene rather than a single line: a table pulls from its own sub-tables, and sub-tables can roll inline (`A guard (d4): 1. bored; 2. drunk; ...`) so results come back fully resolved.

- **Characters**: NPCs by trade and station (alchemists, assassins, bards, druids, merchants, nobles, smiths, cultists, guards), plus whole factions: guilds, cults, pirate crews, outlaw bands, watches and warbands, generated down to their individual members.
- **Locations**: dungeons, caverns, castles, prisons, monasteries and mage's towers with their rooms and encounters; settlements from hamlets to gigantic cities with districts, street names and inhabitants; wilderness from deserts and jungles to the Underdark, plus continents, worlds and weather.
- **Items**: weapons, armour, potions, poisons, magic items and mundane clutter; food and drink from a dockside tavern to a witch's hovel; coins, books, board games and vehicles.
- **Monsters**: beasts by element and origin, dragons, golems, undead, fiends, merfolk and animals, each with appearance, habits and motive.
- **Plots**: campaign themes, adventure hooks, rumours, nightmares, treasure maps, strange crimes and world-shaking events.
- **All**: everything in one alphabetical list, with a filter box.

### Favorites and custom tables
- **Favorites**: star any table to pin it to its own category.
- **Custom tables**: write your own. Give it a title and a list of results, and it rolls exactly like a built-in table, inline sub-roll syntax included. Custom tables sit alongside your favorites with a badge.
- **Backup**: export favorites, custom tables and roll history to a JSON file and import it on another device. Importing merges, so nothing you already have is lost.

### Rolling
- **Current Roll and History**: every roll is kept, collapsible, deletable, and copyable, either one roll or the whole session, as plain text ready to paste into notes or chat.
- **Filter**: narrow any category as you type.

### Map generators
- **[Hex Map Generator](https://autorolltables.github.io/hex-map-generator/hex_map_generator.html)**: builds a wilderness hex map by simulating the terrain tables from Appendix B of the 1st edition *Dungeon Masters Guide*, each tile rolled from its neighbour. Three sizes, exports to PNG.
- **[Region Map Generator](https://autorolltables.github.io/region-map-generator/index.html)**: procedurally generated coastlines, rivers, mountains, cities and borders with generated place names. Exports to SVG or PNG. Built on Martin O'Leary's [terrain generator](https://mewo2.com/notes/terrain/).

## Tech

- Plain HTML, CSS and vanilla JavaScript with jQuery. No framework, no build step: clone and open.
- Tables are plain JavaScript data files under `js/`, so adding a table means editing a list, not writing code.
- Favorites, custom tables and preferences live in `localStorage`, only ever on your device.
- Desktop gets a sidebar layout; phones get an app-style bottom tab bar. Dark theme by default, light theme in Settings.

### Run locally

Any static file server works:

```bash
python -m http.server 8123
```

Then open `http://localhost:8123`.

### Layout

```
index.html              roll tables app
reference.html          SRD reference
hex-map-generator/      hex map tool
region-map-generator/   region map tool
css/app.css             theme and app shell
js/roll_*.js            table data
js/app-shell.js         sidebar, tab bar, categories, settings
js/rolltables.js        rolling, history, favorites
```

## Credits

The tables are the work of the tabletop community, above all **OrkishBlade** and the writers at [/r/BehindTheTables](https://www.reddit.com/r/BehindTheTables/) and [/r/DnDBehindTheScreen](https://www.reddit.com/r/DnDBehindTheScreen/): famoushippopotamus, Joxxill, Minitaz2001, TuesdayTastic, micka190, InternetLoveMachine, Burning_Titan, \_Auto\_, Mimir-ion, Blk4ce, VD-Hawkin, Frank_Isaacs, charliedude, V-Num, Trinculoisdead, LinedWithEyes, rolls_for_initiative, lotrein, maladroitthief, LaserPoweredDeviltry, skywier, BornToDoStuf, captainfashion, olirant and Burgerkrieg.

Site by [dangeratio](https://github.com/dangeratio). Issues and suggestions welcome on [GitHub](https://github.com/autorolltables/autorolltables.github.io/issues).

See also **[DM Screen](https://dmscreen.github.io)**, a companion virtual DM screen with an initiative tracker, encounter builder and SRD reference.

## Licensing

- Application code: MIT.
- Hex map terrain tables from Appendix B of the 1st edition *Dungeon Masters Guide* by Gary Gygax.
- Region map generator by Martin O'Leary ([mewo2/terrain](https://github.com/mewo2/terrain)), used under the MIT license.
- This work includes material taken from the System Reference Document 5.1 ("SRD 5.1") by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode.
- Auto Roll Tables is unofficial fan content and is not affiliated with or endorsed by Wizards of the Coast.
