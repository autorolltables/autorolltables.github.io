# Wiki source

These files are the source of the project's
[GitHub wiki](https://github.com/autorolltables/autorolltables.github.io/wiki).

They live here so wiki changes are reviewed alongside code changes. Several
pages document things that break silently if the code moves without them: the
table data format, the `?v=` cache-busting rule, and how browser storage is
keyed.

**Editing and publishing is documented in `Maintaining-the-Wiki.md`**, which is
itself a wiki page. In short: a GitHub wiki is a separate git repository that has
to be initialized once through the web UI, after which it is clone, copy, commit,
push.

This README is the only file here that is not published to the wiki.

> Links between pages use wiki syntax, `[[Page Name]]`, so they render as literal
> brackets when read here in the repository. They resolve correctly once
> published.
