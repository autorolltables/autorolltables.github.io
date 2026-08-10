# Development

Plain HTML, CSS and vanilla JavaScript with jQuery. No framework and no build
step: clone it and open `index.html`.

## Running locally

Opening the file directly works for the roll tables. The map generators are
better served over HTTP, so use any static server:

```bash
npx http-server . -c-1
```

Then visit the printed address. `-c-1` disables caching, which saves a lot of
hard reloads while editing.

## Layout

```
index.html              the roll tables app
css/app.css             design tokens and the whole shell
js/
  app-shell.js          sidebar, tab bar, routing, settings (index.html only)
  tool-shell.js         the same shell, cut down, for the generator pages
  rolltables.js         the roll engine: reads the menu, rolls, renders
  roll_menu.js          top.menu: which tables appear where and what they roll
  roll_*.js             the table data
  roll_subrolls.js      count-and-roll definitions used by sub_rolls
  custom-tables.js      user-written tables
  backup.js             export and import
hex-map-generator/      standalone, uses oCanvas
region-map-generator/   standalone, uses d3 and mewo2's terrain generator
wiki/                   the source of this wiki
```

`app-shell.js` and `tool-shell.js` are deliberately separate. The roll tables
page owns categories, routing and settings; the generator pages need only
navigation, collapse and theme.

## Conventions

**Cache busting.** CSS and JS are referenced with `?v=N`. Bump `N` on every page
whenever you change a stylesheet or script, or returning visitors get a stale
mix of old and new files. This is the single easiest thing to forget, and it
produces bugs that look impossible.

**Formatting.** The repository was formatted with prettier 2.2.1. Newer versions
reformat the whole file and bury the real change, so match the surrounding style
by hand rather than reaching for the formatter.

**Line endings.** Files are CRLF. Scripted edits need to match, or the diff comes
out as a whole-file rewrite.

**Syntax check.** The data files are large and a stray comma is easy to miss:

```bash
node --check js/roll_plots.js
```

## Browser storage

| Key | Holds |
|---|---|
| `favorites` | Names of starred tables |
| `art:customTables` | User-written tables |
| `art:theme` | `dark` or `light` |
| `art:navmode` | `hover` or `click` |
| `art:sidebar` | `collapsed` or empty |
| `art:hexlabel` | `text` or `image` |

Nothing clears these except the two Settings buttons. When changing anything
that touches stored data, check that existing data still resolves: favorites in
particular are keyed by table name, so a rename orphans them. See
[Adding Tables](Adding-Tables).

## Layout notes worth knowing

- The mobile breakpoint is `max-width: 899px`. Below it the sidebar is hidden,
  the bottom tab bar appears, and `#main` becomes the scroller instead of the
  panes.
- `#app.sidebar-collapsed` is more specific than `#app`, so any mobile rule
  overriding the grid has to name both, or a sidebar collapsed on desktop keeps
  its narrow column on a phone.
- The mobile More sheet is a menu: anything picked from it must dismiss it
  directly. Do not rely on routing to close it, because choosing the page you
  are already on sets the hash to its current value and fires no `hashchange`.

## Pull requests

Branch off `master`, and check whether a branch's pull request has already been
merged before pushing to it. If it has, branch again from the updated `master`
and open a new one.
