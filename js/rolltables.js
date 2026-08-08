// autorolltables
// developed by dangeratio
//
//

// initial variables

var current;
var side_obj;
var obj_current_display;
var obj_history_display;
var mouseover_on = false;
var delete_enabled = false;
let favorites = [];
let currentSelectedMenu = "";

function init() {
  loadFavorites();

  //hide initially hidden
  $("#rightview-history-display").hide();
  $("#collapse-history-tab").hide();
  $("#expand-history-tab").hide();
  $("#clear-history-roll-tab").hide();
  $(".history-copy-button").hide();

  show_empty_current();

  CustomTables.init();
  Backup.init();

  // the shell renders the nav and opens whichever category the URL asks for,
  // which is what fills the table list
  AppShell.boot();

  // check querystring for menuhover
  menuhovercheck();

  // querystring filter
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("filter")) {
    $("#filter").val(urlParams.get("filter"));
    filter();
  }
}

// placeholder shown in the result pane before anything has been rolled
function show_empty_current() {
  $("#rightview-current-display").html(
    '<div class="result-empty"><div class="big">&#9860;</div>' +
      "Pick a table on the left to roll it.</div>"
  );
}

function log(obj) {
  console.log(obj);
}

function display_side() {
  copyseparator = "------------------------------------------\n";
  displayseparator = ""; // <hr>

  $("#rightview-current").html($("#rightview-current").html() + side_obj);

  if ($("#rightview-history").html() == "") {
    $("#rightview-history").html(side_obj);
  } else {
    $("#rightview-history").html(
      $("#rightview-history").html() + copyseparator + side_obj
    );
  }

  $("#rightview-current-display").html(
    $("#rightview-current-display").html() + obj_current_display
  );

  copy_div = "<div class='for-copy'>" + side_obj + "</div></div>"; // inside end of displayed roll

  if ($("#rightview-history-display").html() == "") {
    $("#rightview-history-display").html(obj_history_display + copy_div);
  } else {
    $("#rightview-history-display").html(
      $("#rightview-history-display").html() +
        displayseparator +
        obj_history_display +
        copy_div
    );
  }

  rightscrolltop();
}

function output_filter(obj) {
  return obj;
}

function display_filter(obj) {
  return obj;
}

function side(obj) {
  side_obj = side_obj + obj + "\n";
  return 0;
}

function side_display(obj) {
  obj_current_display = obj_current_display + obj + "<br>";
  obj_history_display = obj_history_display + obj + "<br>";
}

function side_display_current(obj) {
  obj_current_display = obj_current_display + obj + "<br>";
}

function side_display_history(obj, show_break) {
  if (show_break == true) {
    obj_history_display = obj_history_display + obj + "<br>";
  } else {
    obj_history_display = obj_history_display + obj;
  }
}

function clearright() {
  $("#rightview-current").html("");
  $("#rightview-current-display").html("");
  side_obj = "";
  obj_current_display = "";
  obj_history_display = "";
  return 0;
}

function get_table(table) {
  switch (table) {
    case "dungeons":
      return top.dungeons;
      break;
    case "factions":
      return top.factions;
      break;
    case "food":
      return top.food;
      break;
    case "magic":
      return top.magic;
      break;
    case "monsters":
      return top.monsters;
      break;
    case "npcs":
      return top.npcs;
      break;
    case "objects":
      return top.objects;
      break;
    case "plots":
      return top.plots;
      break;
    case "settlements":
      return top.settlements;
      break;
    case "wilderness":
      return top.wilderness;
      break;
    case "subrolls":
      return top.subrolls;
      break;
  }
}

function clearleft() {
  $("#left-display-list")
    .children()
    .remove();
}

