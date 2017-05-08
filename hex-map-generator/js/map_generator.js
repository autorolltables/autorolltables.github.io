
/****************************/
/*  Default Details
/****************************/

var canvas = oCanvas.create({
	canvas: "#canvas"
});

var canvas_array=[];
var map_type = "random";
var iterations = 100; // this must be larger than the number of hexes, otherwise you wont get them all.  It can be less, but you will only fill out this may hexes. (+1 for the starting hex)
var debug_messages = true;
var finished = false;
var last_type = "";
var Hex = struct("x y type obj text_obj");

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

var roll_table=[];
roll_table[0] = [0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9]; // Plains column
roll_table[1] = [0,0,0,1,1,1,1,1,1,1,1,2,2,3,4,5,6,7,8,9]; // Scrub column
roll_table[2] = [0,1,1,1,2,2,2,2,2,2,2,2,2,2,3,4,6,7,8,9]; // Forest column
roll_table[3] = [0,0,1,1,2,3,3,3,4,4,5,5,5,5,5,6,6,7,8,9]; // Rough column
roll_table[4] = [0,0,0,1,1,3,3,3,4,4,4,4,4,4,5,6,6,7,8,9]; // Desert column
roll_table[5] = [0,1,1,2,2,3,3,4,5,5,5,5,5,5,6,6,7,8,8,9]; // Hills column
roll_table[6] = [0,1,2,3,3,4,5,5,5,5,6,6,6,6,6,6,6,6,8,9]; // Mountains column
roll_table[7] = [0,0,1,1,2,2,3,5,7,7,7,7,7,7,7,8,8,8,8,9]; // Marsh



/********************************************************/
/*  PROCESSES
/********************************************************/

