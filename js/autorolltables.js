// autorolltables
// developed by dangeratio
//
//

var current;
var side_obj;
var side_obj_display;
var mouseover_on = true;

function log(obj) {
  console.log(obj);
}

function display_side(){
  copyseparator = "------------------------------------------\n";
  displayseparator = "<hr>";

  $("#rightview-current").html( $("#rightview-current").html() + side_obj );

  if ( $("#rightview-history").html() == "" ) {
    $("#rightview-history").html( side_obj );
  } else {
    $("#rightview-history").html( $("#rightview-history").html() + copyseparator + side_obj );
  }

  $("#rightview-current-display").html( $("#rightview-current-display").html() + side_obj_display );

  if ( $("#rightview-history-display").html() == "" ) {
    $("#rightview-history-display").html( side_obj_display );
  } else {
    $("#rightview-history-display").html( $("#rightview-history-display").html() + displayseparator + side_obj_display );
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
  side_obj_display = side_obj_display + obj + "<br>";
}

function clearright() {
  $("#rightview-current").html('');
  $("#rightview-current-display").html('');
  side_obj = "";
  side_obj_display = "";
  return 0;
}

function clearSelect() {
  var select = document.getElementById("selectlist");
  var length = select.options.length;
  for (i = select.options.length; i > -1; i--) {
    select.options[i] = null;
  }
}

function get_table(table){
  switch(table) {
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


// fill select table helper function
function loadSelect(curr_table) {

  clearSelect();
  var selectlist = document.getElementById("selectlist");
  var rollbutton = document.getElementById("roll");

  // find the correct menu (from the selected menu item)
  menu = top.menu;
  for(i=0;i<menu.length;i++){
    if(menu[i].title==curr_table){
      current = menu[i];
    }
  }

  menu_id = "#" + curr_table;
  $(".menuitem").removeClass('menu-selected');
  $(menu_id).addClass('menu-selected');

  // iterate that menu, and add items to select
  for (var i = 0; i < current.items.length; i++) {
    selectlist.options[selectlist.options.length] = new Option(current.items[i].title,current.items[i].title);
  }
}

// return menu variable from table name
function get_menu(table_name) {
  menu = top.menu;
  for(i=0;i<menu.length;i++){
    if(menu[i].id==table_name){
      return menu[i];
    }
  }
}

// get table split from main_roll id
function get_roll_table(id_string){
  var tmp = id_string.split("/");
  return tmp[0];
}

// get id split from main_roll id
function get_roll_id(id_string){
  var tmp = id_string.toString().split("/");
  return tmp[1];
}

// return menu variable from table name
function get_roll_array(roll_name, title) {
  menu = top.menu
  for(i=0;i<menu.length;i++){
    if(menu[i].id==title){
      for(z=0;z<menu[i].items.length;z++){
        if(menu[i].items[z].title==roll_name){
          return menu[i].items[z];
        }
      }
    }
  }
}

// get title of roll from roll id and table
function get_roll(id, table){
  table = get_table(table);
  for(i=0;i<table.length;i++){
    if(table[i].id==id){
      return table[i];
    }
  }
  return "";
}

//find a roll title
function get_roll_title(val) {
  rolls = top.rolls;
  for(i=0; i<rolls.length; i++) {
    if(rolls[i].id == val) {
      return i.title;
    }
  }
}


// initial load of select list
function init() {
  // default to dungeons
  current = top.menu[0];

  // fill select
  var selectlist = document.getElementById("selectlist");
  var rollbutton = document.getElementById("roll");

  for (var i = 0; i < current.items.length; i++) {
    var title = current.items[i].title
    selectlist.options[selectlist.options.length] = new Option(title, title);
  }


  var menuhover;
  try {
    window.location.querystring["menuhover"]
  } catch(e) {}

  if ( menuhover == 'false' ){
    togglehovermenu();
  }

  //hide initially hidden
  $('#rightview-history').hide();
  $('#rightview-current').hide();
  $('#rightview-history-display').hide();
  $("#success-alert").hide();
  $("#fail-alert").hide();
  // $('.hover-icon').addClass("hoveroff");

}


// regex for identifying sub-rolls
var inline_roll_match = /\([dD][\d]{1,3}\) ?:/;
var indicator_match = /\<\*>.? ? ?([^\d]*)/;
var d_match = /^[dD]/;

// sub roll (for inline string rolls)
function inline_roll(roll_text) {

  var result = "";

  // identify roll type
  roll_type = roll_text.match(inline_roll_match);
  roll_description = roll_text.substring(0, roll_type.index).trim();
  roll_text_without = roll_text.replace(roll_type,"");
  roll_type = roll_type[0].replace(":","").replace(" ","").replace(")","").replace("(","").replace("d","").replace("D","");

  // attempt to pull integer out of it, if not, send back source string
  try {
    roll_type = parseInt(roll_type);
  } catch(e) {
    return roll_text;
  }

  // roll a random 1 - roll_type
  var rand = Math.ceil(Math.random() * roll_type);

  // find that number with a period afterwards, capture next non-whitespace character through until next decimal number detected.
  roll_text_without = roll_text_without.replace(rand,"<*>");

  // regex match for indicator string <*> to the next decimal, capturing
  roll_text_without = roll_text_without.match(indicator_match);
  result = roll_text_without[1].replace(/^\s+/, '').replace(/\s+$/, '').replace(/[;,.]$/, '');

  // return display in a clear format
  return "(d" + roll_type + ") " + roll_description + ": " + result;
}

// test button
function roll_test() {

  var sel = document.getElementById("selectlist");
  var index = sel.selectedIndex;
  var seltext = sel.options;

  clearright();
  side("Tests:");
  side_display("Tests:");

  // get length of all
  var total=0;
  for (var z = 0; z < roll_table.length; z++){
    for (var i = 0; i < roll_table[z].rolls.length; i++) {
      for (var a = 0; a < roll_table[z].rolls[i].roll.length; a++){
        var returned = roll_table[z].rolls[i].roll[a];

        if(returned.match(inline_roll_match)) {
          returned = inline_roll(returned);
        }
      }
    }
  }

  display_side();

  document.getElementById("test").focus();
}

function get_roll_title(id, table) {
  table = get_table(table);
  for(i=0;i<table.length;i++){
    if(table[i].id==id){
      return table[i].title;
    }
  }
  return "";
}

function roll_roll(id, table){
  table = get_table(table);
  for(i=0;i<table.length;i++){
    if(table[i].id==id){
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

  for(var i=0;i<table.length;i++) {
    if(table[i].id==id){
      // found correct sub-roll id

      var title = table[i].title;
      var type = table[i].roll_type;
      var number = table[i].number;
      var percent_of = table[i].percent_of;
      var percent_to = table[i].percent_to;

      if(Math.ceil(Math.random() * 100)<=percent_to){

        if(type=="type"){
          // execute type roll
          var length = table[i].roll.length;
          var amount = get_roll_value(number);
          amount = Math.ceil(amount * (percent_of / 100));

          side( title + " : " + amount );
          side_display(title + " : <b>" + amount + "</b>");

          // roll that many times
          for(var z=0;z<amount;z++){
            // roll for each roll
            var pre_title = "(" + (z+1) + ") ";
            var pre = "     ";
            var pre_display = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

            // for each roll in total amount, roll main (random * length), then roll all sub-attributes accordingly
            var rand = Math.floor(Math.random() * length);  // floor to match array counting (start at 0)
            var rolls = table[i].roll[rand].main_rolls;

            // show title of this result
            side(pre_title + table[i].roll[rand].title);
            side_display("<b>" + pre_title + table[i].roll[rand].title + "</b>");
            side_display("<div class='indent'>");

            for(var x=0; x<rolls.length;x++){

              id = get_roll_id(rolls[x]);
              sub_table = get_roll_table(rolls[x]);
              sub_title = get_roll_title(id, sub_table);
              value = roll_roll(id, sub_table);

              if(value.match(inline_roll_match)) {value = inline_roll(value);}

              side(pre + sub_title + " : " + value);
              side_display(sub_title + " : <b>" + value + "</b>");

            }

            side_display("</div>");

          }
        } else if(type=="amount") {
          var length = table[i].rolls.length;
          var singular_item = table[i].singular;
          var amount = get_roll_value(number);
          amount = Math.ceil(amount * (percent_of / 100));

          side(title + " : " + amount);
          side_display(title + " : <b>" + amount + "</b>");

          // roll that many times
          for(var z=0;z<amount;z++){
            // roll for each roll

            side("(" + (z+1) + ") " + singular_item);
            side_display("<b>(" + (z+1) + ") " + singular_item + "</b>");

            var pre = "     ";
            var pre_display = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

            side_display("<div class='indent'>");

            for(var x=0;x<length;x++) {
              // roll sub-roll this number of times

              id = get_roll_id(table[i].rolls[x]);
              sub_table = get_roll_table(table[i].rolls[x]);
              sub_title = get_roll_title(id, sub_table);
              value = roll_roll(id, sub_table);

              if(value.match(inline_roll_match)) {value = inline_roll(value);}

              side(pre + sub_title + " : " + value);
              side_display( sub_title + " : <b>" + value + "</b>");

            }

            side_display("</div>");

          }
        }
      }
    }
  }

  if( result != "" ){
    return result;
  } else {
    return "";
  }

}

function get_roll_value(str) {

  // interpret various rolls - d10, 1d10, 4d4, maybe even 6d6+10 someday (but not currently)
  var value=0;

  if(str.match(d_match)) {
    // single roll (no number before the "d")

    // remove the d
    str = str.toLowerCase().replace("d","");
    // roll randomly
    var rand = Math.ceil(Math.random() * parseInt(str));
    return rand;

  } else {
    // multiple rolls (split on the "d" and execute a random [1] [0] times)

    str = str.toLowerCase().split("d");

    var total = 0;
    for(var a=0;a<str[0];a++){
      var rand = Math.ceil(Math.random() * parseInt(str[1]));
      total = total + rand;
    }
    return total;
  }
  return "";
}

// roll function

function perform_roll() {

  var sel = document.getElementById("selectlist");
  var index = sel.selectedIndex;

  if ( sel.options[index] == null ) {
    showalert("nothing selected");
    return;
  }

  var seltext = sel.options[index].value;

  roll_table = get_roll_array(seltext, current.id);
  if_zero_dont_show_mainrolls = roll_table.main_rolls.length;
  if_zero_dont_show_subrolls = roll_table.sub_rolls.length;

  clearright();

  side("Title: " + roll_table.title);
  side(" ");
  side("Suggested Use: " + roll_table.use);

  side_display("<span class='roll-title'>" + roll_table.title + "</span>");
  side_display(" ");
  side_display("Suggested Use: <span class='roll-suggested-use'>" + roll_table.use + "</span>");

  if ( if_zero_dont_show_mainrolls != 0 ) {

    side(" ");
    side_display(" ");

    // iterate the menu, displaying the values for main rolls
    for (var i = 0; i < roll_table.main_rolls.length; i++) {
      id = get_roll_id(roll_table.main_rolls[i]);
      table = get_roll_table(roll_table.main_rolls[i]);
      roll = get_roll(id, table);
      value = roll_roll(id, table);

      // care for sub-rolls if they exist
      if(value.match(inline_roll_match)) {value = inline_roll(value);}

      side(roll.title + " : " + value);
      side_display(roll.title + " : <b>" + value + "</b>");
    }

  }

  if ( if_zero_dont_show_subrolls != 0 ) {

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
  $("#selectlist").focus();
}


// copy to clipboard - current roll
var copyTextareaBtn = document.querySelector('.current-copy-button');
copyTextareaBtn.addEventListener('click', function(event) {
  if ( $('#rightview-current').html() == "" ) {
    showalert("copy current blank");
    return;
  }
  $('#rightview-current').show();
  var copyTextarea = document.querySelector('.current-textarea');
  copyTextarea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    clearright();
    $("#selectlist").focus();
    showalert('copy current');
  } catch (err) {
    showalert('unable to copy');
  }
  $('#rightview-current').hide();
});

// copy to clipboard - history rolls
var copyTextareaBtn = document.querySelector('.history-copy-button');
copyTextareaBtn.addEventListener('click', function(event) {
  if ( $('#rightview-history').html() == "" ) {
    showalert("copy history blank");
    return;
  }
  $('#rightview-history').show();
  var copyTextarea = document.querySelector('.history-textarea');
  copyTextarea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    clearhistory(false);
    $("#selectlist").focus();
    showalert('copy history');
  } catch (err) {
    showalert('unable to copy');
  }
  $('#rightview-history').hide();
});

function togglehovermenu() {
  if ( mouseover_on == true ) {
    mouseover_on = false;
    $('.hover-icon').addClass('hoveroff');
    showalert("hover off");
  } else {
    mouseover_on = true;
    $('.hover-icon').removeClass('hoveroff');
    showalert("hover on");
  }
}

function mouseover_loadSelect(obj) {
  if ( mouseover_on == true ) { loadSelect(obj); }
}

function showhistory() {
  $('#current-roll-tab').removeClass('active');
  $('#history-roll-tab').addClass('active');
  $('#rightview-current-display').hide();
  $('#rightview-history-display').show();
  rightscrolltop();
  $('#rightview-history-display').focus();
}

function showcurrent() {
  $('#history-roll-tab').removeClass('active');
  $('#current-roll-tab').addClass('active');
  $('#rightview-history-display').hide();
  $('#rightview-current-display').show();
  rightscrolltop();
  $('#rightview-current-display').focus();
}

function rightscrolltop() {
  $("#rightview-history-display").animate({ scrollTop: 0 }, "fast");
  $("#rightview-current-display").animate({ scrollTop: 0 }, "fast");
}

function clearhistory(show) {
  $('#rightview-current').html("");
  $('#rightview-history').html("");
  $('#rightview-current-display').html("");
  $('#rightview-history-display').html("");
  side_obj = "";
  side_obj_display = "";
  if (show == true) {
    showalert("clear history");
  }
  $("#selectlist").focus();
}

function create_guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function showalert(alert){

  var alert_text = "";
  var alert_type = "";
  none="false";

  switch(alert) {
    case "copy history":
      alert_type = "success";
      alert_text = "Copied History Successfully <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "copy current":
      alert_type = "success";
      alert_text = "Copied Current Roll Successfully <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "clear history":
      alert_type = "success";
      alert_text = "Cleared History <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "hover on":
      alert_type = "success";
      alert_text = "Menu Hover On <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "hover off":
      alert_type = "success";
      alert_text = "Menu Hover Off <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "copy history blank":
      alert_type = "danger";
      alert_text = "History Empty <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "copy current blank":
      alert_type = "danger";
      alert_text = "Current Roll Empty <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "unable to copy":
      alert_type = "danger";
      alert_text = "Error: Unable to Copy <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "nothing selected":
      alert_type = "danger";
      alert_text = "Nothing Selected <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "none":
      none = "true";
      break;
    }

  //<div id='success-alert' class='alert alert-success' data-alert='alert'></div>
  //<div id='fail-alert' class='alert alert-danger' data-alert='alert'></div>

  if (none == "false") {

    id = create_guid();
    $('#alerts').append("<div id='" + id + "' class='alert alert-" + alert_type + "' data-alert='alert'>" + alert_text + "</div>");
    id = "#" + id;
    $(id).fadeIn("slow", function() { $(this).delay(500).fadeOut(); });

  }
}

var menu_item_template = "<a href='#' class='menuitem btn'>DESC</a>";
menu = top.menu;
for(i=0;i<menu.length;i++){
  $(".menu").append(menu_item_template.replace("DESC",menu[i].title));
  //console.log(menu[i].title);
}


// events

$("#selectlist").bind('click', function() { perform_roll(); });
$("#roll").bind('click', function() { perform_roll(); });
$("#test").bind('click', function() { roll_test(); });

$('#history-roll-tab').bind('click', function() { showhistory(); });
$('#current-roll-tab').bind('click', function() { showcurrent(); });
$('#clear-history-roll-tab').bind('click', function() { clearhistory(true); });

$('.hover-icon-clickarea').bind('click', function() { togglehovermenu(); });
$(".menuitem").bind('mouseover', function() { mouseover_loadSelect($(this).attr('id')); });
$(".menuitem").bind('click', function() { loadSelect($(this).attr('id')); });

$(document).ready(function() {
  init();
});
