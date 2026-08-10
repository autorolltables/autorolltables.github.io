# Auto Roll Tables Wiki

Hundreds of random tables for tabletop RPGs, rolled in a click, plus two map
generators. Everything runs in the browser: no account, no server, and nothing
you save ever leaves your device.

Live at **[autorolltables.github.io](https://autorolltables.github.io)**.

The [README](https://github.com/autorolltables/autorolltables.github.io#readme)
covers what the project is. This wiki covers how to use it and how to work on
it.

## Using it

| Page | What it covers |
|---|---|
| [Rolling Tables](Rolling-Tables) | Categories, rolling, history, filtering, copying results |
| [Favorites and Custom Tables](Favorites-and-Custom-Tables) | Starring tables, writing your own, the inline roll syntax |
| [Backup and Transfer](Backup-and-Transfer) | Export and import, what is stored and where |
| [Hex Map Generator](Hex-Map-Generator) | Sizes, tile labels, saving, how the terrain is generated |
| [Region Map Generator](Region-Map-Generator) | Generating and exporting region maps |
| [Settings](Settings) | Theme, category switching, clearing data |

## Working on it

| Page | What it covers |
|---|---|
| [Adding Tables](Adding-Tables) | The data format, step by step, with a worked example |
| [Development](Development) | Repository layout, running locally, conventions |

## Quick answers

**Do I need an account?** No. There is no server and no sign-in.

**Where is my data kept?** In your browser's `localStorage`, on that device
only. See [Backup and Transfer](Backup-and-Transfer) to move it elsewhere.

**Will an update wipe what I saved?** No. Updates never clear storage. The one
thing to know is that favorites are stored by table name, so if a table is ever
renamed, that favorite stops appearing until the name is restored. Custom tables
are unaffected by any code change.

**Can I use it offline?** Once a page has loaded it keeps working without a
connection, but there is no installable offline mode.