function struct(names) {
  var names = names.split(' ');
  var count = names.length;
  function constructor() {
    for (var i = 0; i < count; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}


function draw_iterative_map() {
	draw_initial_board();
	var middle_hex = get_middle_hex(canvas.width / 2, canvas.height / 2);

	// generate random type for middle hex
	last_type = middle_hex.type = get_random_type_first();
	update_color_initial(middle_hex);

	var last_hex = middle_hex;
	for (var i=0; i<iterations; i++){

		// pick random hex
		random_hex = pick_random_border_hex(last_hex)
		if (finished) {break;}

		// identify new type (based on last and this)
		random_hex.type = identify_new_type();

		// udpate hex
		update_color_initial(random_hex);
		//add_hex(random_hex.x, random_hex.y, random_hex.type);
		last_hex = random_hex;

	}
	canvas.redraw();
}

function draw_random_map() {

  // default start point
  var x = 100;
  var y = 100;
  var height = 184; //121+60
  var cols = 8;
  var cols_off_row = 9;
  var total_rows = 4;
	map_type = "random";

  for (a=0; a<=total_rows; a++) {
    drawrow(x,y,cols);
    draw_off_row(x,y,cols_off_row);
    y=y+height;
  }
	// alert(canvas_array.length);
}

function draw_initial_board() {
	  // default start point
	  var x = 100;
	  var y = 70;
	  var height = 184; //121+60
	  var cols = 8;
	  var cols_off_row = 9;
	  var total_rows = 4;
		map_type="grey";

	  for (a=0; a<=total_rows; a++) {
	    drawrow(x,y,cols);
	    draw_off_row(x,y,cols_off_row);
	    y=y+height;
	  }
}

function draw_off_row(x,y,z) {
  var off = 54;
  var height_off = 92;

  for (i = 0; i < z; i++) {
    z_new = (z + ((i+1) * 107)) - off;
    y_new = y+ height_off
    add_hex(z_new,y_new,map_type);
  }
}

// draw a row of hex
function drawrow(x,y,z) {
  for (i = 0; i < z; i++) {
    z_new = z + ((i+1) * 107);
    add_hex(z_new,y,map_type);
  }
}

/********************************************************/
/*  FUNCTIONS
/********************************************************/

function add_hex(in_x, in_y, type) {

	//log("Adding Hex: ["+in_x+", "+in_y+", "+type+"]");
	var color="black";

  if(in_x == ""){in_x = canvas.width / 2;}
  if(in_y == ""){in_y = canvas.height / 2;}

  if(type=="grey"){
    // color = "image(img/grass.jpg)";
		color = get_color(type);
  } else if( type=="random" ){
    type = get_random_type();
	  color = get_color(type);
  } else {
		color = get_color(type);
	}

  var hex_obj = canvas.display.polygon({
  	x: in_x,
  	y: in_y,
  	sides: 6,
  	radius: 60,
    rotation: 30,
  	fill: color
  });

	display_text = get_text(type);
	var text_obj = canvas.display.text({
		x: in_x,
		y: in_y,
		origin: { x: "center", y: "center" },
		font: "15px sans-serif",
		text: display_text,
		fill: "#000"
	});

	// create obj to send to canvas_array
	var hex = new Hex(in_x, in_y, type, hex_obj, text_obj);

  add_to_array(hex);

  canvas.addChild(hex_obj);
	canvas.addChild(text_obj);

}

function add_to_array(hex) {
  // iterate array to identify if it exists
  var i;
  var replaced=false;
  for (var i=0; i<canvas_array.length; i++){
    if((canvas_array[i].x==hex.x)&&(canvas_array[i].y==hex.y)){
			canvas.removeChild(canvas_array[i].obj);
      canvas_array.splice(i,1);
      replaced=true;
    }
    if (replaced) break;
  }
  // add new item
  canvas_array.push(hex);
}

function identify_new_type() {
	//log("Old Type:" + last_type);
	d20 = random_int(1,20); // roll d20 for next land type
	new_type = roll_table[last_type][d20-1];
	//log("New Type: [New:"+new_type+", Last:"+last_type+", d20:"+d20+"]");
	if((new_type!=8)&&(new_type!=9)) {	// ignore last type for pools and depressions
		last_type = new_type;
	}
	return new_type;
}

function update_color(hex) {
	//log("Updated Hex: ["+hex.x+", "+hex.y+", "+hex.type+"]")
	hex.obj.fill = get_color(hex.type);
	hex.text_obj.text = get_text(hex.type);
	canvas.redraw();
}

function update_color_initial(hex) {
	//log("Updated Hex: ["+hex.x+", "+hex.y+", "+hex.type+"]")
	hex.obj.fill = get_color(hex.type);
	hex.text_obj.text = get_text(hex.type);
}

function get_random_type() {
  biome = Math.floor(Math.random() * 10);
	//log("New Type:" + biome);
  return biome;
}

function get_random_type_first() {
  biome = Math.floor(Math.random() * 8);
	//log("New Type:" + biome);
  return biome;
}

function get_random_color() {
  type = get_random_type();
  return get_color(type);
}

function get_color(type){
  switch(type) {
    case 0:
      return "#ddd254";	// plains
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
		case "grey":
			return "#c0c0c0"; // default for initial map layout
			break;
    default:
      return "black";	// error of some sort
  }
  return "black";	// error of some sort
}

function get_text(type) {
	switch(type) {
    case 0:
      return "Plains";	// plains
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
      return "";	// error of some sort
  }
  return "";	// error of some sort
}

function remove_hex(hex){
	// iterate array to identify if it exists
	//log("Removing Hex: ["+hex.x+", "+hex.y+"]");
  var i;
  var replaced=false;
  for (i=0; i<canvas_array.length; i++){
    if((canvas_array[i].x==hex.x)&&(canvas_array[i].y==hex.y)){
      canvas.removeChild(canvas_array[i].obj);
      canvas_array.splice(i,1);
      replaced=true;
    }
    if (replaced) break;
  }
}

function random_int(min,max) {
	var random_int = Math.floor(Math.random()*(max-min+1)+min);
	//log("Random:["+random_int+"]")
  return random_int;
}

function pick_random_border_hex(hex) {
	var near_hexes = get_near_grey_hexes(hex);
	var number_of_hexes = near_hexes.length;
	//log("Near Hexes Identified: " + number_of_hexes);

	if (number_of_hexes > 0) {
		rand_int = random_int(0,number_of_hexes-1);
		var random_hex = near_hexes[rand_int];
		//log("Picked Random Hex: ["+random_hex.x+", "+random_hex.y+", "+random_hex.type+"]")
		return random_hex;
	} else {
		if (finished) {return 0};
		log("Error Picking Random Hex.");
		return 0;
	}
}

function get_near_grey_hexes(hex) {

	//get closest hex and distance to it
	var closest_other = get_closest_other_grey_hex(hex.x, hex.y);
	var distance = get_distance(hex.x, hex.y, closest_other.x, closest_other.y);
	// add a little distance to range for slight differences between nearest hexes
	distance = distance + (distance * 0.05);
	// iterate all hexes and find all those within the "distance" to nearest, return array of hexes
	var near_hexes=[];
	for (var i=0; i<canvas_array.length; i++) {
		curr_distance = get_distance(hex.x, hex.y, canvas_array[i].x, canvas_array[i].y);
		if((curr_distance < distance)&&(curr_distance!=0)&&(canvas_array[i].type=="grey")) {
			//log("* Near Hex Identified: [dist:"+curr_distance+"|x:"+canvas_array[i].x+"|y:"+canvas_array[i].y+"]");
			near_hexes.push(canvas_array[i]);
		}
	}

	return near_hexes;
}

function get_closest_other_grey_hex(screen_mid_x, screen_mid_y) {

	var closest_hex=canvas_array[0];
	var distance=9999;
	var updates=0;
	for (var i=0; i<canvas_array.length; i++) {
		curr_distance = get_distance(screen_mid_x, screen_mid_y, canvas_array[i].x, canvas_array[i].y);
		if((curr_distance < distance)&&(curr_distance!=0)&&(canvas_array[i].type=="grey")) {
			//log("--- Closer Hex identified ["+curr_distance+"]")
			distance = curr_distance;
			closest_hex = canvas_array[i];
			updates++;
		}
	}
	if (updates==0) {
		log("All hexes have been filled.");
		finished=true;
	}
	return closest_hex;
}

function get_middle_hex(screen_mid_x, screen_mid_y) {
	var closest_hex=canvas_array[0];
	var distance=9999;
	for (var i=0; i<canvas_array.length; i++) {
		curr_distance = get_distance(screen_mid_x, screen_mid_y, canvas_array[i].x, canvas_array[i].y);
		if(curr_distance < distance) {
			distance = curr_distance;
			closest_hex = canvas_array[i];
		}
	}
	return closest_hex;
}

function get_distance(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;
	var distance = Math.sqrt( a*a + b*b );
	//log("---Distance ["+x1+", "+y1+"] to ["+x2+", "+y2+"] is ["+distance+"]")
	return distance;
}

function log(msg) {
	if (debug_messages) {console.log(msg);}
}

/****************************/
/*  Init / Runtime
/****************************/

function save_as_image(link) {
	// var image = document.getElementById('canvas').toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
	// window.location.href = image; // it will save locally

	link.href = document.getElementById('canvas').toDataURL();
	link.download = "region-map.png";
	link.blur();

}

function toggle_key(e) {
  if ($('#key').filter(":visible").length) {
    $('#key').hide();
  } else {
		$('#key').css({top: e.pageY, left: e.pageX-27})
    $('#key').show();
		$('body').one('click',function() { hide_key(); });
  }
}

function hide_key() {
	$('#key').hide();
}

function hide_menu() {
	$('#index-menu').hide();
}

function toggle_menu(e) {
  if ($('#index-menu').filter(":visible").length) {
    $('#index-menu').hide();
  } else {
		$('#index-menu').css({top: e.pageY, left: e.pageX-27})
    $('#index-menu').show();
		$('body').one('click',function() { hide_menu(); });
  }
}

var dragOptions = { changeZindex: true };
canvas.setLoop(function () {});

draw_iterative_map();
// draw_random_map();

/****************************/
/*  Events
/****************************/

$('body').on('click', '#random_map_button', function() { canvas.clear(); draw_random_map(); });
$('body').on('click', '#iterative_map_button', function() { canvas.clear(); draw_iterative_map(); });
$('body').on('click', '#save_link', function() { save_as_image(this); });
$('body').on('click', '#show_key_button', function(e) { toggle_key(e); });
$('body').on('click', '#key', function(e) { toggle_key(e); });
$('body').on('click', '#reload', function() { window.location.reload(); });

// top menu
$('body').on('click', '.menu-button', function(e) { toggle_menu(e); } );
$('body').on('click', '#menu-auto-roll-tables', function() { window.location.replace("../index.html"); } );
$('body').on('click', '#menu-region-map-generator', function() { window.location.replace("hex_map_generator.html"); } );


// button.bind("click tap", function () {
// 	if (canvas.timeline.running) {
// 		canvas.timeline.stop();
// 	} else {
// 		canvas.timeline.start();
// 	}
// });
