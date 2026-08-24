// stats.js
//
// A tally of what the user has actually done: rolls made, tables favoured,
// days played. Everything here is derived from use, not from the table data,
// so it is worth backing up alongside favorites and custom tables.
//
// Counts are written on every roll, so the writes are kept cheap: one read,
// one merge, one write of a small object.

(function () {
  "use strict";

  var KEY = "art:stats";
  var VERSION = 1;

  function blank() {
    return {
      version: VERSION,
      firstRoll: null,
      lastRoll: null,
      rolls: 0, // tables rolled from the list
      customRolls: 0, // of those, ones on a user-written table
      tableRolls: 0, // underlying tables rolled, including every sub-roll
      inlineRolls: 0, // inline "(d6): 1. a; 2. b" resolutions
      subResults: 0, // lines produced by count sub-rolls
      byCategory: {}, // category id -> rolls
      byTable: {}, // table title -> rolls
      byDay: {}, // YYYY-MM-DD -> rolls
      favoritesAdded: 0,
      favoritesRemoved: 0,
      customTablesCreated: 0,
      exports: 0,
      imports: 0,
    };
  }

  function read() {
    var s;
    try {
      s = JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (e) {
      s = null;
    }
    if (!s || typeof s !== "object") return blank();
    var base = blank();
    for (var k in base) {
      if (!Object.prototype.hasOwnProperty.call(s, k)) s[k] = base[k];
    }
    return s;
  }

  function write(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
    if (window.Autosave) Autosave.schedule();
  }

  function today() {
    var d = new Date();
    function pad(n) {
      return (n < 10 ? "0" : "") + n;
    }
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  // Counters that fire many times inside a single roll are buffered and
  // flushed once the roll finishes, so one click is one write rather than
  // dozens.
  var pending = { tableRolls: 0, inlineRolls: 0, subResults: 0 };

  function bump(field, by) {
    if (pending[field] === undefined) return;
    pending[field] += by === undefined ? 1 : by;
  }

  function commit(title, category, isCustom) {
    var s = read();
    var now = new Date().toISOString();

    s.rolls += 1;
    if (isCustom) s.customRolls += 1;
    s.tableRolls += pending.tableRolls;
    s.inlineRolls += pending.inlineRolls;
    s.subResults += pending.subResults;
    pending = { tableRolls: 0, inlineRolls: 0, subResults: 0 };

    if (!s.firstRoll) s.firstRoll = now;
    s.lastRoll = now;

    var day = today();
    s.byDay[day] = (s.byDay[day] || 0) + 1;

    if (title) {
      var clean = String(title).replace(/^- /, "");
      s.byTable[clean] = (s.byTable[clean] || 0) + 1;
    }
    if (category) s.byCategory[category] = (s.byCategory[category] || 0) + 1;

    write(s);
  }

  function note(field, by) {
    var s = read();
    if (typeof s[field] !== "number") return;
    s[field] += by === undefined ? 1 : by;
    write(s);
  }

  /* ------------------------------------------------------------------
   * Derived figures for the Settings view
   * ---------------------------------------------------------------- */

  function topOf(map, n) {
    var out = [];
    for (var k in map) if (map.hasOwnProperty(k)) out.push({ name: k, count: map[k] });
    out.sort(function (a, b) {
      return b.count - a.count || a.name.localeCompare(b.name);
    });
    return n ? out.slice(0, n) : out;
  }

  // The longest run of consecutive days with at least one roll.
  function longestStreak(byDay) {
    var days = Object.keys(byDay).sort();
    if (!days.length) return 0;
    var best = 1;
    var run = 1;
    for (var i = 1; i < days.length; i++) {
      var prev = new Date(days[i - 1] + "T00:00:00");
      var cur = new Date(days[i] + "T00:00:00");
      var gap = Math.round((cur - prev) / 86400000);
      run = gap === 1 ? run + 1 : 1;
      if (run > best) best = run;
    }
    return best;
  }

  function storedBytes() {
    var total = 0;
    var keys = ["favorites", "art:customTables", KEY];
    for (var i = 0; i < keys.length; i++) {
      try {
        total += (localStorage.getItem(keys[i]) || "").length;
      } catch (e) {}
    }
    return total;
  }

  function summary() {
    var s = read();
    var days = Object.keys(s.byDay);
    var favorites = 0;
    try {
      favorites = (JSON.parse(localStorage.getItem("favorites") || "[]") || []).length;
    } catch (e) {}
    var customs = window.CustomTables ? CustomTables.count() : 0;

    // every line of result text the app has produced for this user
    var results = s.tableRolls + s.subResults + s.customRolls;

    return {
      raw: s,
      rolls: s.rolls,
      customRolls: s.customRolls,
      builtInRolls: s.rolls - s.customRolls,
      tableRolls: s.tableRolls,
      inlineRolls: s.inlineRolls,
      subResults: s.subResults,
      results: results,
      perRoll: s.rolls ? results / s.rolls : 0,
      deepest: s.rolls ? Math.round((s.tableRolls / s.rolls) * 10) / 10 : 0,
      daysActive: days.length,
      longestStreak: longestStreak(s.byDay),
      busiestDay: topOf(s.byDay, 1)[0] || null,
      firstRoll: s.firstRoll,
      lastRoll: s.lastRoll,
      topTables: topOf(s.byTable, 5),
      distinctTables: Object.keys(s.byTable).length,
      topCategories: topOf(s.byCategory),
      favorites: favorites,
      customTables: customs,
      favoritesAdded: s.favoritesAdded,
      favoritesRemoved: s.favoritesRemoved,
      customTablesCreated: s.customTablesCreated,
      exports: s.exports,
      imports: s.imports,
      bytes: storedBytes(),
    };
  }

  /* ------------------------------------------------------------------
   * Backup
   * ---------------------------------------------------------------- */

  // Importing merges rather than replaces, matching favorites and custom
  // tables. Counts add up, the first roll is the earlier of the two and the
  // last roll the later, so combining two devices gives one honest history.
  function merge(incoming) {
    if (!incoming || typeof incoming !== "object") return false;
    var s = read();
    var numbers = [
      "rolls",
      "customRolls",
      "tableRolls",
      "inlineRolls",
      "subResults",
      "favoritesAdded",
      "favoritesRemoved",
      "customTablesCreated",
      "exports",
      "imports",
    ];
    for (var i = 0; i < numbers.length; i++) {
      var f = numbers[i];
      if (typeof incoming[f] === "number" && incoming[f] > 0) s[f] += incoming[f];
    }
    var maps = ["byCategory", "byTable", "byDay"];
    for (var m = 0; m < maps.length; m++) {
      var name = maps[m];
      var src = incoming[name];
      if (!src || typeof src !== "object") continue;
      for (var k in src) {
        if (!src.hasOwnProperty(k) || typeof src[k] !== "number") continue;
        s[name][k] = (s[name][k] || 0) + src[k];
      }
    }
    if (incoming.firstRoll && (!s.firstRoll || incoming.firstRoll < s.firstRoll)) {
      s.firstRoll = incoming.firstRoll;
    }
    if (incoming.lastRoll && (!s.lastRoll || incoming.lastRoll > s.lastRoll)) {
      s.lastRoll = incoming.lastRoll;
    }
    write(s);
    return true;
  }

  function reset() {
    write(blank());
  }

  window.Stats = {
    bump: bump,
    commit: commit,
    note: note,
    read: read,
    summary: summary,
    merge: merge,
    reset: reset,
    KEY: KEY,
  };
})();
