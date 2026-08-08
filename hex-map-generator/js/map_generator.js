/****************************/
/*  Display Details
/****************************/

// the canvas fills whatever space the shell gives it
var canvas_holder = document.getElementById("canvas-holder");
var canvas_width = 800;
var canvas_height = 600;

function measure_canvas() {
  if (!canvas_holder) return;
  canvas_width = Math.max(240, Math.floor(canvas_holder.clientWidth));
  canvas_height = Math.max(240, Math.floor(canvas_holder.clientHeight));
}

measure_canvas();
$("#canvas").attr("width", canvas_width).attr("height", canvas_height);

/****************************/
/*  Default Details
/****************************/

var canvas = oCanvas.create({
  canvas: "#canvas",
});

var canvas_array = [];
// hexes still awaiting a terrain type. the fill loop only ever scans these, so
// its cost shrinks as the map fills instead of rescanning the whole board.
var grey_hexes = [];
// "x,y" -> hex, so replacing a hex at a known position is a lookup, not a scan
var hex_index = {};
// reused between passes so the fill loop does not allocate an array per hex
var squared_scratch = [];
var map_type = "grey";
var debug_messages = true;
var finished = false;
var last_type = "";
var Hex = struct("x y type obj text_obj");
var rad, font_size;

//////////////////////////////////////////////////
// gygax_table is from page 173 of 1e Dungeon Masters Guide, section titled Appendix B: Random Wilderness Terrain
//////////////////////////////////////////////////
// gygax_table format is as follows:
// L = Last terrain type, 1-20 = Value selected for d20 roll for new terrain type
// gygax_table[L][1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
// Reference:
// Plains = 0
// Scrub = 1
// Forest = 2
// Rough = 3
// Desert = 4
// Hills = 5
// Mountains = 6
// Marsh = 7
// Pond = 8
// Depression = 9
// Note: as the book states, Pond or Depressions are ignored when the next terrain type is rolled for.

var roll_table = [];
roll_table[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Plains column
roll_table[1] = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9]; // Scrub column
roll_table[2] = [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 6, 7, 8, 9]; // Forest column
roll_table[3] = [0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 6, 6, 7, 8, 9]; // Rough column
roll_table[4] = [0, 0, 0, 1, 1, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 6, 6, 7, 8, 9]; // Desert column
roll_table[5] = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 5, 5, 5, 5, 6, 6, 7, 8, 8, 9]; // Hills column
roll_table[6] = [0, 1, 2, 3, 3, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 8, 9]; // Mountains column
roll_table[7] = [0, 0, 1, 1, 2, 2, 3, 5, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 9]; // Marsh

/********************************************************/
/*  PROCESSES
/********************************************************/

