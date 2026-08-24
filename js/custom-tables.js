// custom-tables.js
//
// User-written roll tables. A custom table is just a title and a list of
// results; rolling one picks a line at random. They live alongside the starred
// tables in the Favorites category and are stored in this browser only.

(function () {
  "use strict";

  var STORAGE_KEY = "art:customTables";

  /* ------------------------------------------------------------------
   * Storage
   * ---------------------------------------------------------------- */
  function load() {
    var raw;
    try {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
    if (!Array.isArray(raw)) return [];

    // ignore anything that does not look like a table so a corrupt entry
    // cannot break the Favorites list
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var t = raw[i];
      if (!t || typeof t.title !== "string" || !Array.isArray(t.entries)) continue;
      out.push({
        id: String(t.id || newId()),
        title: t.title,
        entries: t.entries.filter(function (e) {
          return typeof e === "string" && e.trim() !== "";
        }),
      });
    }
    return out;
  }

  function save(tables) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
    } catch (e) {
      if (typeof window.showalert === "function") window.showalert("custom save failed");
    }
    if (window.Autosave) Autosave.schedule();
  }

  function newId() {
    return "ct_" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  }

  function byId(id) {
    var all = load();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  /* ------------------------------------------------------------------
   * Menu integration
   * ---------------------------------------------------------------- */
  // shaped like the built-in menu entries so the rest of the app can treat
  // them the same way
  function asMenuItems() {
    return load().map(function (t) {
      return {
        title: t.title,
        use: "",
        main_rolls: [],
        sub_rolls: [],
        custom: true,
        customId: t.id,
        entries: t.entries,
      };
    });
  }

  function count() {
    return load().length;
  }

  /* ------------------------------------------------------------------
   * Rolling
   * ---------------------------------------------------------------- */
  function pick(item) {
    var entries = (item && item.entries) || [];
    if (!entries.length) return "";
    return entries[Math.floor(Math.random() * entries.length)];
  }

  /* ------------------------------------------------------------------
   * Editor dialog
   * ---------------------------------------------------------------- */
  var editingId = null;
  var deleteArmed = false;

  function $(sel) {
    return document.querySelector(sel);
  }

  function dialog() {
    return $("#custom-dialog");
  }

  function resetDeleteButton() {
    var del = $("#custom-delete");
    deleteArmed = false;
    del.textContent = "Delete";
    del.classList.remove("danger");
  }

  function open(id) {
    editingId = id || null;
    var table = editingId ? byId(editingId) : null;

    $("#custom-dialog-title").textContent = table ? "Edit custom table" : "New custom table";
    $("#custom-title").value = table ? table.title : "";
    $("#custom-entries").value = table ? table.entries.join("\n") : "";
    $("#custom-error").textContent = "";
    $("#custom-delete").style.display = table ? "" : "none";
    resetDeleteButton();

    var d = dialog();
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
    setTimeout(function () {
      $("#custom-title").focus();
    }, 30);
  }

  function close() {
    var d = dialog();
    if (typeof d.close === "function") d.close();
    else d.removeAttribute("open");
  }

  function parseEntries(text) {
    return String(text)
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(function (line) {
        return line !== "";
      });
  }

  function commit() {
    var title = $("#custom-title").value.trim();
    var entries = parseEntries($("#custom-entries").value);

    if (!title) {
      $("#custom-error").textContent = "Give the table a title.";
      $("#custom-title").focus();
      return;
    }
    if (!entries.length) {
      $("#custom-error").textContent = "Add at least one result, one per line.";
      $("#custom-entries").focus();
      return;
    }

    var all = load();
    var savedId = editingId;
    if (editingId) {
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === editingId) {
          all[i].title = title;
          all[i].entries = entries;
          break;
        }
      }
    } else {
      savedId = newId();
      all.push({ id: savedId, title: title, entries: entries });
    }
    save(all);
    close();

    var wasNew = !editingId;
    refreshApp();

    // show the table that was just saved
    if (window.AppShell) {
      AppShell.goTo("Favorites", function () {
        revealTable(savedId);
      });
    }

    if (wasNew && window.Stats) Stats.note("customTablesCreated");

    if (typeof window.showalert === "function") {
      window.showalert(wasNew ? "custom added" : "custom saved");
    }
  }

  // scroll the saved table into view; custom tables sit at the end of the
  // Favorites list, which may be below the fold
  function revealTable(id) {
    setTimeout(function () {
      var control = document.querySelector('.edit-custom[data-custom-id="' + id + '"]');
      if (!control) return;
      var row = control.closest(".list-item");
      if (!row || !row.scrollIntoView) return;
      // loadleftdisplay animates the list back to the top; stop that first or
      // it will scroll away from the row we just revealed
      if (window.jQuery) jQuery("#left-display-list").stop(true, false);
      row.scrollIntoView({ block: "nearest" });
    }, 40);
  }

  function remove() {
    if (!editingId) return;
    var all = load().filter(function (t) {
      return t.id !== editingId;
    });
    save(all);
    close();
    refreshApp();
    if (typeof window.showalert === "function") window.showalert("custom deleted");
  }

  // wipe every custom table. the caller is responsible for confirming first:
  // these are hand written, so unlike a starred favorite there is nothing to
  // restore them from.
  function clearAll() {
    save([]);
    refreshApp();
  }

  // rebuild the Favorites list and the counts around the app
  function refreshApp() {
    if (typeof window.refresh_favorites_view === "function") {
      window.refresh_favorites_view();
    }
  }

  /* ------------------------------------------------------------------
   * Wiring
   * ---------------------------------------------------------------- */
  function init() {
    $("#custom-save").addEventListener("click", commit);
    $("#custom-cancel").addEventListener("click", close);

    $("#custom-delete").addEventListener("click", function () {
      // two-step so a stray click cannot destroy a table
      if (!deleteArmed) {
        deleteArmed = true;
        this.textContent = "Really delete?";
        this.classList.add("danger");
        return;
      }
      remove();
    });

    dialog().addEventListener("close", resetDeleteButton);

    // ctrl/cmd+enter saves from anywhere in the form
    dialog().addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        commit();
      }
    });

    // open the editor from the header button and from each row's edit control
    document.addEventListener("click", function (e) {
      var add = e.target.closest && e.target.closest(".new-custom-table");
      if (add) {
        open(null);
        return;
      }
      var edit = e.target.closest && e.target.closest(".edit-custom");
      if (edit) {
        e.stopPropagation();
        e.preventDefault();
        open(edit.getAttribute("data-custom-id"));
      }
    });
  }

  window.CustomTables = {
    asMenuItems: asMenuItems,
    clearAll: clearAll,
    count: count,
    pick: pick,
    open: open,
    init: init,
  };
})();
