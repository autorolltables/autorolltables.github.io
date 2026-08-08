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
    hex: "M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z",
    globe: "M12 22 a10 10 0 1 1 0-20 a10 10 0 0 1 0 20 M2 12 h20 M12 2 c3 3 3 17 0 20 c-3-3-3-17 0-20",
    screen: "M3 5 h5.5 v14 H3 Z M8.5 7 h7 v10 h-7 Z M15.5 5 H21 v14 h-5.5 Z",
    person: "M12 12.5 a4 4 0 1 0 0-8 a4 4 0 0 0 0 8 M4.5 20.5 c0-4 3.4-6.5 7.5-6.5 s7.5 2.5 7.5 6.5",
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
    { id: "hex", title: "Hex Map Generator", short: "Hex Map", href: "../hex-map-generator/hex_map_generator.html", icon: "hex" },
    { id: "region", title: "Region Map Generator", short: "Region Map", href: "../region-map-generator/index.html", icon: "globe" },
    { id: "dmscreen", title: "DM Screen", short: "DM Screen", href: "https://dmscreen.github.io", icon: "screen", external: true },
    { id: "chargen", title: "Character Generator", short: "Characters", href: "https://charactergenerator.github.io", icon: "person", external: true },
  ];
  var SETTINGS = { id: "settings", title: "Settings", short: "Settings", href: "../index.html#/settings", icon: "gear" };

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
      var tabs = [TABLES].concat(TOOLS, [SETTINGS]);
      var t = "";
      for (var k = 0; k < tabs.length; k++) t += navLink(tabs[k], page.id, "tab-item");
      tabbar.innerHTML = t;
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
