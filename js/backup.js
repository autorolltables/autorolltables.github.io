// backup.js
//
// Export and import of everything this browser is holding for the user:
// starred favorites, custom tables and the roll history. The export is a plain
// JSON file; importing merges it into what is already here rather than
// replacing it, so restoring a backup can never quietly discard newer work.

(function () {
  "use strict";

  var FORMAT = "autorolltables-backup";
  var VERSION = 1;

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readJSON(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || "null");
      return v === null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------------
   * History <-> data
   * ---------------------------------------------------------------- */
  // Each history entry is stored as its plain text (the same text the Copy
  // button produces) rather than as markup, so importing a file can never
  // inject HTML into the page.
  function readHistory() {
    var out = [];
    var container = document.getElementById("rightview-history-display");
    if (!container) return out;

    var headers = container.querySelectorAll(".accordion");
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      var panel = header.nextElementSibling;
      var copy = panel ? panel.querySelector(".for-copy") : null;

      var titleNode = header.cloneNode(true);
      var menu = titleNode.querySelector(".history-item-menu");
      if (menu) menu.remove();
      var badge = titleNode.querySelector(".badge-custom");
      if (badge) badge.remove();

      out.push({
        title: titleNode.textContent.trim(),
        custom: !!header.querySelector(".badge-custom"),
        text: copy ? copy.textContent : "",
      });
    }
    return out;
  }

  function entryHTML(entry) {
    var text = String(entry.text || "");
    var lines = text.split("\n");
    var body = "";

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line === "") {
        body += "<br>";
        continue;
      }
      // the title is already shown on the accordion header
      if (line.indexOf("Title: ") === 0) continue;

      if (line.indexOf("Suggested Use: ") === 0) {
        body += "Suggested Use: <span class='roll-suggested-use'>" + esc(line.slice(15)) + "</span><br>";
        continue;
      }
      var split = line.indexOf(" : ");
      if (split > -1) {
        body += esc(line.slice(0, split)) + " : <b>" + esc(line.slice(split + 3)) + "</b><br>";
      } else {
        body += esc(line) + "<br>";
      }
    }

    return (
      "<div class='accordion roll-title-history'>" +
      esc(entry.title || "Roll") +
      (entry.custom ? " <span class='badge-custom'>Custom</span>" : "") +
      " <div class='history-item-menu'><div class='delete-history-item glyphicon glyphicon-trash'></div>" +
      " <div class='expand-collapse glyphicon glyphicon-chevron-down'></div></div></div>" +
      "<div class='panel'>" +
      body +
      "<div class='for-copy'>" +
      esc(text) +
      "</div></div>"
    );
  }

  function appendHistory(entries) {
    var container = document.getElementById("rightview-history-display");
    if (!container || !entries.length) return 0;

    var html = "";
    for (var i = 0; i < entries.length; i++) html += entryHTML(entries[i]);
    container.innerHTML = container.innerHTML + html;

    // rebuild the plain-text mirror the Copy button reads from
    if (typeof window.process_history === "function") window.process_history();
    return entries.length;
  }

  /* ------------------------------------------------------------------
   * Export
   * ---------------------------------------------------------------- */
  function buildBackup() {
    return {
      format: FORMAT,
      version: VERSION,
      exported: new Date().toISOString(),
      favorites: readJSON("favorites", []),
      customTables: readJSON("art:customTables", []),
      history: readHistory(),
    };
  }

  function stamp() {
    var d = new Date();
    function pad(n) {
      return (n < 10 ? "0" : "") + n;
    }
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + pad(d.getHours()) + pad(d.getMinutes());
  }

  function exportFile() {
    var data = buildBackup();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "auto-roll-tables-" + stamp() + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);

    if (typeof window.showalert === "function") window.showalert("backup exported");
  }

  /* ------------------------------------------------------------------
   * Import
   * ---------------------------------------------------------------- */
  function sameTable(a, b) {
    return a.title === b.title && JSON.stringify(a.entries) === JSON.stringify(b.entries);
  }

  function newId() {
    return "ct_" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  }

  function applyBackup(data) {
    var added = { favorites: 0, tables: 0, history: 0 };

    // favorites: union, so nothing already starred is lost
    if (Array.isArray(data.favorites)) {
      var favs = readJSON("favorites", []);
      for (var i = 0; i < data.favorites.length; i++) {
        var title = data.favorites[i];
        if (typeof title === "string" && favs.indexOf(title) === -1) {
          favs.push(title);
          added.favorites++;
        }
      }
      writeJSON("favorites", favs.sort());
    }

    // custom tables: append, skipping ones already present with the same
    // contents, and re-issue ids so an imported file cannot collide
    if (Array.isArray(data.customTables)) {
      var tables = readJSON("art:customTables", []);
      var existingIds = {};
      for (var e = 0; e < tables.length; e++) existingIds[tables[e].id] = true;

      for (var t = 0; t < data.customTables.length; t++) {
        var incoming = data.customTables[t];
        if (!incoming || typeof incoming.title !== "string" || !Array.isArray(incoming.entries)) continue;

        var duplicate = false;
        for (var x = 0; x < tables.length; x++) {
          if (sameTable(tables[x], incoming)) {
            duplicate = true;
            break;
          }
        }
        if (duplicate) continue;

        var id = incoming.id;
        if (!id || existingIds[id]) id = newId();
        existingIds[id] = true;

        tables.push({
          id: id,
          title: incoming.title,
          entries: incoming.entries.filter(function (line) {
            return typeof line === "string" && line.trim() !== "";
          }),
        });
        added.tables++;
      }
      writeJSON("art:customTables", tables);
    }

    // history: appended after whatever is on screen
    if (Array.isArray(data.history)) {
      var entries = data.history.filter(function (h) {
        return h && typeof h.text === "string";
      });
      added.history = appendHistory(entries);
    }

    if (typeof window.refresh_favorites_view === "function") window.refresh_favorites_view();
    return added;
  }

  function importFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var data;
      try {
        data = JSON.parse(reader.result);
      } catch (err) {
        setStatus("That file is not valid JSON.", true);
        return;
      }
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        setStatus("That file is not an Auto Roll Tables backup.", true);
        return;
      }
      if (data.format && data.format !== FORMAT) {
        setStatus("That backup came from a different app.", true);
        return;
      }
      if (!data.favorites && !data.customTables && !data.history) {
        setStatus("Nothing to import from that file.", true);
        return;
      }

      var added = applyBackup(data);
      setStatus(
        "Imported " + added.tables + " custom " + (added.tables === 1 ? "table" : "tables") +
          ", " + added.favorites + " " + (added.favorites === 1 ? "favorite" : "favorites") +
          " and " + added.history + " history " + (added.history === 1 ? "entry" : "entries") + ".",
        false
      );
      if (typeof window.showalert === "function") window.showalert("backup imported");
    };
    reader.onerror = function () {
      setStatus("Could not read that file.", true);
    };
    reader.readAsText(file);
  }

  function setStatus(message, isError) {
    var el = document.getElementById("set-backup-status");
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("danger-text", !!isError);
  }

  /* ------------------------------------------------------------------
   * Wiring
   * ---------------------------------------------------------------- */
  function init() {
    var exportBtn = document.getElementById("set-export");
    var importBtn = document.getElementById("set-import");
    var fileInput = document.getElementById("set-import-file");
    if (!exportBtn || !importBtn || !fileInput) return;

    exportBtn.addEventListener("click", exportFile);
    importBtn.addEventListener("click", function () {
      setStatus("", false);
      fileInput.click();
    });
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) importFile(fileInput.files[0]);
      // clear so picking the same file again still fires a change
      fileInput.value = "";
    });
  }

  window.Backup = {
    init: init,
    buildBackup: buildBackup,
    applyBackup: applyBackup,
  };
})();
