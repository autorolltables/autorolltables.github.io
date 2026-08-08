// app-shell.js
//
// Builds the application shell around the roll tables: the desktop left nav,
// the mobile tab bar, the settings view, and the theme.
//
// It also regroups the source categories into a smaller set. The table data in
// roll_menu.js still ships the original sections; they are combined here at
// load time so the data files stay untouched.

(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * Preferences
   * ---------------------------------------------------------------- */
  var PREFS = {
    theme: "art:theme",
    navmode: "art:navmode",
    sidebar: "art:sidebar",
  };

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

  /* ------------------------------------------------------------------
   * Icons
   * ---------------------------------------------------------------- */
  var ICON_PATHS = {
    all: "M4 5 h16 M4 12 h16 M4 19 h16",
    star: "M12 3 L14.6 8.7 L21 9.5 L16.3 13.8 L17.6 20 L12 16.9 L6.4 20 L7.7 13.8 L3 9.5 L9.4 8.7 Z",
    characters:
      "M9 11 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 M3 20 c0-3.5 2.5-5.5 6-5.5 s6 2 6 5.5 M16 10.5 a2.7 2.7 0 1 0-2-4.8 M17 14.7 c2.5 0.4 4 2.2 4 5.3",
    locations: "M9 4 L3 6 L3 20 L9 18 L15 20 L21 18 L21 4 L15 6 Z M9 4 V18 M15 6 V20",
    items:
      "M6 8 h12 l1 12 a1 1 0 0 1-1 1 H6 a1 1 0 0 1-1-1 Z M9 8 V6 a3 3 0 0 1 6 0 v2",
    monsters:
      "M4 4 c5-1 11-1 16 0 v7 c0 5-3.5 8.5-8 10 c-4.5-1.5-8-5-8-10 Z M8.5 10 v1.5 M15.5 10 v1.5 M9 15 c2 1.5 4 1.5 6 0",
    plots:
      "M6 3 h13 a2 2 0 0 1 2 2 v2 h-4 M6 3 a2 2 0 0 0-2 2 v13 a3 3 0 0 0 3 3 h11 a2 2 0 0 0 2-2 v-12 M9 9 h7 M9 13 h7",
    book: "M5 3 h11 a3 3 0 0 1 3 3 v15 H8 a3 3 0 0 1-3-3 Z M5 15 a3 3 0 0 1 3 3 h11 M9 7 h6",
    hex: "M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z",
    globe: "M12 22 a10 10 0 1 1 0-20 a10 10 0 0 1 0 20 M2 12 h20 M12 2 c3 3 3 17 0 20 c-3-3-3-17 0-20",
    gear:
      "M12 15 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 M19.4 15 a1.65 1.65 0 0 0 .33 1.82 l.06.06 a2 2 0 1 1-2.83 2.83 l-.06-.06 a1.65 1.65 0 0 0-1.82-.33 a1.65 1.65 0 0 0-1 1.51 V21 a2 2 0 1 1-4 0 v-.09 A1.65 1.65 0 0 0 9 19.4 a1.65 1.65 0 0 0-1.82.33 l-.06.06 a2 2 0 1 1-2.83-2.83 l.06-.06 a1.65 1.65 0 0 0 .33-1.82 a1.65 1.65 0 0 0-1.51-1 H3 a2 2 0 1 1 0-4 h.09 A1.65 1.65 0 0 0 4.6 9 a1.65 1.65 0 0 0-.33-1.82 l-.06-.06 a2 2 0 1 1 2.83-2.83 l.06.06 a1.65 1.65 0 0 0 1.82.33 H9 a1.65 1.65 0 0 0 1-1.51 V3 a2 2 0 1 1 4 0 v.09 a1.65 1.65 0 0 0 1 1.51 a1.65 1.65 0 0 0 1.82-.33 l.06-.06 a2 2 0 1 1 2.83 2.83 l-.06.06 a1.65 1.65 0 0 0-.33 1.82 V9 a1.65 1.65 0 0 0 1.51 1 H21 a2 2 0 1 1 0 4 h-.09 a1.65 1.65 0 0 0-1.51 1 Z",
    grid: "M4 4 h7 v7 h-7 Z M13 4 h7 v7 h-7 Z M4 13 h7 v7 h-7 Z M13 13 h7 v7 h-7 Z",
    screen: "M3 5 h5.5 v14 H3 Z M8.5 7 h7 v10 h-7 Z M15.5 5 H21 v14 h-5.5 Z",
    person: "M12 12.5 a4 4 0 1 0 0-8 a4 4 0 0 0 0 8 M4.5 20.5 c0-4 3.4-6.5 7.5-6.5 s7.5 2.5 7.5 6.5",
    ext: "M14 4 h6 v6 M20 4 L11 13 M18 14 v5 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 V7 a1 1 0 0 1 1-1 h5",
  };

  function icon(name, cls) {
    var d = ICON_PATHS[name] || ICON_PATHS.all;
    return (
      '<svg class="' + (cls || "ic") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'
    );
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------------
   * Category definitions
   *
   * "sources" are section titles as they appear in roll_menu.js. Several of
   * them are combined into one browsing category.
   * ---------------------------------------------------------------- */
  // "tab" entries make up the single row of the mobile tab bar; everything
  // else is reached through More
  var CATEGORIES = [
    { id: "All", title: "All", icon: "all", sources: ["All"], tab: false },
    { id: "Favorites", title: "Favorites", icon: "star", sources: [], tab: false },
    { id: "Characters", title: "Characters", icon: "characters", sources: ["Factions", "NPCs"], tab: true },
    { id: "Locations", title: "Locations", icon: "locations", sources: ["Dungeons", "Settlements", "Wilderness"], tab: true },
    { id: "Items", title: "Items", icon: "items", sources: ["Food", "Magic", "Objects", "Vehicles"], tab: true },
    { id: "Monsters", title: "Monsters", icon: "monsters", sources: ["Monsters"], tab: true },
    { id: "Plots", title: "Plots", icon: "plots", sources: ["Plots"], tab: true },
  ];

  // the companion sites lead; the last two generators live in this repo
  var LINKS = [
    { href: "https://dmscreen.github.io", title: "DM Screen", icon: "screen", external: true },
    { href: "https://charactergenerator.github.io", title: "Character Generator", icon: "person", external: true },
    { href: "hex-map-generator/hex_map_generator.html", title: "Hex Map Generator", icon: "hex" },
    { href: "region-map-generator/index.html", title: "Region Map Generator", icon: "globe" },
  ];

  /* ------------------------------------------------------------------
   * Category merging
   *
   * Entries whose title starts with "- " are sub-tables belonging to the entry
   * above them, so items are grouped into blocks of [parent, ...children] and
   * the blocks are what get sorted and de-duplicated. That keeps each sub-table
   * attached to its parent no matter how the sources are combined.
   * ---------------------------------------------------------------- */
  function isSubItem(item) {
    return /^-\s/.test(item.title || "");
  }

  function toBlocks(items) {
    var blocks = [];
    var current = null;
    for (var i = 0; i < items.length; i++) {
      if (!isSubItem(items[i]) || current === null) {
        current = [items[i]];
        blocks.push(current);
      } else {
        current.push(items[i]);
      }
    }
    return blocks;
  }

  function sortKey(block) {
    return String(block[0].title || "").replace(/^-\s*/, "").toLowerCase();
  }

  // two entries are the same table if they roll the same things, even when the
  // source files differ in whitespace
  function fingerprint(item) {
    return JSON.stringify({
      t: String(item.title || "").trim(),
      u: String(item.use || "").trim(),
      m: item.main_rolls || [],
      s: item.sub_rolls || [],
    });
  }

  function mergeSources(sourceTitles, sourceMap) {
    var blocks = [];
    var byParent = {};

    for (var s = 0; s < sourceTitles.length; s++) {
      var section = sourceMap[sourceTitles[s]];
      if (!section) continue;
      var sectionBlocks = toBlocks(section.items || []);

      for (var b = 0; b < sectionBlocks.length; b++) {
        var block = sectionBlocks[b];
        var key = fingerprint(block[0]);
        var existing = byParent[key];

        if (!existing) {
          existing = { items: [block[0]], childKeys: {} };
          byParent[key] = existing;
          blocks.push(existing);
        }

        // several tables were listed under two of the old categories; keep one
        // copy of the parent and fold in any sub-tables it is missing
        for (var c = 1; c < block.length; c++) {
          var ck = fingerprint(block[c]);
          if (existing.childKeys[ck]) continue;
          existing.childKeys[ck] = true;
          existing.items.push(block[c]);
        }
      }
    }

    blocks.sort(function (a, b) {
      var ka = sortKey(a.items), kb = sortKey(b.items);
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });

    var out = [];
    for (var i = 0; i < blocks.length; i++) {
      for (var j = 0; j < blocks[i].items.length; j++) out.push(blocks[i].items[j]);
    }
    return out;
  }

  function buildMenu() {
    var source = (window.top && window.top.menu) || [];
    var byTitle = {};
    for (var i = 0; i < source.length; i++) byTitle[source[i].title] = source[i];

    var menu = [];
    for (var c = 0; c < CATEGORIES.length; c++) {
      var cat = CATEGORIES[c];
      var entry = {
        title: cat.title,
        id: cat.id,
        icon: cat.icon,
        items: cat.sources.length ? mergeSources(cat.sources, byTitle) : [],
      };
      if (cat.id === "Favorites") entry.display_title = "★ Favorites";
      menu.push(entry);
    }
    window.top.menu = menu;
    return menu;
  }

  /* ------------------------------------------------------------------
   * Rendering
   * ---------------------------------------------------------------- */
  function countFor(id) {
    var menu = window.top.menu;
    for (var i = 0; i < menu.length; i++) if (menu[i].id === id) return menu[i].items.length;
    return 0;
  }

  function renderNav() {
    var html = '<div class="nav-group-label">Tables</div>';
    for (var i = 0; i < CATEGORIES.length; i++) {
      var c = CATEGORIES[i];
      html +=
        '<a class="nav-item" href="#/' + c.id + '" data-cat="' + c.id + '">' +
        icon(c.icon) +
        "<span>" + esc(c.title) + "</span>" +
        '<span class="count" data-count="' + c.id + '">' + countFor(c.id) + "</span>" +
        "</a>";
    }

    // "More" in the sidebar; the mobile sheet keeps calling this group Tools,
    // since the sheet itself is already the More destination there
    html += '<div class="nav-group-label">More</div>';
    for (var k = 0; k < LINKS.length; k++) {
      var l = LINKS[k];
      var target = l.external ? ' target="_blank" rel="noopener"' : "";
      html +=
        '<a class="nav-item" href="' + l.href + '"' + target + ">" + icon(l.icon) +
        "<span>" + esc(l.title) + "</span>" + icon("ext", "ext") + "</a>";
    }

    document.getElementById("nav").innerHTML = html;

    document.getElementById("sidebar-foot").innerHTML =
      '<a class="nav-item" href="#/settings" data-cat="settings">' + icon("gear") + "<span>Settings</span></a>";
  }

  function renderTabbar() {
    var html = "";
    for (var i = 0; i < CATEGORIES.length; i++) {
      var c = CATEGORIES[i];
      if (!c.tab) continue;
      html +=
        '<a class="tab-item" href="#/' + c.id + '" data-cat="' + c.id + '">' +
        icon(c.icon, "") + "<span>" + esc(c.title) + "</span></a>";
    }
    html += '<button type="button" class="tab-item" id="more-tab">' + icon("grid", "") + "<span>More</span></button>";
    document.getElementById("tabbar").innerHTML = html;

    var sheet = '<div class="nav-group-label">Tables</div><div class="more-grid">';
    for (var j = 0; j < CATEGORIES.length; j++) {
      var cat = CATEGORIES[j];
      if (cat.tab) continue;
      sheet += '<a class="more-tile" href="#/' + cat.id + '" data-cat="' + cat.id + '">' + icon(cat.icon, "") + "<span>" + esc(cat.title) + "</span></a>";
    }
    sheet += "</div>";

    sheet += '<div class="nav-group-label">Tools</div><div class="more-grid">';
    for (var m = 0; m < LINKS.length; m++) {
      var ext = LINKS[m].external ? ' target="_blank" rel="noopener"' : "";
      sheet += '<a class="more-tile" href="' + LINKS[m].href + '"' + ext + ">" + icon(LINKS[m].icon, "") + "<span>" + esc(LINKS[m].title) + "</span></a>";
    }
    sheet += '<a class="more-tile" href="#/settings" data-cat="settings">' + icon("gear", "") + "<span>Settings</span></a>";
    sheet += "</div>";
    document.getElementById("more-sheet").innerHTML = sheet;
  }

  function refreshCounts() {
    var nodes = document.querySelectorAll("[data-count]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = countFor(nodes[i].getAttribute("data-count"));
    }
  }

  function setActive(id) {
    var nodes = document.querySelectorAll(".nav-item, .tab-item");
    for (var i = 0; i < nodes.length; i++) {
      var cat = nodes[i].getAttribute("data-cat");
      nodes[i].classList.toggle("active", !!cat && cat === id);
    }
  }

  function closeMoreSheet() {
    document.getElementById("more-sheet").classList.remove("open");
  }

  /* ------------------------------------------------------------------
   * Routing
   * ---------------------------------------------------------------- */
  function currentRoute() {
    var h = String(location.hash || "").replace(/^#\/?/, "");
    if (h === "settings") return "settings";
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === h) return h;
    return "All";
  }

  function setHeaderActions(id) {
    var addBtn = document.getElementById("new-custom-table");
    if (addBtn) addBtn.hidden = id !== "Favorites";
  }

  function showSettings() {
    document.getElementById("view-tables").hidden = true;
    document.getElementById("view-settings").hidden = false;
    document.getElementById("view-title").textContent = "Settings";
    document.getElementById("view-sub").textContent = "Appearance, favorites and attribution";
    setHeaderActions("settings");
    setActive("settings");
    syncSettings();
  }

  function showCategory(id) {
    document.getElementById("view-settings").hidden = true;
    document.getElementById("view-tables").hidden = false;
    document.getElementById("view-title").textContent = id;
    setHeaderActions(id);
    setActive(id);
    // loadleftdisplay lives in rolltables.js and fills the table list
    if (typeof window.loadleftdisplay === "function") window.loadleftdisplay(id);
    updateSub(id);
  }

  function updateSub(id) {
    var n = countFor(id);
    var sub = document.getElementById("view-sub");
    if (!sub) return;

    if (id === "Favorites") {
      var customs = window.CustomTables ? CustomTables.count() : 0;
      var starred = n - customs;
      if (n === 0) {
        sub.textContent = "Star a table, or write your own";
        return;
      }
      var parts = [];
      if (starred > 0) parts.push(starred + (starred === 1 ? " starred" : " starred"));
      if (customs > 0) parts.push(customs + (customs === 1 ? " custom table" : " custom tables"));
      sub.textContent = parts.join(" · ");
      return;
    }
    sub.textContent = n + (n === 1 ? " table" : " tables");
  }

  function applyRoute() {
    closeMoreSheet();
    var route = currentRoute();
    if (route === "settings") showSettings();
    else showCategory(route);
    var main = document.getElementById("main");
    if (main) main.scrollTop = 0;
  }

  /* ------------------------------------------------------------------
   * Settings
   * ---------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "light" ? "#e1e9ef" : "#131d25";
  }

  function favoriteCount() {
    try {
      return (JSON.parse(localStorage.getItem("favorites") || "[]") || []).length;
    } catch (e) {
      return 0;
    }
  }

  // segmented toggles: one button per value, the selected one highlighted
  function setSegmented(groupId, value) {
    var group = document.getElementById(groupId);
    if (!group) return;
    var buttons = group.querySelectorAll(".seg");
    for (var i = 0; i < buttons.length; i++) {
      var selected = buttons[i].getAttribute("data-value") === value;
      buttons[i].classList.toggle("active", selected);
      buttons[i].setAttribute("aria-pressed", selected ? "true" : "false");
    }
  }

  function bindSegmented(groupId, onChange) {
    var group = document.getElementById(groupId);
    if (!group) return;
    group.addEventListener("click", function (e) {
      var button = e.target.closest ? e.target.closest(".seg") : null;
      if (!button) return;
      var value = button.getAttribute("data-value");
      setSegmented(groupId, value);
      onChange(value);
    });
  }

  function syncSettings() {
    setSegmented("set-theme", getPref(PREFS.theme, "dark") === "light" ? "light" : "dark");
    setSegmented("set-navmode", getPref(PREFS.navmode, "hover") === "click" ? "click" : "hover");

    var count = document.getElementById("set-fav-count");
    if (count) {
      var n = favoriteCount();
      var customs = window.CustomTables ? CustomTables.count() : 0;
      var bits = [];
      bits.push(n === 0 ? "No tables starred" : n + (n === 1 ? " table starred" : " tables starred"));
      if (customs > 0) bits.push(customs + (customs === 1 ? " custom table" : " custom tables"));
      count.textContent = bits.join(", ") + ".";
    }
  }

  function initSettings() {
    bindSegmented("set-theme", function (value) {
      setPref(PREFS.theme, value);
      applyTheme(value);
      if (typeof window.showalert === "function") window.showalert("settings saved");
    });

    bindSegmented("set-navmode", function (value) {
      setPref(PREFS.navmode, value);
      window.mouseover_on = value === "hover";
      if (typeof window.showalert === "function") {
        window.showalert(value === "hover" ? "hover on" : "hover off");
      }
    });

    var clear = document.getElementById("set-clear-favorites");
    if (clear) {
      clear.addEventListener("click", function () {
        try {
          localStorage.setItem("favorites", "[]");
        } catch (e) {}
        if (typeof window.reloadFavorites === "function") window.reloadFavorites();
        refreshCounts();
        syncSettings();
        if (typeof window.showalert === "function") window.showalert("favorites cleared");
      });
    }
  }

  /* ------------------------------------------------------------------
   * Boot
   * ---------------------------------------------------------------- */
  function boot() {
    applyTheme(getPref(PREFS.theme, "dark"));
    // hover switching is the default; Settings can turn it off
    window.mouseover_on = getPref(PREFS.navmode, "hover") === "hover";

    renderNav();
    renderTabbar();
    initSettings();

    var app = document.getElementById("app");
    if (getPref(PREFS.sidebar, "") === "collapsed") app.classList.add("sidebar-collapsed");
    var collapse = document.getElementById("collapse-btn");
    if (collapse) {
      collapse.addEventListener("click", function () {
        var isCollapsed = app.classList.toggle("sidebar-collapsed");
        setPref(PREFS.sidebar, isCollapsed ? "collapsed" : "");
      });
    }

    var moreTab = document.getElementById("more-tab");
    if (moreTab) {
      moreTab.addEventListener("click", function () {
        var sheet = document.getElementById("more-sheet");
        sheet.classList.toggle("open");
        moreTab.classList.toggle("active", sheet.classList.contains("open"));
      });
    }

    // hover navigation for the left nav (opt-in from Settings)
    var navEl = document.getElementById("nav");
    var hoverTimer = null;
    navEl.addEventListener("mouseover", function (e) {
      if (!window.mouseover_on) return;
      var item = e.target.closest ? e.target.closest(".nav-item[data-cat]") : null;
      if (!item) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        var id = item.getAttribute("data-cat");
        if (id && id !== "settings" && currentRoute() !== id) location.hash = "#/" + id;
      }, 70);
    });
    navEl.addEventListener("mouseleave", function () {
      clearTimeout(hoverTimer);
    });

    window.addEventListener("hashchange", applyRoute);
    applyRoute();
  }

  /* ------------------------------------------------------------------
   * Public surface
   * ---------------------------------------------------------------- */
  // navigate to a category from elsewhere in the app, calling done() once the
  // new view is on screen. setting location.hash only fires hashchange on a
  // later task, so callers that need the rendered list have to wait for it.
  function goTo(id, done) {
    if (location.hash === "#/" + id) {
      applyRoute();
      if (done) done();
      return;
    }
    if (done) {
      var once = function () {
        window.removeEventListener("hashchange", once);
        done();
      };
      // boot() registered applyRoute first, so the route is already applied
      // by the time this runs
      window.addEventListener("hashchange", once);
    }
    location.hash = "#/" + id;
  }

  window.AppShell = {
    boot: boot,
    goTo: goTo,
    applyRoute: applyRoute,
    setActive: setActive,
    refreshCounts: refreshCounts,
    updateSub: updateSub,
    currentRoute: currentRoute,
    syncSettings: syncSettings,
    isSubItem: isSubItem,
    categories: CATEGORIES,
  };

  // regroup the menu as soon as the data files have loaded, before
  // rolltables.js reads it
  buildMenu();
})();
