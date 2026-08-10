# Wiki source

These files are the source of the project's
[GitHub wiki](https://github.com/autorolltables/autorolltables.github.io/wiki).

They are kept here so wiki changes are reviewed alongside code changes, since
several pages document things that break if the code changes without them: the
table data format, the `?v=` cache-busting rule, and how browser storage is
keyed.

## Publishing

A GitHub wiki is a separate git repository. It does not exist until the first
page is created through the web UI, and it cannot be created through the API.

**One-time setup.** Open the repository's
[Wiki tab](https://github.com/autorolltables/autorolltables.github.io/wiki),
click **Create the first page**, and save anything. That brings the wiki
repository into existence.

**Then, from the repository root:**

```bash
git clone https://github.com/autorolltables/autorolltables.github.io.wiki.git ../art-wiki
cp wiki/*.md ../art-wiki/
cd ../art-wiki
git add .
git commit -m "Sync wiki from the main repository"
git push
```

Re-run the copy, commit and push whenever these files change.

## Conventions

- One page per file. The filename is the page title, with hyphens for spaces:
  `Adding-Tables.md` becomes the page **Adding Tables**.
- Link between pages with the page name and no extension:
  `[Adding Tables](Adding-Tables)`.
- `Home.md` is the landing page. `_Sidebar.md` is the navigation shown beside
  every page.
- This README is not published; it is only a note to whoever maintains the wiki.