function loadleftdisplay(curr_table) {
  clearleft();

  // find the correct menu (from the selected menu item)
  menu = top.menu;
  for (i = 0; i < menu.length; i++) {
    if (menu[i].title == curr_table) {
      current = menu[i];
    }
  }

  currentSelectedMenu = curr_table;

  if (!current || current.items.length === 0) {
    $("#left-display-list").html(
      '<div class="list-empty">' +
        (curr_table === "Favorites"
          ? "Nothing here yet. Star a table in any category to pin it, or use " +
            "<b>New custom table</b> to write your own."
          : "No tables in this category.") +
        "</div>"
    );
    leftscrolltop();
    return;
  }

  // build the list in one pass, then insert it once
  var html = "";
  var custom_heading_written = false;
  for (var i = 0; i < current.items.length; i++) {
    var item = current.items[i];
    var title = item.title;
    var is_sub = AppShell.isSubItem(item);

    // custom tables are grouped under their own heading at the end of the list
    if (item.custom && !custom_heading_written) {
      html += '<div class="list-group-label">Custom tables</div>';
      custom_heading_written = true;
    }
    // "- " marks a sub-table of the entry above; show that with indentation
    // rather than punctuation
    var display_title = is_sub ? title.replace(/^-\s*/, "") : title;
    var is_favorite = favorites.indexOf(title) !== -1;

    // the trailing "(...)" part of a title is detail, so it goes on its own line
    if (display_title.indexOf("(") !== -1) {
      display_title =
        display_title.replace(/\(/g, "<span class='subtext'>(") + "</span>";
    }

    // a custom table is always in Favorites, so it gets an edit control where
    // a built-in table gets its star
    var trailing = item.custom
      ? '<button type="button" class="edit-custom" data-custom-id="' + item.customId +
        '" title="Edit this table" aria-label="Edit this table">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 h4 L19 9 a2 2 0 0 0-3-3 L5 17 Z"/></svg>' +
        "</button>"
      : '<span class="dofavorite' + (is_favorite ? " favorite" : "") + '" title="Toggle favorite"></span>';

    html +=
      '<div class="list-item' + (is_sub ? " sub-item" : "") + '" listid="' + i +
      '" item="' + title.replace(/"/g, "&quot;") + '">' +
      display_title +
      (item.custom ? '<span class="badge-custom">Custom</span>' : "") +
      trailing +
      "</div>";
  }
  $("#left-display-list").html(html);

  // re-apply any active filter so switching category keeps the search
  if ($("#filter").val()) {
    filter();
  }

  leftscrolltop();
}

// return menu variable from table name
function get_menu(table_name) {
  menu = top.menu;
  for (i = 0; i < menu.length; i++) {
    if (menu[i].id == table_name) {
      return menu[i];
    }
  }
}

// get table split from main_roll id
function get_roll_table(id_string) {
  var tmp = id_string.split("/");
  return tmp[0];
}

// get id split from main_roll id
function get_roll_id(id_string) {
  var tmp = id_string.toString().split("/");
  return tmp[1];
}

// return menu variable from table name
function get_roll_array(roll_name, title) {
  menu = top.menu;
  for (i = 0; i < menu.length; i++) {
    if (menu[i].id == title) {
      for (z = 0; z < menu[i].items.length; z++) {
        if (menu[i].items[z].title == roll_name) {
          return menu[i].items[z];
        }
      }
    }
  }
}

// get title of roll from roll id and table
function get_roll(id, table) {
  table = get_table(table);
  for (i = 0; i < table.length; i++) {
    if (table[i].id == id) {
      return table[i];
    }
  }
  return "";
}

// used by menuhover querystring: ?menuhover=false on URL turns off menu hover function
function getquerystring(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// ?menuhover=true / =false on the URL overrides the Settings preference for
// this visit, so old links keep working
function menuhovercheck() {
  var menuhover = "";
  try {
    menuhover = getquerystring("menuhover");
  } catch (e) {}

  if (menuhover == "true") {
    mouseover_on = true;
  } else if (menuhover == "false") {
    mouseover_on = false;
  }
}

function loadLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function writeLocalStorage(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

function loadFavorites() {
  favorites = loadLocalStorage("favorites").sort();

  // reset current favorites Menu
  const menuFavorites = top.menu.find((m) => m.title === "Favorites");

  const nextFavorites = [];
  const allTables = top.menu.find((m) => m.title === "All").items;

  favorites.forEach((favorite) => {
    const table = allTables.find((table) => table.title === favorite);
    if (table) {
      nextFavorites.push(table);
    }
  });

  // user-written tables always live in Favorites, after the starred ones
  menuFavorites.items = nextFavorites.concat(CustomTables.asMenuItems());
}

function editFavorites(target) {
  const title = target.parent().attr("item");
  const isFavorite = target.hasClass("favorite");

  if (!isFavorite) {
    favorites.push(title);
  } else {
    favorites = favorites.filter((favorite) => favorite !== title);
  }

  target.toggleClass("favorite");

  writeLocalStorage("favorites", favorites);
  reloadFavorites();
  if (currentSelectedMenu === "Favorites") {
    loadleftdisplay("Favorites");
  }
}

function reloadFavorites() {
  loadFavorites();
  AppShell.refreshCounts();
  AppShell.updateSub(currentSelectedMenu);
  AppShell.syncSettings();
}

// rebuild Favorites and, if it is the category on screen, redraw the list.
// custom-tables.js calls this after adding, editing or deleting a table
// (currentSelectedMenu is a `let`, so it is not reachable as a window property
// from another script).
function refresh_favorites_view() {
  reloadFavorites();
  if (currentSelectedMenu === "Favorites") {
    loadleftdisplay("Favorites");
    AppShell.updateSub("Favorites");
  }
}

// regex for identifying sub-rolls
var inline_roll_match = /\([dD][\d]{1,3}\) ?:/;
var d_match = /^[dD]/;

// sub roll (for inline string rolls)
function inline_roll(roll_text) {
  // identify roll type
  var roll_type = roll_text.match(inline_roll_match);
  if (roll_type == null) {
    return roll_text;
  }
  var roll_description = roll_text.substring(0, roll_type.index).trim();
  var roll_text_without = roll_text.replace(roll_type[0], "");
  var die = parseInt(roll_type[0].replace(/[^0-9]/g, ""), 10);
  if (isNaN(die) || die < 1) {
    return roll_text;
  }

  // roll a random 1 - die
  var rand = Math.ceil(Math.random() * die);

  // find "<rand>." at an option boundary (start of string or after
  // whitespace/separator, never inside another number or dice notation like
  // "2d6") and capture through to the next numbered option or end of string,
  // so results containing digits are kept intact
  var option_match = new RegExp(
    "(?:^|[\\s;,])" + rand + "\\.\\s*([\\s\\S]*?)(?=[;,]?\\s+\\d{1,3}\\.\\s|$)"
  );
  var found = roll_text_without.match(option_match);
  if (found == null) {
    return roll_text;
  }
  var result = found[1].trim().replace(/[;,.]$/, "");

  // return display in a clear format
  return "(d" + die + ") " + roll_description + ": " + result;
}

function get_roll_title(id, table) {
  table = get_table(table);
  for (i = 0; i < table.length; i++) {
    if (table[i].id == id) {
      return table[i].title;
    }
  }
  return "";
}

function roll_roll(id, table) {
  table = get_table(table);
  for (i = 0; i < table.length; i++) {
    if (table[i].id == id) {
      var length = table[i].roll.length;
      // log("roll length:"+length);
      var rand = Math.floor(Math.random() * length);
      return table[i].roll[rand];
    }
  }
  return "";
}

function roll_sub_roll(id, table) {
  var table = get_table(table);
  var result = "";

  for (var i = 0; i < table.length; i++) {
    if (table[i].id == id) {
      // found correct sub-roll id

      var title = table[i].title;
      var type = table[i].roll_type;
      var number = table[i].number;
      var percent_of = table[i].percent_of;
      var percent_to = table[i].percent_to;

      if (Math.ceil(Math.random() * 100) <= percent_to) {
        if (type == "type") {
          // execute type roll
          var length = table[i].roll.length;
          var amount = get_roll_value(number);
          amount = Math.ceil(amount * (percent_of / 100));

          side(title + " : " + amount);
          side_display(title + " : <b>" + amount + "</b>");

          // roll that many times
          for (var z = 0; z < amount; z++) {
            // roll for each roll
            var pre_title = "(" + (z + 1) + ") ";
            var pre = "     ";
            var pre_display = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

            // for each roll in total amount, roll main (random * length), then roll all sub-attributes accordingly
            var rand = Math.floor(Math.random() * length); // floor to match array counting (start at 0)
            var rolls = table[i].roll[rand].main_rolls;

            // show title of this result
            side(pre_title + table[i].roll[rand].title);
            side_display(
              "<b>" + pre_title + table[i].roll[rand].title + "</b>"
            );
            side_display("<div class='indent'>");

            for (var x = 0; x < rolls.length; x++) {
              id = get_roll_id(rolls[x]);
              sub_table = get_roll_table(rolls[x]);
              sub_title = get_roll_title(id, sub_table);
              value = roll_roll(id, sub_table);

              if (value.match(inline_roll_match)) {
                value = inline_roll(value);
              }

              side(pre + sub_title + " : " + value);
              side_display(sub_title + " : <b>" + value + "</b>");
            }

            side_display("</div>");
          }
        } else if (type == "amount") {
          var length = table[i].rolls.length;
          var singular_item = table[i].singular;
          var amount = get_roll_value(number);
          amount = Math.ceil(amount * (percent_of / 100));

          side(title + " : " + amount);
          side_display(title + " : <b>" + amount + "</b>");

          // roll that many times
          for (var z = 0; z < amount; z++) {
            // roll for each roll

            side("(" + (z + 1) + ") " + singular_item);
            side_display("<b>(" + (z + 1) + ") " + singular_item + "</b>");

            var pre = "     ";
            var pre_display = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

            side_display("<div class='indent'>");

            for (var x = 0; x < length; x++) {
              // roll sub-roll this number of times

              id = get_roll_id(table[i].rolls[x]);
              sub_table = get_roll_table(table[i].rolls[x]);
              sub_title = get_roll_title(id, sub_table);
              value = roll_roll(id, sub_table);

              if (value.match(inline_roll_match)) {
                value = inline_roll(value);
              }

              side(pre + sub_title + " : " + value);
              side_display(sub_title + " : <b>" + value + "</b>");
            }

            side_display("</div>");
          }
        }
      }
    }
  }

  if (result != "") {
    return result;
  } else {
    return "";
  }
}

function get_roll_value(str) {
  // interpret various rolls - d10, 1d10, 4d4, maybe even 6d6+10 someday (but not currently)

  if (str.match(d_match)) {
    // single roll (no number before the "d")

    var sides = parseInt(str.toLowerCase().replace("d", ""), 10);
    if (isNaN(sides) || sides < 1) {
      return 0;
    }
    return Math.ceil(Math.random() * sides);
  } else {
    // multiple rolls (split on the "d" and execute a random [1] [0] times)

    var parts = str.toLowerCase().split("d");
    var count = parseInt(parts[0], 10);
    var sides = parseInt(parts[1], 10);
    if (isNaN(count) || isNaN(sides) || count < 1 || sides < 1) {
      return 0;
    }

    var total = 0;
    for (var a = 0; a < count; a++) {
      total = total + Math.ceil(Math.random() * sides);
    }
    return total;
  }
}

// select function
function selectitem(obj) {
  $(".list-selected").removeClass("list-selected");
  obj.addClass("list-selected");
}

function perform_roll() {
  var selected_id = $(".list-selected").attr("listid");

  if (selected_id == null) {
    showalert("nothing selected");
    return;
  }

  // look the entry up by its position in the list rather than by title: a few
  // categories contain more than one table with the same name, and a title
  // lookup always returns the first of them
  roll_table = current.items[parseInt(selected_id, 10)];
  if (!roll_table) {
    roll_table = get_roll_array($(".list-selected").attr("item"), current.id);
  }
  if (!roll_table) {
    showalert("nothing selected");
    return;
  }

  if (roll_table.custom) {
    perform_custom_roll(roll_table);
    return;
  }

  if_zero_dont_show_mainrolls = roll_table.main_rolls.length;
  if_zero_dont_show_subrolls = roll_table.sub_rolls.length;

  clearright();

  var roll_table_title = roll_table.title;
  if (roll_table_title.substring(0, 2) == "- ") {
    roll_table_title = roll_table_title.substring(2, roll_table_title.length);
  }

  side("Title: " + roll_table_title);
  side(" ");
  side("Suggested Use: " + roll_table.use);
  side_display_current(
    "<span class='roll-title'>" + roll_table_title + "</span>"
  );
  side_display_current(" ");
  side_display_history(
    "<div class='accordion roll-title-history'>" +
      roll_table_title +
      " <div class='history-item-menu'><div class='delete-history-item glyphicon glyphicon-trash'></div> <div class='expand-collapse glyphicon glyphicon-chevron-down'></div></div></div>",
    false
  );
  side_display_history("<div class='panel'>", false);
  side_display(
    "Suggested Use: <span class='roll-suggested-use'>" +
      roll_table.use +
      "</span>"
  );

  if (if_zero_dont_show_mainrolls != 0) {
    side(" ");
    side_display(" ");

    // iterate the menu, displaying the values for main rolls
    for (var i = 0; i < roll_table.main_rolls.length; i++) {
      id = get_roll_id(roll_table.main_rolls[i]);
      table = get_roll_table(roll_table.main_rolls[i]);
      roll = get_roll(id, table);
      value = roll_roll(id, table);

      // care for sub-rolls if they exist
      if (value.match(inline_roll_match)) {
        value = inline_roll(value);
      }

      side(roll.title + " : " + value);
      side_display(roll.title + " : <b>" + value + "</b>");
    }
  }

  if (if_zero_dont_show_subrolls != 0) {
    side(" ");
    side_display(" ");

    // iterate the menu, displaying the values for sub rolls
    for (var i = 0; i < roll_table.sub_rolls.length; i++) {
      id = get_roll_id(roll_table.sub_rolls[i]);
      table = get_roll_table(roll_table.sub_rolls[i]);
      roll = get_roll(id, table);
      value = roll_sub_roll(id, table);
    }
  }

  display_side();
  rightscrolltop();
  blur();
}

// a custom table is a plain list, so a roll is one line picked from it. the
// output is built the same way as a built-in roll so history and copy work
// without any special cases.
function perform_custom_roll(roll_table) {
  clearright();

  var title = roll_table.title;
  var count = roll_table.entries.length;
  var note = "Custom table, " + count + (count === 1 ? " result" : " results");

  side("Title: " + title);
  side(" ");
  side(note);
  side_display_current("<span class='roll-title'>" + title + "</span>");
  side_display_current(" ");
  side_display_history(
    "<div class='accordion roll-title-history'>" +
      title +
      " <span class='badge-custom'>Custom</span>" +
      " <div class='history-item-menu'><div class='delete-history-item glyphicon glyphicon-trash'></div> <div class='expand-collapse glyphicon glyphicon-chevron-down'></div></div></div>",
    false
  );
  side_display_history("<div class='panel'>", false);
  side_display("<span class='roll-suggested-use'>" + note + "</span>");

  side(" ");
  side_display(" ");

  var value = CustomTables.pick(roll_table);
  // custom entries may use the same inline "(d6): 1. a; 2. b" syntax
  if (value.match(inline_roll_match)) {
    value = inline_roll(value);
  }

  side("Result : " + value);
  side_display("<b>" + value + "</b>");

  display_side();
  rightscrolltop();
  blur();
}

// copy to clipboard - current roll
var copyTextareaBtn = document.querySelector(".current-copy-button");
copyTextareaBtn.addEventListener("click", function(event) {
  if ($("#rightview-current").html() == "") {
    showalert("copy current blank");
    return;
  }
  $("#rightview-current").show();
  var copyTextarea = document.querySelector(".current-textarea");
  copyTextarea.select();
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    blur();
    showalert("copy current");
  } catch (err) {
    showalert("unable to copy");
  }
  $("#rightview-current").hide();
});

// copy to clipboard - history rolls
var copyTextareaBtn = document.querySelector(".history-copy-button");
copyTextareaBtn.addEventListener("click", function(event) {
  if ($("#rightview-history").html() == "") {
    showalert("copy history blank");
    return;
  }
  process_history();
  $("#rightview-history").show();
  var copyTextarea = document.querySelector(".history-textarea");
  copyTextarea.select();
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    blur();
    showalert("copy history");
  } catch (err) {
    showalert("unable to copy");
  }
  $("#rightview-history").hide();
});

function process_history() {
  var separator = "------------------------------------------\n";
  var copy_list = document
    .getElementById("rightview-history-display")
    .getElementsByClassName("for-copy"); //[0]
  var copy_output = "";
  for (var i = 0; i < copy_list.length; i++) {
    if (i != 0) {
      copy_output += separator;
    }
    copy_output = copy_output + copy_list[i].innerHTML;
  }
  $("#rightview-history").html(copy_output);
}

//
// function process_history() {
//   separator = "------------------------------------------\n";
//   $('#rightview-history-hidden').contents();
//   $('#rightview-history-hidden').html($('#rightview-history-display').html());
//   $('#rightview-history-hidden').children("*").replaceWith(function(){ return this.innerHTML; });
//   $('#rightview-history-hidden').children("div.glyphicon").remove();
//   $('#rightview-history-hidden').children("br").replaceWith(function() { return "\n"; });
//   //$('#rightview-history-hidden').find(".panel").replaceWith(function() { return "\n" + this.innerHTML + separator + ""; });
//   //$('#rightview-history-hidden').find(".accordion").replaceWith(function() { return "Title: " + this.innerHTML + "\n"; });
//   //$('#rightview-history-hidden').find(".roll-suggested-use").replaceWith(function() { return this.innerHTML; });
//   // $('#rightview-history-hidden').find(".roll-title").replaceWith(function() { return this.innerHTML; });
//   // $('#rightview-history-hidden').find("div").replaceWith(function() { return this.innerHTML; });
//   // $('#rightview-history-hidden').find("b").replaceWith(function() { return this.innerHTML; });
//   // $('#rightview-history-hidden').find("span").remove();
//
//   $('#rightview-history').html($('#rightview-history-hidden').html());
// }

function showhistory() {
  $("#current-roll-tab").removeClass("active");
  $("#history-roll-tab").addClass("active");
  $("#rightview-current-display").hide();
  $("#rightview-history-display").show();
  rightscrolltop();

  // functions
  $("#collapse-history-tab").show();
  $("#expand-history-tab").show();
  $("#clear-history-roll-tab").show();
  $(".history-copy-button").show();
  $(".current-copy-button").hide();
  blur();
}

function showcurrent() {
  $("#history-roll-tab").removeClass("active");
  $("#current-roll-tab").addClass("active");
  $("#rightview-history-display").hide();
  $("#rightview-current-display").show();
  rightscrolltop();

  // functions
  $("#collapse-history-tab").hide();
  $("#expand-history-tab").hide();
  $("#clear-history-roll-tab").hide();
  $(".history-copy-button").hide();
  $(".current-copy-button").show();
  blur();
}

function leftscrolltop() {
  $("#left-display-list").animate({ scrollTop: 0 }, "fast");
}

function rightscrolltop() {
  $("#rightview-history-display").animate({ scrollTop: 0 }, "fast");
  $("#rightview-current-display").animate({ scrollTop: 0 }, "fast");
}

function blur() {
  $(":focus").blur();
  document.getSelection().removeAllRanges();
}

function clearhistory(show) {
  $("#rightview-current").html("");
  $("#rightview-history").html("");
  $("#rightview-history-display").html("");
  show_empty_current();
  side_obj = "";
  obj_current_display = "";
  obj_history_display = "";
  if (show == true) {
    showalert("clear history");
  }
}

function collapse_history() {
  $(".panel").removeClass("show");
  $(".accordion").removeClass("active");
  blur();
}

function expand_history() {
  $(".panel").addClass("show");
  $(".accordion").addClass("active");
  blur();
}

function create_guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// jquery regex extender.  source: http://james.padolsey.com/javascript/regex-selector-for-jquery/
jQuery.expr[":"].regex = function(elem, index, match) {
  var matchParams = match[3].split(","),
    validLabels = /^(data|css):/,
    attr = {
      method: matchParams[0].match(validLabels)
        ? matchParams[0].split(":")[0]
        : "attr",
      property: matchParams.shift().replace(validLabels, ""),
    },
    regexFlags = "ig",
    regex = new RegExp(
      matchParams.join("").replace(/^\s+|\s+$/g, ""),
      regexFlags
    );
  return regex.test(jQuery(elem)[attr.method](attr.property));
};

function filter() {
  // hide all elements in left nav
  $("#left-display-list")
    .children(".list-item")
    .hide();

  // show only those that match the filter (escape regex metacharacters so
  // input like "(" is treated as literal text instead of throwing)
  var filter_text = $("#filter")
    .val()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var item = "div:regex(item," + filter_text + ")";
  $("#left-display-list")
    .children(item)
    .show();

  leftscrolltop();
}

function showalert(alert) {
  var alert_text = "";
  var alert_type = "";
  none = "false";

  switch (alert) {
    case "copy history":
      alert_type = "success";
      alert_text =
        "Copied History Successfully <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "copy current":
      alert_type = "success";
      alert_text =
        "Copied Current Roll Successfully <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "clear history":
      alert_type = "success";
      alert_text =
        "Cleared History <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "hover on":
      alert_type = "success";
      alert_text = "Menu Hover On <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "hover off":
      alert_type = "success";
      alert_text =
        "Menu Hover Off <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "settings saved":
      alert_type = "success";
      alert_text = "Settings Saved <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "favorites cleared":
      alert_type = "success";
      alert_text =
        "Favorites Cleared <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "custom added":
      alert_type = "success";
      alert_text =
        "Custom Table Added <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "custom saved":
      alert_type = "success";
      alert_text =
        "Custom Table Saved <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "custom deleted":
      alert_type = "success";
      alert_text =
        "Custom Table Deleted <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "custom save failed":
      alert_type = "danger";
      alert_text =
        "Could Not Save <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "backup exported":
      alert_type = "success";
      alert_text =
        "Backup Exported <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "backup imported":
      alert_type = "success";
      alert_text =
        "Backup Imported <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "copy history blank":
      alert_type = "danger";
      alert_text =
        "History Empty <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "copy current blank":
      alert_type = "danger";
      alert_text =
        "Current Roll Empty <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "unable to copy":
      alert_type = "danger";
      alert_text =
        "Error: Unable to Copy <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "nothing selected":
      alert_type = "danger";
      alert_text =
        "Nothing Selected <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "history item deleted":
      alert_type = "success";
      alert_text =
        "History Item Deleted <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "none":
      none = "true";
      break;
  }

  //<div id='success-alert' class='alert alert-success' data-alert='alert'></div>
  //<div id='fail-alert' class='alert alert-danger' data-alert='alert'></div>

  if (none == "false") {
    id = create_guid();
    $("#alerts").append(
      "<div id='" +
        id +
        "' class='alert alert-" +
        alert_type +
        "' data-alert='alert'>" +
        alert_text +
        "</div>"
    );
    id = "#" + id;

    $(id).fadeIn("slow", function() {
      $(this)
        .delay(750)
        .fadeOut();
    });
  }
}

// events

$("body").on("mouseenter", ".delete-history-item", function() {
  delete_enabled = true;
});
$("body").on("mouseleave", ".delete-history-item", function() {
  delete_enabled = false;
});
$("body").on("click", ".list-item", function() {
  selectitem($(this));
  perform_roll();
});

$("body").on("click", ".dofavorite", function() {
  editFavorites($(this));
  /* prevent default (no rolling when adding / removing favorite) */
  return false;
});

$("body").on("click", "#roll", function() {
  perform_roll();
});
$("body").on("click", "#history-roll-tab", function() {
  showhistory();
});
$("body").on("click", "#current-roll-tab", function() {
  showcurrent();
});
$("body").on("click", "#clear-history-roll-tab", function() {
  clearhistory(true);
});
$("body").on("click", "#collapse-history-tab", function() {
  collapse_history();
});
$("body").on("click", "#expand-history-tab", function() {
  expand_history();
});
$("body").on("keyup", "#filter", function() {
  filter();
});
$("body").on("change", "#filter", function() {
  filter();
});
$("body").on("click", "#filter-button", function() {
  filter();
});
$("body").on("click", "#filter-clear", function() {
  $("#filter").val("");
  filter();
});

$("body").on("click", ".delete-history-item", function() {
  $(this)
    .parent()
    .parent()
    .next()
    .remove();
  $(this)
    .parent()
    .parent()
    .remove();
});

// accordion
$("body").on("click", ".accordion", function(e) {
  if (delete_enabled == true) {
    $(this)
      .next()
      .remove();
    $(this).remove();
    process_history();
    showalert("history item deleted");
    delete_enabled = false;
  } else {
    if (
      $(this)
        .children(".history-item-menu")
        .children(".glyphicon-chevron-down").length
    ) {
      $(this)
        .children(".history-item-menu")
        .children(".glyphicon-chevron-down")
        .toggleClass("glyphicon-chevron-up")
        .toggleClass("glyphicon-chevron-down");
    } else {
      $(this)
        .children(".history-item-menu")
        .children(".glyphicon-chevron-up")
        .toggleClass("glyphicon-chevron-down")
        .toggleClass("glyphicon-chevron-up");
    }
    $(this)
      .next()
      .toggleClass("show");
    blur();
  }
});

$(document).ready(function() {
  init();
});
