// autosave.js
//
// Auto-save to a file. Pick a file once and every later change is written to
// it, so the browser stops being the only copy of your favorites, custom
// tables and history.
//
// This needs the File System Access API, which Chrome and Edge have and
// Firefox and Safari do not. The panel hides itself where it cannot work
// rather than offering a button that fails.
//
// The file handle is structured-cloneable, so it lives in IndexedDB and
// survives a reload. The permission attached to it does not: browsers grant
// write access for one visit at a time unless the reader picks "allow on
// every visit", so after a refresh the usual state is paused, and resuming
// needs a click because requestPermission requires a user gesture.

(function () {
  "use strict";

  var IDB_NAME = "art-autosave";
  var IDB_STORE = "handles";
  var IDB_KEY = "file-handle";

  // one write per settled burst: a single roll touches history and stats, and
  // starring a run of tables fires several times in a row
  var DEBOUNCE = 1500;

  var state = {
    handle: null,
    name: "",
    at: null,
    error: "",
    perm: "granted",
    timer: null,
    busy: false,
  };

  function supported() {
    return !!(window.showSaveFilePicker && window.indexedDB);
  }

  /* ------------------------------------------------------------------
   * Handle storage
   * ---------------------------------------------------------------- */
  function openDb() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = function () {
        req.result.createObjectStore(IDB_STORE);
      };
      req.onsuccess = function () {
        resolve(req.result);
      };
      req.onerror = function () {
        reject(req.error);
      };
    });
  }

  function idbPut(value) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, "readwrite");
        if (value === null) tx.objectStore(IDB_STORE).delete(IDB_KEY);
        else tx.objectStore(IDB_STORE).put(value, IDB_KEY);
        tx.oncomplete = resolve;
        tx.onerror = function () {
          reject(tx.error);
        };
      });
    });
  }

  function idbGet() {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, "readonly");
        var req = tx.objectStore(IDB_STORE).get(IDB_KEY);
        req.onsuccess = function () {
          resolve(req.result || null);
        };
        req.onerror = function () {
          reject(req.error);
        };
      });
    });
  }

  /* ------------------------------------------------------------------
   * Wiring the file up
   * ---------------------------------------------------------------- */
  function load() {
    if (!supported()) return Promise.resolve();
    return idbGet()
      .then(function (handle) {
        if (!handle) return;
        state.handle = handle;
        state.name = handle.name || "a file";
        // queryPermission never prompts, so it is safe on load; asking for
        // permission is left to the Resume button, which has a user gesture
        return handle.queryPermission({ mode: "readwrite" }).then(function (p) {
          state.perm = p;
        });
      })
      .catch(function () {})
      .then(render);
  }

  function pick() {
    if (!supported()) return;
    window
      .showSaveFilePicker({
        suggestedName: "autorolltables-backup.json",
        types: [
          {
            description: "Auto Roll Tables backup",
            accept: { "application/json": [".json"] },
          },
        ],
      })
      .then(function (handle) {
        state.handle = handle;
        state.name = handle.name || "a file";
        state.error = "";
        state.perm = "granted";
        return idbPut(handle).then(function () {
          return write(true);
        });
      })
      .catch(function (err) {
        // the reader closing the picker is not a failure worth reporting
        if (err && err.name === "AbortError") return;
        state.error = (err && err.message) || "could not use that file";
        render();
      });
  }

  function stop() {
    clearTimeout(state.timer);
    state.handle = null;
    state.name = "";
    state.at = null;
    state.error = "";
    state.perm = "granted";
    idbPut(null)
      .catch(function () {})
      .then(function () {
        render();
        if (typeof window.showalert === "function") window.showalert("autosave off");
      });
  }

  function write(loud) {
    if (!state.handle || state.busy || !window.Backup) return Promise.resolve();
    state.busy = true;
    var handle = state.handle;

    return handle
      .queryPermission({ mode: "readwrite" })
      .then(function (p) {
        state.perm = p;
        if (p !== "granted") throw new Error("permission not granted");
        return handle.createWritable();
      })
      .then(function (writable) {
        // the same payload the Export button produces, so one file format
        var text = JSON.stringify(Backup.buildBackup(), null, 2);
        return writable.write(text).then(function () {
          return writable.close();
        });
      })
      .then(function () {
        state.at = new Date();
        state.error = "";
        if (loud && typeof window.showalert === "function") {
          window.showalert("autosave on");
        }
      })
      .catch(function (err) {
        if (state.perm === "granted") {
          state.error = (err && err.message) || "write failed";
        }
      })
      .then(function () {
        state.busy = false;
        render();
      });
  }

  // called wherever saved data changes
  function schedule() {
    if (!state.handle || state.perm !== "granted") return;
    clearTimeout(state.timer);
    state.timer = setTimeout(function () {
      write(false);
    }, DEBOUNCE);
  }

  function reconnect() {
    if (!state.handle) return;
    state.handle
      .requestPermission({ mode: "readwrite" })
      .then(function (p) {
        state.perm = p;
        if (p === "granted") {
          state.error = "";
          return write(true);
        }
        render();
      })
      .catch(function () {
        render();
      });
  }

  /* ------------------------------------------------------------------
   * The Settings panel
   * ---------------------------------------------------------------- */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function when(d) {
    if (!d) return "";
    var mins = Math.round((Date.now() - d.getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins === 1) return "a minute ago";
    if (mins < 60) return mins + " minutes ago";
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function render() {
    var panel = document.getElementById("autosave-panel");
    if (!panel) return;
    if (!supported()) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;

    var on = !!state.handle;
    var pick_btn = document.getElementById("autosave-pick");
    if (pick_btn) {
      pick_btn.textContent = on ? "Choose a different file..." : "Choose a file...";
    }
    var now_btn = document.getElementById("autosave-now");
    if (now_btn) now_btn.hidden = !on;
    var stop_btn = document.getElementById("autosave-stop");
    if (stop_btn) stop_btn.hidden = !on;

    var status = document.getElementById("autosave-status");
    if (!status) return;

    if (!on) {
      status.innerHTML =
        "Not set up. Nothing is written anywhere until you choose a file.";
      return;
    }

    // where a refresh normally leaves things, so it is worth explaining
    if (state.perm === "prompt") {
      status.innerHTML =
        "<b>Paused.</b> Browsers allow writing to a file for one visit at a time, " +
        "so this asks again after a reload. " +
        '<button type="button" class="btn small" id="autosave-resume">Resume</button>' +
        '<span class="block-hint">Choosing <b>allow on every visit</b> in the ' +
        "browser prompt stops it asking each time.</span>";
      document
        .getElementById("autosave-resume")
        .addEventListener("click", reconnect);
      return;
    }

    if (state.perm === "denied") {
      status.innerHTML =
        "<b>Blocked.</b> This browser is refusing writes to " +
        esc(state.name) +
        ", so nothing is being saved to it. Allow file editing for this site, " +
        "or choose the file again. " +
        '<button type="button" class="btn small" id="autosave-resume">Try again</button>';
      document
        .getElementById("autosave-resume")
        .addEventListener("click", reconnect);
      return;
    }

    if (state.error) {
      status.innerHTML =
        "<b>" + esc(state.name) + " could not be written:</b> " + esc(state.error);
      return;
    }

    status.textContent =
      "Saving to " +
      state.name +
      (state.at ? ", last written " + when(state.at) : ", not written yet") +
      ".";
  }

  function init() {
    var pick_btn = document.getElementById("autosave-pick");
    if (pick_btn) pick_btn.addEventListener("click", pick);
    var now_btn = document.getElementById("autosave-now");
    if (now_btn)
      now_btn.addEventListener("click", function () {
        write(true);
      });
    var stop_btn = document.getElementById("autosave-stop");
    if (stop_btn) stop_btn.addEventListener("click", stop);

    render();
    load();
  }

  window.Autosave = {
    init: init,
    schedule: schedule,
    render: render,
    supported: supported,
  };
})();
