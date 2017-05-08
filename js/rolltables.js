// autorolltables
// developed by dangeratio
//
//



// initial variables

var current;
var side_obj;
var obj_current_display;
var obj_history_display;
var mouseover_on = true;
var delete_enabled = false;


function init() {

  // load the menu
  loadmenu();

  // default to dungeons table
  loadleftdisplay("All");

  // check querystring for menuhover
  menuhovercheck();

  //hide initially hidden
  $('#rightview-history').hide();
  $('#rightview-current').hide();
  $('#rightview-history-display').hide();
  $("#success-alert").hide();
  $("#fail-alert").hide();
  $("#collapse-history-tab").hide();
  $("#expand-history-tab").hide();
  $("#clear-history-roll-tab").hide();

}

function log(obj) {
  console.log(obj);
}

function display_side(){
  copyseparator = "------------------------------------------\n";
  displayseparator = ""; // <hr>

  $("#rightview-current").html( $("#rightview-current").html() + side_obj );

  if ( $("#rightview-history").html() == "" ) {
    $("#rightview-history").html( side_obj );
  } else {
    $("#rightview-history").html( $("#rightview-history").html() + copyseparator + side_obj );
  }

  $("#rightview-current-display").html( $("#rightview-current-display").html() + obj_current_display );

  copy_div = "<div class='for-copy'>" + side_obj + "</div></div>";    // inside end of displayed roll

  if ( $("#rightview-history-display").html() == "" ) {
    $("#rightview-history-display").html( obj_history_display + copy_div );
  } else {
    $("#rightview-history-display").html( $("#rightview-history-display").html() + displayseparator + obj_history_display + copy_div );
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
  if ( show_break == true ) {
    obj_history_display = obj_history_display + obj + "<br>";
  } else {
    obj_history_display = obj_history_display + obj;
  }
}

function clearright() {
  $("#rightview-current").html('');
  $("#rightview-current-display").html('');
  side_obj = "";
  obj_current_display = "";
  obj_history_display = "";
  return 0;
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

function clearleft() {
  $('#left-display-list').children().remove();
}

function loadleftdisplay(curr_table) {
  clearleft();

  // find the correct menu (from the selected menu item)
  menu = top.menu;
  for(i=0;i<menu.length;i++){
    if(menu[i].title==curr_table){
      current = menu[i];
    }
  }

  // top menu css highlight
  menu_id = "#" + curr_table;
  $(".menuitem").removeClass('menu-selected');
  $(menu_id).addClass('menu-selected');

  // iterate that menu, and add items to select
  for (var i = 0; i < current.items.length; i++) {
    //selectlist.options[selectlist.options.length] = new Option(current.items[i].title,current.items[i].title);
    var display_title = current.items[i].title;
    //var patt = /\/\(\/g/gi;

    if (display_title.match(/\(/gi) != null) {
      display_title = display_title.replace(/\(/gi, "<br><span class='subtext'>(");
      display_title = display_title + "</span>";
    }
    $('#left-display-list').append("<div class='list-item' listid='" + i + "' item=\"" + current.items[i].title + "\">" + display_title + "</div>");
  }

  leftscrolltop();
  blur();

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

// used by menuhover querystring: ?menuhover=false on URL turns off menu hover function
function getquerystring(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function menuhovercheck(){
  var menuhover = "";
  try {
    menuhover = getquerystring("menuhover");
  } catch(e) {}

  if ( menuhover == 'false' ){
    togglehovermenu();
  }
}

function loadmenu() {
  menu = top.menu;
  for(i=0;i<menu.length;i++){
    var item = menu[i].title;
    $("#menu").append("<a href='#' class='menuitem btn' id='" + item + "'>" + item + "</a>")
  }
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

  blur();
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

              side( pre + sub_title + " : " + value);
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

// select function
function selectitem(obj) {

  $('.list-selected').removeClass('list-selected');
  obj.addClass('list-selected');

}

function perform_roll() {

  var selected_id = $('.list-selected').attr('listid');

  if ( selected_id == null ) {
    showalert("nothing selected");
    return;
  }

  var seltext = $('.list-selected').attr('item');

  roll_table = get_roll_array(seltext, current.id);
  if_zero_dont_show_mainrolls = roll_table.main_rolls.length;
  if_zero_dont_show_subrolls = roll_table.sub_rolls.length;

  clearright();

  var roll_table_title = roll_table.title;
  if ( roll_table_title.substring(0,2) == "- " ){
    roll_table_title = roll_table_title.substring(2, roll_table_title.length);
  }

  side("Title: " + roll_table_title);
  side(" ");
  side("Suggested Use: " + roll_table.use);
  side_display_current("<span class='roll-title'>" + roll_table_title + "</span>");
  side_display_current(" ");
  side_display_history("<div class='accordion roll-title-history'>" + roll_table_title + " <div class='history-item-menu'><div class='delete-history-item glyphicon glyphicon-trash'></div> <div class='expand-collapse glyphicon glyphicon-chevron-down'></div></div></div>", false);
  side_display_history("<div class='panel'>", false);
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
  blur();
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
    blur();
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
  process_history();
  $('#rightview-history').show();
  var copyTextarea = document.querySelector('.history-textarea');
  copyTextarea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    blur();
    showalert('copy history');
  } catch (err) {
    showalert('unable to copy');
  }
  $('#rightview-history').hide();
});

function process_history() {
  var separator = "------------------------------------------\n";
  var copy_list = document.getElementById("rightview-history-display").getElementsByClassName("for-copy"); //[0]
  var copy_output = "";
  for (var i = 0; i < copy_list.length; i++) {
      if ( i != 0 ) { copy_output += separator; }
      copy_output = copy_output + copy_list[i].innerHTML;
  }
  $('#rightview-history').html(copy_output);
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

function mouseover_loadleftdisplay(obj) {
  if ( mouseover_on == true ) { loadleftdisplay(obj); }
}

function showhistory() {
  $('#current-roll-tab').removeClass('active');
  $('#history-roll-tab').addClass('active');
  $('#rightview-current-display').hide();
  $('#rightview-history-display').show();
  rightscrolltop();

  // functions
  $("#collapse-history-tab").show();
  $("#expand-history-tab").show();
  $("#clear-history-roll-tab").show();
  blur();
}

function showcurrent() {
  $('#history-roll-tab').removeClass('active');
  $('#current-roll-tab').addClass('active');
  $('#rightview-history-display').hide();
  $('#rightview-current-display').show();
  rightscrolltop();

  // functions
  $("#collapse-history-tab").hide();
  $("#expand-history-tab").hide();
  $("#clear-history-roll-tab").hide();
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
  $(':focus').blur();
  document.getSelection().removeAllRanges();
}

function clearhistory(show) {
  $('#rightview-current').html("");
  $('#rightview-history').html("");
  $('#rightview-current-display').html("");
  $('#rightview-history-display').html("");
  side_obj = "";
  obj_current_display = "";
  obj_history_display = "";
  if (show == true) {
    showalert("clear history");
  }
}

function collapse_history() {
  $('.panel').removeClass('show');
  $('.accordion').removeClass('active');
  blur();
}

function expand_history() {
  $('.panel').addClass('show');
  $('.accordion').addClass('active');
  blur();
}

function create_guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

// jquery regex extender.  source: http://james.padolsey.com/javascript/regex-selector-for-jquery/
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

function filter() {
  // hide all elements in left nav
  $('#left-display-list').children('.list-item').hide();

  // show only those that match the filter
  var item = 'div:regex(item,' + $('#filter').val() + ')';
  $('#left-display-list').children(item).show();

  leftscrolltop();

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
    case "history item deleted":
      alert_type = "success";
      alert_text = "History Item Deleted <span class='glyphicon glyphicon-remove'></span>";
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

    $(id).fadeIn("slow", function() {$(this).delay(750).fadeOut(); });

  }
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

function hide_menu() {
  $('#index-menu').hide();
}


// events

$('body').on('mouseenter', '.delete-history-item', function() { delete_enabled = true; });
$('body').on('mouseleave', '.delete-history-item', function() { delete_enabled = false; });
$('body').on('click', '.list-item', function() { selectitem($(this)); perform_roll(); });
$('body').on('mouseover', '.menuitem', function() { mouseover_loadleftdisplay($(this).attr('id')); });
$('body').on('click', '.menuitem', function() { loadleftdisplay($(this).attr('id')); });
$('body').on('click', '#roll', function() { perform_roll(); });
$('body').on('click', '#test', function() { roll_test(); });
$('body').on('click', '#history-roll-tab', function() { showhistory(); });
$('body').on('click', '#current-roll-tab', function() { showcurrent(); });
$('body').on('click', '#clear-history-roll-tab', function() { clearhistory(true); });
$('body').on('click', '.hover-icon-clickarea', function() { togglehovermenu(); });
$('body').on('click', '#collapse-history-tab', function() { collapse_history(); });
$('body').on('click', '#expand-history-tab', function() { expand_history(); });
$('body').on('keyup', '#filter', function() { filter(); });
$('body').on('change', '#filter', function() { filter(); });
$('body').on('click', '#filter-button', function() { filter(); });
$('body').on('click', '#filter-clear', function() { $('#filter').val(""); filter(); });

$('body').on('click', '.srd-button', function() { window.location.replace("reference.html"); } );

// top menu
$('body').on('click', '.menu-button', function(e) { toggle_menu(e); } );
$('body').on('click', '#menu-auto-roll-tables', function() { window.location.replace("index.html"); } );
$('body').on('click', '#menu-region-map-generator', function() { window.location.replace("hex-map-generator/hex_map_generator.html"); } );



$('body').on('click', '.delete-history-item', function() {
  $(this).parent().parent().next().remove();
  $(this).parent().parent().remove();
});

// accordion
$('body').on('click', '.accordion', function(e) {
  if ( delete_enabled == true ) {
    $(this).next().remove();
    $(this).remove();
    process_history();
    showalert("history item deleted");
    delete_enabled = false;
  } else {
    if ( $(this).children('.history-item-menu').children('.glyphicon-chevron-down').length ) {
      $(this).children('.history-item-menu').children('.glyphicon-chevron-down').toggleClass('glyphicon-chevron-up').toggleClass('glyphicon-chevron-down');
    } else {
      $(this).children('.history-item-menu').children('.glyphicon-chevron-up').toggleClass('glyphicon-chevron-down').toggleClass('glyphicon-chevron-up');
    }
    $(this).next().toggleClass('show');
    blur();
  }
});

$(document).ready(function() {
  init();
});
