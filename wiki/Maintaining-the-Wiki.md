# Maintaining the Wiki

The pages you are reading are kept in the main repository under `wiki/`, and
copied into the wiki from there. Editing them in the browser works, but the
change is then only in the wiki and will be overwritten by the next sync, so
prefer editing the files in the repository.

## Key fact

A GitHub wiki is a **separate git repository** at `<repo-url>.wiki.git`. Once it
exists you clone it, write `.md` files and push. No browser needed for updates.

For this project:

```
https://github.com/autorolltables/autorolltables.github.io.wiki.git
```

## The blocker: an empty wiki has no repository yet

Even with wikis enabled, cloning a never-used wiki fails with:

```
remote: Repository not found.
```

GitHub only creates the wiki repository when the **first page is saved through
the web UI**. There is no API to initialize it.

Check both facts before assuming anything:

```bash
# is the wiki feature on?
curl -s -H "Authorization: token $TOKEN" \
  https://api.github.com/repos/OWNER/REPO | grep has_wiki

# does the wiki repository exist yet?
git ls-remote https://github.com/OWNER/REPO.wiki.git
```

The first can say `"has_wiki": true` while the second still fails. That
combination is exactly the state a fresh repository is in, and it is the reason
step 1 cannot be skipped or scripted.

## Step 1: initialize, once, in a browser

Open <https://github.com/autorolltables/autorolltables.github.io/wiki/_new>,
fill in a title and any content, and click **Save page**.

Skip this if `git ls-remote` above already succeeded.

If you are driving the browser with automation, two gotchas:

- Setting the field values programmatically works, but clicking **Save page** by
  element reference may silently do nothing. Take a screenshot and click by
  coordinate instead.
- Confirm the URL moved off `/wiki/_new`. A failed submit just leaves the
  filled-in form sitting there, looking like it worked.

## Step 2: clone, write, push

Everything after initialization is command line. Note the branch is `master`,
not `main`.

From the root of the main repository:

```bash
git clone https://github.com/autorolltables/autorolltables.github.io.wiki.git ../art-wiki
find wiki -name '*.md' ! -name 'README.md' -exec cp {} ../art-wiki/ \;
cd ../art-wiki
git add -A
git commit -m "Sync wiki from the main repository"
git push
```

`README.md` is skipped on purpose: it is a note to maintainers in the repository,
not a wiki page.

Authentication uses the same credential helper as any other push. If `git push`
works on the code repository, it works here.

## File conventions

- **Filename is the page name**, and hyphens render as spaces.
  `Adding-Tables.md` becomes the page **Adding Tables** at `/wiki/Adding-Tables`.
- **Internal links use spaces, not the hyphenated filename**: `[[Adding Tables]]`,
  not `[Adding Tables](Adding-Tables)`.
- `Home.md` is the landing page.
- `_Sidebar.md` renders beside every page, and `_Footer.md` below it. Both use
  the same `[[Page Name]]` links.

> One trade-off worth knowing: `[[Page Name]]` is wiki syntax, so it renders as
> literal brackets when these files are viewed in the main repository. The wiki
> is the published target, so the wiki syntax wins.

## Writing the content

- **Derive facts from the repository, never guess.** Pull real counts, versions
  and key names out of the code and data files before writing. Wrong numbers are
  worse than no numbers, because they get trusted.
- **Complement the README, do not retype it.** The README is what the project is
  and how to run it. The wiki is how to use it, what is non-obvious, and why.
- **A page set that fits most projects:** Home as a map of the wiki, getting
  started, a feature or tool guide, a data or domain page, an operations or
  "your data" page, development, FAQ.
- **Write down the real gotchas**, the things people would otherwise file bugs
  about. For this project that means the `?v=` cache-busting rule, favorites
  being keyed by table name, and the prettier version pin.

## Verify when done

Load `/wiki`, confirm the sidebar renders and the page count is right, then click
at least one `[[link]]` to confirm the slug resolved.
