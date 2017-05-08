// srd.js
//
// Includes functions used to perform interactive functions on the srd page
//


///////////////////////////////////////////////////////////////////////////////////////////////////
// default values
///////////////////////////////////////////////////////////////////////////////////////////////////

var obj_current_copy = "";
var obj_current_display = "";
var mouseover_on = true;

///////////////////////////////////////////////////////////////////////////////////////////////////
// initial functions
///////////////////////////////////////////////////////////////////////////////////////////////////

function init() {

  // load the menu
  loadmenu();

  // default to dungeons table
  loadleftdisplay("All");

  // check querystring for menuhover
  menuhovercheck();
}

function loadmenu() {
  menu = top.menu;
  for(i=0;i<menu.length;i++){
    var item = menu[i].title;
    $("#menu").append("<a href='#' class='menuitem btn' id='" + item + "'>" + item + "</a>")
  }
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
    var display_title = current.items[i].title;

    if (display_title.match(/\(/gi) != null) {
      display_title = display_title.replace(/\(/gi, "<br><span class='subtext'>(");
      display_title = display_title + "</span>";
    }
    $('#left-display-list').append("<div class='list-item' listid='" + i + "' item='" + current.items[i].title + "'>" + display_title + "</div>");
  }

  leftscrolltop();
  blur();

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


///////////////////////////////////////////////////////////////////////////////////////////////////
// utility functions
///////////////////////////////////////////////////////////////////////////////////////////////////


function perform_lookup() {

  clearright();

  var selected_id = $('.list-selected').attr('listid');

  if ( selected_id == null ) {
    showalert("nothing selected");
    return;
  }

  var seltext = $('.list-selected').attr('item');

  source = get_array(seltext, current.id);

  // source.id;
  // source.title;

  // debug
  //side_display(JSON.stringify(source, null, 4));

  var source_title = source.title;

  if ( source_title.substring(0,2) == "- " ){
    source_title = source_title.substring(2, source_title.length);
  }

  side_display("<span class='srdtitle'>"+source_title+"</span><br/>");
  side_copy(source_title+"\n");

  //id = get_roll_id(roll_table.main_rolls[i]);
  var id = source.id;
  var category = get_source_category(id);
  var item = get_item(id);
  var description = item.description;
  var text = item.text;

  side_display("<span class='subtext'>"+description+"</span><br/>");
  side_display(text+"<br>");
  side_copy(description+"\n");
  side_copy(text+"\n");


  // table = get_roll_table(roll_table.main_rolls[i]);
  // roll = get_roll(id, table);
  // value = roll_roll(id, table);

  // care for sub-rolls if they exist
  // if(value.match(inline_roll_match)) {value = inline_roll(value);}
  // side_display(roll.title + " : <b>" + value + "</b>");



  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////



  /*
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
  */

  display_side();
  rightscrolltop();
  blur();
}

// get description of source from source id
function get_item(id){
  var category_name = get_source_category(id);
  var selected_id = get_id(id);
  var category = get_category(category_name);

  for(i=0;i<category.length;i++){
    if(category[i].id==selected_id){
      return category[i];
    }
  }
  return "";
}

// return menu variable from table name
function get_array(name, title) {
  menu = top.menu
  for(i=0;i<menu.length;i++){
    if(menu[i].id==title){
      for(z=0;z<menu[i].items.length;z++){
        if(menu[i].items[z].title==name){
          return menu[i].items[z];
        }
      }
    }
  }
}

function get_source_category(id_string){
  var tmp = id_string.split("/");
  return tmp[0];
}

function get_id(id_string){
  var tmp = id_string.split("/");
  return tmp[1];
}

function side_display(obj) {
  obj_current_display = obj_current_display + obj;
}

function side_copy(obj) {
  obj_current_copy = obj_current_copy + obj;
}

function display_side(){
  $("#rightview-srd-display").html( $("#rightview-srd-display").html() + obj_current_display );
  rightscrolltop();
}

function get_category(category_name){
  switch(category_name) {
    case "backgrounds":
      return top.srd_backgrounds;
      break;
    case "classes":
      return top.srd_classes;
      break;
    case "feats":
      return top.srd_feats;
      break;
    case "items":
      return top.srd_items;
      break;
    case "monsters":
      return top.srd_monsters;
      break;
    case "races":
      return top.srd_races;
      break;
    case "rules":
      return top.srd_rules;
      break;
    case "spells":
      return top.srd_spells;
      break;
    case "subrolls":
      return top.srd_subrolls;
      break;
  }
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

function create_guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

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

function leftscrolltop() {
  $("#left-display-list").animate({ scrollTop: 0 }, "fast");
}

function rightscrolltop() {
  $("#rightview-srd-display").animate({ scrollTop: 0 }, "fast");
}

function blur() {
  $(':focus').blur();
  document.getSelection().removeAllRanges();
}

function clearleft() {
  $('#left-display-list').children().remove();
}

function mouseover_loadleftdisplay(obj) {
  if ( mouseover_on == true ) { loadleftdisplay(obj); }
}

function selectitem(obj) {
  $('.list-selected').removeClass('list-selected');
  obj.addClass('list-selected');
}

function clearright() {
  $("#rightview-srd-display").html('');
  obj_current_display = "";
  obj_current_copy = "";
  return 0;
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

///////////////////////////////////////////////////////////////////////////////////////////////////
// events
///////////////////////////////////////////////////////////////////////////////////////////////////

$('body').on('click', '.rolltables-button', function() { window.location.replace("index.html"); } );
$('body').on('mouseover', '.menuitem', function() { mouseover_loadleftdisplay($(this).attr('id')); });
$('body').on('click', '.menuitem', function() { loadleftdisplay($(this).attr('id')); });
$('body').on('click', '.hover-icon-clickarea', function() { togglehovermenu(); });
$('body').on('click', '.list-item', function() { selectitem($(this)); perform_lookup(); });

$('body').on('keyup', '#filter', function() { filter(); });
$('body').on('change', '#filter', function() { filter(); });
$('body').on('click', '#filter-button', function() { filter(); });
$('body').on('click', '#filter-clear', function() { $('#filter').val(""); filter(); });

// init

$(document).ready(function() {
  init();
});