function struct(names) {
  var names = names.split(" ");
  var count = names.length;
  function constructor() {
    for (var i = 0; i < count; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}

function draw_iterative_map() {
  // re-measure first, so Generate always fits the current layout even after
  // the window was resized or the sidebar collapsed
  measure_canvas();
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  reset_board();
  draw_initial_board();
  var middle_hex = get_middle_hex(canvas.width / 2, canvas.height / 2);

  // generate random type for middle hex
  last_type = get_random_type_first();
  assign_type(middle_hex, last_type);

  // exactly one hex is filled per pass, so this covers the whole board no
  // matter how many hexes the screen fits. a fixed cap used to leave large
  // displays half unfilled.
  var iterations = canvas_array.length;

  var last_hex = middle_hex;
  for (var i = 0; i < iterations; i++) {
    // pick random hex
    var random_hex = pick_random_border_hex(last_hex);
    if (random_hex === null) {
      break;
    }

    // identify new type (based on last and this), then update the hex
    assign_type(random_hex, identify_new_type());
    last_hex = random_hex;
  }

  // every hex was added and recoloured with drawing suppressed, so paint the
  // finished board in a single pass
  canvas.redraw();
}

// clear all state so the map can be generated more than once per page load
function reset_board() {
  for (var i = 0; i < canvas_array.length; i++) {
    canvas.removeChild(canvas_array[i].obj, false);
    canvas.removeChild(canvas_array[i].text_obj, false);
  }
  canvas_array = [];
  grey_hexes = [];
  hex_index = {};
  finished = false;
  last_type = "";
}

// give a hex its terrain type and take it out of the pool of unfilled hexes
function assign_type(hex, type) {
  hex.type = type;
  pool_remove(hex);
  update_hex_display(hex);
}

// the unfilled pool is an unordered array; each hex remembers its own slot so
// removing one is a swap with the last entry rather than a search
function pool_add(hex) {
  hex.pool_index = grey_hexes.length;
  grey_hexes.push(hex);
}

function pool_remove(hex) {
  var pos = hex.pool_index;
  if (pos === undefined || pos < 0) {
    return;
  }
  var last = grey_hexes[grey_hexes.length - 1];
  grey_hexes[pos] = last;
  last.pool_index = pos;
  grey_hexes.pop();
  hex.pool_index = -1;
}

function draw_initial_board() {
  // default start point
  // var x = 100;
  var x = 1.6 * rad;
  // var y = 70;
  var y = rad * 1.1;

  // var cols = 8;
  var one_hex_width = rad * 1.75 + 2;
  var cols = Math.floor(canvas_width / one_hex_width) - 2;
  var cols_off_row = cols + 1;
  log("Cols: [" + cols + "|" + cols_off_row + "]");

  // var total_rows = 4;
  var one_row_height = rad * 3 + 4;
  var total_rows = Math.floor(canvas_height / one_row_height) - 1;
  log("Rows:" + total_rows + "[" + one_row_height + "," + canvas_height + "]");

  // var height = 184; //121+60
  var height = rad * 3 + 1;
  map_type = "grey";

  for (var a = 0; a <= total_rows; a++) {
    drawrow(x, y, cols);
    draw_off_row(x, y, cols_off_row);
    y = y + height + 3;
  }
}

function draw_off_row(x, y, z) {
  // var off = 54;
  var off = rad * 0.9 + 1;
  // var height_off = 92;
  var height_off = rad * 1.5 + 2;
  // var width = 107;
  var width = rad * 1.75 + 2;

  var y_new = y + height_off;
  for (var i = 0; i < z; i++) {
    add_hex(x + (i + 1) * width - off, y_new, map_type);
  }
}

// draw a row of hex
function drawrow(x, y, z) {
  // var width = 107;
  var width = rad * 1.75 + 2;
  for (var i = 0; i < z; i++) {
    add_hex(x + (i + 1) * width, y, map_type);
  }
}

/********************************************************/
/*  FUNCTIONS
/********************************************************/

function add_hex(in_x, in_y, type) {
  if (in_x === "" || in_x === undefined || in_x === null) {
    in_x = canvas.width / 2;
  }
  if (in_y === "" || in_y === undefined || in_y === null) {
    in_y = canvas.height / 2;
  }

  var hex_obj = canvas.display.polygon({
    x: in_x,
    y: in_y,
    sides: 6,
    radius: rad,
    rotation: 30,
    fill: get_color(type),
  });

  var text_obj = canvas.display.text({
    x: in_x,
    y: in_y,
    origin: { x: "center", y: "center" },
    font: font_size + " sans-serif",
    text: get_text(type),
    fill: "#000",
  });

  // create obj to send to canvas_array
  var hex = new Hex(in_x, in_y, type, hex_obj, text_obj);

  add_to_array(hex);

  // pass false so oCanvas does not repaint the whole board for every single
  // hex; the caller repaints once when the map is complete
  canvas.addChild(hex_obj, false);
  canvas.addChild(text_obj, false);
}

function position_key(x, y) {
  return x + "," + y;
}

function add_to_array(hex) {
  // replace any hex already at this position
  var key = position_key(hex.x, hex.y);
  var existing = hex_index[key];
  if (existing !== undefined) {
    remove_hex(existing);
  }

  canvas_array.push(hex);
  hex_index[key] = hex;
  if (hex.type === "grey") {
    pool_add(hex);
  }
}

function identify_new_type() {
  //log("Old Type:" + last_type);
  var d20 = random_int(1, 20); // roll d20 for next land type
  var new_type = roll_table[last_type][d20 - 1];
  //log("New Type: [New:"+new_type+", Last:"+last_type+", d20:"+d20+"]");
  if (new_type != 8 && new_type != 9) {
    // ignore last type for pools and depressions
    last_type = new_type;
  }
  return new_type;
}

// repaint is deferred until the whole map is built, so this only updates state
function update_hex_display(hex) {
  //log("Updated Hex: ["+hex.x+", "+hex.y+", "+hex.type+"]")
  hex.obj.fill = get_color(hex.type);
  hex.text_obj.text = get_text(hex.type);
}

function get_random_type_first() {
  return Math.floor(Math.random() * 8);
}

function get_color(type) {
  switch (type) {
    case 0:
      return "#ddd254"; // plains
      break;
    case 1:
      return "#afa642"; // scrub
      break;
    case 2:
      return "#338e29"; // forest
      break;
    case 3:
      return "#9e6429"; // rough
      break;
    case 4:
      return "#fcf68d"; // desert
      break;
    case 5:
      return "#2f774d"; // hills
      break;
    case 6:
      return "#9e9f9e"; // mountains
      break;
    case 7:
      return "#a5d8a0"; // marsh
      break;
    case 8:
      return "#3399ff"; // pond
      break;
    case 9:
      return "#7e7f7e"; // depression
      break;
    case "grey":
      return "#505050"; // default for initial map layout
      break;
    default:
      return "black"; // error of some sort
  }
  return "black"; // error of some sort
}

function get_text(type) {
  switch (type) {
    case 0:
      return "Plains"; // plains
      break;
    case 1:
      return "Brush"; // scrub
      break;
    case 2:
      return "Forest"; // forest
      break;
    case 3:
      return "Rough"; // rough
      break;
    case 4:
      return "Desert"; // desert
      break;
    case 5:
      return "Hills"; // hills
      break;
    case 6:
      return "Mountains"; // mountains
      break;
    case 7:
      return "Marsh"; // marsh
      break;
    case 8:
      return "Water"; // Pond, renamed to Water
      break;
    case 9:
      return "Valley"; //Depression
      break;
    case "grey":
      return ""; // default for initial map layout
      break;
    default:
      return ""; // error of some sort
  }
  return ""; // error of some sort
}

function remove_hex(hex) {
  //log("Removing Hex: ["+hex.x+", "+hex.y+"]");
  var key = position_key(hex.x, hex.y);
  var existing = hex_index[key];
  if (existing === undefined) {
    return;
  }

  // remove the label as well as the hex itself, otherwise the old text is
  // orphaned on the canvas
  canvas.removeChild(existing.obj, false);
  canvas.removeChild(existing.text_obj, false);

  pool_remove(existing);
  delete hex_index[key];

  var pos = canvas_array.indexOf(existing);
  if (pos !== -1) {
    canvas_array.splice(pos, 1);
  }
}

function random_int(min, max) {
  var random_int = Math.floor(Math.random() * (max - min + 1) + min);
  //log("Random:["+random_int+"]")
  return random_int;
}

// returns the next hex to fill, or null once the board is complete
function pick_random_border_hex(hex) {
  var near_hexes = get_near_grey_hexes(hex);
  var number_of_hexes = near_hexes.length;
  //log("Near Hexes Identified: " + number_of_hexes);

  if (number_of_hexes > 0) {
    var random_hex = near_hexes[random_int(0, number_of_hexes - 1)];
    //log("Picked Random Hex: ["+random_hex.x+", "+random_hex.y+", "+random_hex.type+"]")
    return random_hex;
  }

  if (!finished) {
    log("Error Picking Random Hex.");
  }
  return null;
}

// all unfilled hexes that tie for closest to the given hex. only the pool of
// unfilled hexes is scanned, so this gets cheaper as the map fills in.
function get_near_grey_hexes(hex) {
  if (grey_hexes.length === 0) {
    log("All hexes have been filled.");
    finished = true;
    return [];
  }

  // squared distances are compared throughout: ordering is the same as for
  // real distances, and it keeps a square root out of this inner loop
  var i;
  var dx;
  var dy;
  var curr_sq;
  var closest_sq = Infinity;
  var squared = squared_scratch;
  squared.length = grey_hexes.length;

  for (i = 0; i < grey_hexes.length; i++) {
    dx = hex.x - grey_hexes[i].x;
    dy = hex.y - grey_hexes[i].y;
    curr_sq = dx * dx + dy * dy;
    squared[i] = curr_sq;
    if (curr_sq !== 0 && curr_sq < closest_sq) {
      //log("--- Closer Hex identified ["+curr_sq+"]")
      closest_sq = curr_sq;
    }
  }

  if (closest_sq === Infinity) {
    log("All hexes have been filled.");
    finished = true;
    return [];
  }

  // add a little distance to range for slight differences between nearest
  // hexes. 1.05 on the distance is 1.05 * 1.05 on the squared distance.
  var limit_sq = closest_sq * 1.05 * 1.05;
  var near_hexes = [];
  for (i = 0; i < grey_hexes.length; i++) {
    if (squared[i] < limit_sq && squared[i] !== 0) {
      //log("* Near Hex Identified: [dist:"+squared[i]+"]");
      near_hexes.push(grey_hexes[i]);
    }
  }

  return near_hexes;
}

function get_middle_hex(screen_mid_x, screen_mid_y) {
  var closest_hex = canvas_array[0];
  var distance = Infinity;
  for (var i = 0; i < canvas_array.length; i++) {
    var curr_distance = get_distance(
      screen_mid_x,
      screen_mid_y,
      canvas_array[i].x,
      canvas_array[i].y
    );
    if (curr_distance < distance) {
      distance = curr_distance;
      closest_hex = canvas_array[i];
    }
  }
  return closest_hex;
}

function get_distance(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y1 - y2;
  var distance = Math.sqrt(a * a + b * b);
  //log("---Distance ["+x1+", "+y1+"] to ["+x2+", "+y2+"] is ["+distance+"]")
  return distance;
}

function log(msg) {
  if (debug_messages) {
    console.log(msg);
  }
}

(function($) {
  $.QueryString = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split("=", 2);
      if (p.length != 2) continue;
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split("&"));
})(jQuery);

/****************************/
/*  Init / Runtime
/****************************/

function save_as_image(link) {
  // var image = document.getElementById('canvas').toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
  // window.location.href = image; // it will save locally

  link.href = document.getElementById("canvas").toDataURL();
  link.download = "hex-map.png";
  link.blur();
}

function open_key() {
  var dialog = document.getElementById("key");
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function close_key() {
  var dialog = document.getElementById("key");
  if (!dialog) return;
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function clear_sizes() {
  $("#map-size .seg").removeClass("active").attr("aria-pressed", "false");
}

// the "s" / "m" / "l" querystring value is the HEX radius, which runs opposite
// to the map size the buttons offer: small hexes mean more of them, so ?s=s
// produces the "Large" map. the ids below are named for the map size the user
// picked, so they read the same way as the button labels.
function select_size() {
  // get querystring size
  var size = $.QueryString.s;
  if (!size) {
    size = "m";
  }

  clear_sizes();

  var button;
  switch (size) {
    case "s":
      button = "#map-large";
      rad = 30; // radius of the hexes
      font_size = "10px";
      break;
    case "l":
      button = "#map-small";
      rad = 100; // radius of the hexes
      font_size = "20px";
      break;
    default:
      // covers "m"
      button = "#map-medium";
      rad = 60; // radius of the hexes
      font_size = "15px";
      break;
  }
  $(button).addClass("active").attr("aria-pressed", "true");
}

// var dragOptions = { changeZindex: true };
// canvas.setLoop(function () {});

/****************************/
/*  Events
/****************************/

$("body").on("click", "#save_link", function() {
  save_as_image(this);
});
$("body").on("click", "#show_key_button", function() {
  open_key();
});
$("body").on("click", "#key-close", function() {
  close_key();
});
// generate in place rather than reloading the page
$("body").on("click", "#reload", function() {
  draw_iterative_map();
  $(this).blur();
});

// sizes (querystring value is the hex radius, so it reads inverted - see
// select_size). existing ?s= links keep working unchanged.
function go_to_size(hex_size) {
  window.location.href =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?s=" +
    hex_size;
}

$("body").on("click", "#map-large", function() {
  go_to_size("s");
});
$("body").on("click", "#map-medium", function() {
  go_to_size("m");
});
$("body").on("click", "#map-small", function() {
  go_to_size("l");
});

// get size from querystring and build accordingly
$(function() {
  select_size();

  draw_iterative_map();

  // draw_initial_board();
});
