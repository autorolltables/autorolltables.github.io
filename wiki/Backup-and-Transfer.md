# Backup and Transfer

Everything you save lives in your browser on one device. There is no account and
no server, so moving to a new machine, a new browser, or clearing site data all
mean losing it unless you export first.

**Settings > Backup & transfer** has **Export** and **Import**.

## Export

Writes a single JSON file containing:

- your starred **favorites**
- your **custom tables**, in full
- the current roll **history**

Keep the file anywhere. It is plain text and readable.

## Import

Importing **merges** into what is already there. Nothing you currently have is
removed.

- Favorites you already have are not duplicated.
- Custom tables you already have are not duplicated.
- History entries are always appended to the end of the list.

So importing the same file twice is safe, and importing a file from another
device combines the two rather than replacing.

## File format

```json
{
  "format": "autorolltables-backup",
  "version": 1,
  "exported": "2026-08-09T03:57:27.128Z",
  "favorites": ["Battle Events", "Tavern Name"],
  "customTables": [
    { "id": "ct_abc123", "title": "My loot table", "entries": ["a bag of gems"] }
  ],
  "history": []
}
```

Favorites are table names. Custom tables are a title and a list of result
strings.

Because the format is simple, you can write one by hand or generate one from a
script to bulk-load custom tables, as long as `format` and `version` match and
each custom table has a unique `id`.

## What is stored, and when it changes

| Key | Holds |
|---|---|
| `favorites` | Names of starred tables |
| `art:customTables` | Your custom tables |
| `art:theme` | Dark or light |
| `art:navmode` | Whether categories switch on hover or click |
| `art:sidebar` | Whether the sidebar is collapsed |
| `art:hexlabel` | Hex map tile labels: text or image |

Site updates do not touch any of these. Nothing in the app clears storage except
the two clear buttons in Settings, which you have to press.
