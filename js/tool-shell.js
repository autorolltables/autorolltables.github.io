// tool-shell.js
//
// The sidebar / mobile tab bar shell for the standalone tool pages (the map
// generators), so they match the roll tables app. The roll tables page has its
// own shell in app-shell.js because it also owns categories and settings; this
// is the small shared version: navigation, collapse and theme only.
//
// A page opts in by setting window.TOOL_PAGE before loading this file:
//   window.TOOL_PAGE = { id: "hex", title: "Hex Map Generator", sub: "..." };

(function () {
  "use strict";

  var PREFS = { theme: "art:theme", sidebar: "art:sidebar" };

  function getPref(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function setPref(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  var ICON_PATHS = {
    tables: "M4 5 h16 M4 12 h16 M4 19 h16",
    // three interlocking tiles, so the hex map does not share a glyph with the
    // plain hexagon the Character Generator uses as its mark
    hex: "M7.5 2.2 L12 4.8 L12 10 L7.5 12.6 L3 10 L3 4.8 Z M16.5 2.2 L21 4.8 L21 10 L16.5 12.6 L12 10 L12 4.8 Z M12 10 L16.5 12.6 L16.5 17.8 L12 20.4 L7.5 17.8 L7.5 12.6 Z",
    globe: "M12 22 a10 10 0 1 1 0-20 a10 10 0 0 1 0 20 M2 12 h20 M12 2 c3 3 3 17 0 20 c-3-3-3-17 0-20",
    all: "M4 5 h16 M4 12 h16 M4 19 h16",
    star: "M12 3 L14.6 8.7 L21 9.5 L16.3 13.8 L17.6 20 L12 16.9 L6.4 20 L7.7 13.8 L3 9.5 L9.4 8.7 Z",
    characters:
      "M9 11 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 M3 20 c0-3.5 2.5-5.5 6-5.5 s6 2 6 5.5 M16 10.5 a2.7 2.7 0 1 0-2-4.8 M17 14.7 c2.5 0.4 4 2.2 4 5.3",
    locations: "M9 4 L3 6 L3 20 L9 18 L15 20 L21 18 L21 4 L15 6 Z M9 4 V18 M15 6 V20",
    items: "M6 8 h12 l1 12 a1 1 0 0 1-1 1 H6 a1 1 0 0 1-1-1 Z M9 8 V6 a3 3 0 0 1 6 0 v2",
    monsters:
      "M4 4 c5-1 11-1 16 0 v7 c0 5-3.5 8.5-8 10 c-4.5-1.5-8-5-8-10 Z M8.5 10 v1.5 M15.5 10 v1.5 M9 15 c2 1.5 4 1.5 6 0",
    plots:
      "M6 3 h13 a2 2 0 0 1 2 2 v2 h-4 M6 3 a2 2 0 0 0-2 2 v13 a3 3 0 0 0 3 3 h11 a2 2 0 0 0 2-2 v-12 M9 9 h7 M9 13 h7",
    grid: "M4 4 h7 v7 h-7 Z M13 4 h7 v7 h-7 Z M4 13 h7 v7 h-7 Z M13 13 h7 v7 h-7 Z",
    // both marks come from the sites themselves: dmscreen.github.io draws this
    // one in its sidebar and its favicon.svg, and charactergenerator.github.io
    // uses the bare d20 silhouette, redrawn here at the same scale as the rest
    dmscreen: "M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z M12 2 L12 22 M3 7 L21 17 M21 7 L3 17",
    chargen: "M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z",
    ext: "M14 4 h6 v6 M20 4 L11 13 M18 14 v5 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 V7 a1 1 0 0 1 1-1 h5",
    gear:
      "M12 15 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 M19.4 15 a1.65 1.65 0 0 0 .33 1.82 l.06.06 a2 2 0 1 1-2.83 2.83 l-.06-.06 a1.65 1.65 0 0 0-1.82-.33 a1.65 1.65 0 0 0-1 1.51 V21 a2 2 0 1 1-4 0 v-.09 A1.65 1.65 0 0 0 9 19.4 a1.65 1.65 0 0 0-1.82.33 l-.06.06 a2 2 0 1 1-2.83-2.83 l.06-.06 a1.65 1.65 0 0 0 .33-1.82 a1.65 1.65 0 0 0-1.51-1 H3 a2 2 0 1 1 0-4 h.09 A1.65 1.65 0 0 0 4.6 9 a1.65 1.65 0 0 0-.33-1.82 l-.06-.06 a2 2 0 1 1 2.83-2.83 l.06.06 a1.65 1.65 0 0 0 1.82.33 H9 a1.65 1.65 0 0 0 1-1.51 V3 a2 2 0 1 1 4 0 v.09 a1.65 1.65 0 0 0 1 1.51 a1.65 1.65 0 0 0 1.82-.33 l.06-.06 a2 2 0 1 1 2.83 2.83 l-.06.06 a1.65 1.65 0 0 0-.33 1.82 V9 a1.65 1.65 0 0 0 1.51 1 H21 a2 2 0 1 1 0 4 h-.09 a1.65 1.65 0 0 0-1.51 1 Z",
  };

  function icon(name, cls) {
    return (
      '<svg class="' + (cls === undefined ? "ic" : cls) + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="' + (ICON_PATHS[name] || ICON_PATHS.tables) + '"/></svg>'
    );
  }

  // "../" because every tool page lives one directory down. "short" is what
  // the mobile tab bar shows, where the full names do not fit.
  var TABLES = { id: "tables", title: "Roll Tables", short: "Tables", href: "../index.html", icon: "tables" };
  var TOOLS = [
    { id: "dmscreen", title: "DM Screen", short: "DM Screen", href: "https://dmscreen.github.io", icon: "dmscreen", external: true },
    { id: "chargen", title: "Character Generator", short: "Characters", href: "https://charactergenerator.github.io", icon: "chargen", external: true },
    { id: "hex", title: "Hex Map Generator", short: "Hex Map", href: "../hex-map-generator/hex_map_generator.html", icon: "hex" },
    { id: "region", title: "Region Map Generator", short: "Region Map", href: "../region-map-generator/index.html", icon: "globe" },
  ];
  var SETTINGS = { id: "settings", title: "Settings", short: "Settings", href: "../index.html#/settings", icon: "gear" };

  // The mobile shell is the same on every page of the site: one row of roll
  // table categories with More last, and a More sheet holding everything else.
  // These mirror the "tab" entries in app-shell.js CATEGORIES.
  var TABS = [
    { id: "Characters", title: "Characters", href: "../index.html#/Characters", icon: "characters" },
    { id: "Locations", title: "Locations", href: "../index.html#/Locations", icon: "locations" },
    { id: "Items", title: "Items", href: "../index.html#/Items", icon: "items" },
    { id: "Monsters", title: "Monsters", href: "../index.html#/Monsters", icon: "monsters" },
    { id: "Plots", title: "Plots", href: "../index.html#/Plots", icon: "plots" },
  ];
  // the categories that did not earn a tab, so they live in the sheet instead
  var SHEET_TABLES = [
    { id: "All", title: "All", href: "../index.html#/All", icon: "all" },
    { id: "Favorites", title: "Favorites", href: "../index.html#/Favorites", icon: "star" },
  ];

  function navLink(entry, activeId, extraClass) {
    var active = entry.id === activeId ? " active" : "";
    var isTab = extraClass === "tab-item";
    var target = entry.external ? ' target="_blank" rel="noopener"' : "";
    return (
      '<a class="' + (extraClass || "nav-item") + active + '" href="' + entry.href + '"' + target + ">" +
      icon(entry.icon, isTab ? "" : "ic") +
      "<span>" + (isTab ? entry.short || entry.title : entry.title) + "</span>" +
      (entry.external && !isTab ? icon("ext", "ext") : "") +
      "</a>"
    );
  }

  function tile(entry) {
    var target = entry.external ? ' target="_blank" rel="noopener"' : "";
    return (
      '<a class="more-tile" href="' + entry.href + '"' + target + ">" +
      icon(entry.icon, "") +
      "<span>" + entry.title + "</span></a>"
    );
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "light" ? "#e1e9ef" : "#131d25";
  }

  function boot() {
    var page = window.TOOL_PAGE || {};
    applyTheme(getPref(PREFS.theme, "dark"));

    var nav = document.getElementById("nav");
    if (nav) {
      var html = '<div class="nav-group-label">Tables</div>' + navLink(TABLES, page.id);
      html += '<div class="nav-group-label">More</div>';
      for (var i = 0; i < TOOLS.length; i++) html += navLink(TOOLS[i], page.id);
      nav.innerHTML = html;
    }

    var foot = document.getElementById("sidebar-foot");
    if (foot) foot.innerHTML = navLink(SETTINGS, page.id);

    var tabbar = document.getElementById("tabbar");
    if (tabbar) {
      var t = "";
      for (var k = 0; k < TABS.length; k++) t += navLink(TABS[k], page.id, "tab-item");
      t += '<button type="button" class="tab-item" id="more-tab">' + icon("grid", "") + "<span>More</span></button>";
      tabbar.innerHTML = t;
    }

    var moreSheet = document.getElementById("more-sheet");
    if (moreSheet) {
      var sheet = '<div class="nav-group-label">Tables</div><div class="more-grid">';
      sheet += tile(TABLES);
      for (var s = 0; s < SHEET_TABLES.length; s++) sheet += tile(SHEET_TABLES[s]);
      sheet += "</div>";

      sheet += '<div class="nav-group-label">Tools</div><div class="more-grid">';
      for (var u = 0; u < TOOLS.length; u++) sheet += tile(TOOLS[u]);
      sheet += tile(SETTINGS) + "</div>";
      moreSheet.innerHTML = sheet;

      var moreTab = document.getElementById("more-tab");
      if (moreTab) {
        moreTab.addEventListener("click", function () {
          moreSheet.classList.toggle("open");
          moreTab.classList.toggle("active", moreSheet.classList.contains("open"));
        });
      }
    }

    var title = document.getElementById("view-title");
    if (title && page.title) title.textContent = page.title;
    var sub = document.getElementById("view-sub");
    if (sub && page.sub) sub.textContent = page.sub;

    // sidebar collapse, sharing the roll tables page's saved state
    var app = document.getElementById("app");
    if (app && getPref(PREFS.sidebar, "") === "collapsed") app.classList.add("sidebar-collapsed");
    var collapse = document.getElementById("collapse-btn");
    if (collapse && app) {
      collapse.addEventListener("click", function () {
        var isCollapsed = app.classList.toggle("sidebar-collapsed");
        setPref(PREFS.sidebar, isCollapsed ? "collapsed" : "");
        if (typeof window.onShellResize === "function") window.onShellResize();
      });
    }
  }

  window.ToolShell = { boot: boot, applyTheme: applyTheme };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
