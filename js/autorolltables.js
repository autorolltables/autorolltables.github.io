// autorolltables
// developed by dangeratio
//
//

var current;
var output;
var side_obj;

function log(obj) {
  console.log(obj);
}

function display_output(){
  document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + output
}

function out(obj) {
  output = output + obj + "\n";
  // var output = document.getElementById("output");
  // output.innerHTML = output.innerHTML + obj + '\n';
  return 0;
}

function outClear() {
  document.getElementById("output").innerHTML = "";
  output = "";
}

function display_side(){
  document.getElementById("rightview").innerHTML = document.getElementById("rightview").innerHTML + side_obj;
}

function side(obj) {
  side_obj = side_obj + obj + "\n"
  // var side = document.getElementById("rightview");
  // side.innerHTML = side.innerHTML + obj + '\n';
  return 0;
}

function sideClear() {
  document.getElementById("rightview").innerHTML = "";
  side_obj = "";
  return 0;
}

function clearSelect() {
  var select = document.getElementById("selectlist");
  var length = select.options.length;
  for (i = select.options.length; i > -1; i--) {
    select.options[i] = null;
  }
}

// used in main menu select as well as select onclick
function get_table(table){
  //log("switch:"+table);
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
    //log("compare:"+menu[i].id+"|"+title);
    if(menu[i].id==title){
      for(z=0;z<menu[i].items.length;z++){
        //log("compare:"+menu[i].items[z].title+"|"+roll_name);
        if(menu[i].items[z].title==roll_name){
          return menu[i].items[z];
        }
      }
    }
  }
}

// get title of roll from roll id and table
function get_roll(id, table){
  //log("get_roll_init:"+id+"|"+table);
  table = get_table(table);
  for(i=0;i<table.length;i++){
    if(table[i].id==id){
      return table[i];
    }
  }
  return "";
}


// handle new selections
document.getElementById("selectlist").onchange = document.getElementById("selectlist").onclick = function selected() {

  var sel = document.getElementById("selectlist");
  var index = sel.selectedIndex;
  var seltext = sel.options[index].value;

  //log("seltext:"+seltext);
  //log("id:"+current.id);

  roll_table = get_roll_array(seltext, current.id);

  //log("returned table:"+roll_table.title);

  sideClear();

  side("Title: " + roll_table.title);
  side(" ");
  side("Suggested Use: " + roll_table.use);
  side(" ");
  side("Main Rolls: " + roll_table.main_rolls.length);
  side("Sub Rolls: " + roll_table.sub_rolls.length);
  side(" ");

  side("Main Rolls:");
  side(" ");
  // iterate the menu, displaying the titles for the main rolls
  for (var i = 0; i < roll_table.main_rolls.length; i++) {
    id = get_roll_id(roll_table.main_rolls[i]);
    table = get_roll_table(roll_table.main_rolls[i]);
    toss = get_roll(id, table);

    side(toss.title);
    // log("main toss:"+toss.title);

    //
    // // iterate each roll, displaying the roll values
    // for (var z = 0; z < toss.roll.length; z++) {
    //   side(" " + (z+1) + " - " + toss.roll[z]);
    // }
    // side(" ");
  }

  // iterate the sub rolls, displaying the titles for them
  if(roll_table.sub_rolls.length>0){
    side(" ");
    side("Sub Rolls (these may roll many times each):");
    side(" ");

    for (var i=0; i<roll_table.sub_rolls.length;i++){
      id = get_roll_id(roll_table.sub_rolls[i]);
      table = get_roll_table(roll_table.sub_rolls[i]);
      // log("id:"+id);
      // log("table:"+table);
      toss = get_roll(id, table);

      side(toss.title);

      // iteate sub rolls?
    }
  }

  display_side();

}

//find a roll title
function get_roll_title(val) {
  rolls = top.rolls;
  for(i=0; i<rolls.length; i++) {
    //console.log("compare:"+rolls[i].id+" | "+val);
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

}


// regex for identifying sub-rolls
var inline_roll_match = /\([dD][\d]{1,3}\) ?:/;
var indicator_match = /\<\*>.? ? ?([^\d]*)/;
var d_match = /^[dD]/;

// sub roll (for inline string rolls)
function inline_roll(roll_text) {

  //console.log("roll_text:" + roll_text);
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

  // regex match for indicator string <*> to the next decimal, caputring
  roll_text_without = roll_text_without.match(indicator_match);
  result = roll_text_without[1].replace(/^\s+/, '').replace(/\s+$/, '').replace(/[;,.]$/, '');

  // return display in a clear format
  return "(d" + roll_type + ") " + roll_description + ": " + result;
}

// test button
document.getElementById("test").onclick = function roll_test() {

  var sel = document.getElementById("selectlist");
  var index = sel.selectedIndex;
  var seltext = sel.options;

  sideClear();
  side("Tests:");

  // get length of all
  var total=0;
  for (var z = 0; z < roll_table.length; z++){
    for (var i = 0; i < roll_table[z].rolls.length; i++) {
      for (var a = 0; a < roll_table[z].rolls[i].roll.length; a++){
        var returned = roll_table[z].rolls[i].roll[a];

        if(returned.match(inline_roll_match)) {
          //side(returned + ": matched");
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
          result = result + title + " : " + amount + "\n";
          // roll that many times
          for(var z=0;z<amount;z++){
            // roll for each roll
            var pre_title = "(" + (z+1) + ") ";
            var pre = "     ";

            // for each roll in total amount, roll main (random * length), then roll all sub-attributes accordingly
            var rand = Math.floor(Math.random() * length);  // floor to match array counting (start at 0)
            var rolls = table[i].roll[rand].main_rolls;

            // show title of this result
            result = result + pre_title + table[i].roll[rand].title + "\n";

            for(var x=0; x<rolls.length;x++){

              id = get_roll_id(rolls[x]);
              sub_table = get_roll_table(rolls[x]);
              sub_title = get_roll_title(id, sub_table);
              value = roll_roll(id, sub_table);

              if(value.match(inline_roll_match)) {value = inline_roll(value);}

              result = result + pre + sub_title + " : " + value + "\n";
            }
          }
        } else if(type=="amount") {
          var length = table[i].rolls.length;
          var amount = get_roll_value(number);

          amount = Math.ceil(amount * (percent_of / 100));
          result = result + "\n" + title + " : " + amount + "\n";
          // roll that many times
          for(var z=0;z<amount;z++){
            // roll for each roll

            result = result + "(" + (z+1) + ") \n";
            var pre = "     ";

            for(var x=0;x<length;x++) {
              // roll sub-roll this number of times

              id = get_roll_id(table[i].rolls[x]);
              sub_table = get_roll_table(table[i].rolls[x]);
              sub_title = get_roll_title(id, sub_table);
              value = roll_roll(id, sub_table);

              if(value.match(inline_roll_match)) {value = inline_roll(value);}

              result = result + pre + sub_title + " : " + value + "\n";

            }
          }
        }
      }
    }
  }

  if(result!=""){
    return result;
  } else {
    return "";
  }

}

function get_roll_value(str) {

  // interpret various rolls - d10, 1d10, 4d4, maybe even 6d6+10 someday (but not currently)
  var value=0;

  // log("value:"+str);
  if(str.match(d_match)) {
    // single roll (no number before the "d")

    // remove the d
    str = str.toLowerCase().replace("d","");
    // roll randomly
    var rand = Math.ceil(Math.random() * parseInt(str));
    return rand;

  } else {
    // multiple rolls (split on the "d" and execute a random [1] [0] times)

    // var tmp = id_string.split("/");
    // return tmp[1];
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

// roll button
document.getElementById("roll").onclick = function perform_roll() {

  var sel = document.getElementById("selectlist");
  var index = sel.selectedIndex;
  var seltext = sel.options[index].value;

  roll_table = get_roll_array(seltext, current.id);

  sideClear();

  side("Title: " + roll_table.title);
  side(" ");
  side("Suggested Use: " + roll_table.use);
  side(" ");
  side("Main Rolls: " + roll_table.main_rolls.length);
  side("Sub Rolls: " + roll_table.sub_rolls.length);
  side(" ");
  side("Main Rolls:");
  side(" ");

  // iterate the menu, displaying the values for main rolls
  for (var i = 0; i < roll_table.main_rolls.length; i++) {
    id = get_roll_id(roll_table.main_rolls[i]);
    table = get_roll_table(roll_table.main_rolls[i]);
    roll = get_roll(id, table);
    value = roll_roll(id, table);

    // care for sub-rolls if they exist
    if(value.match(inline_roll_match)) {value = inline_roll(value);}

    side(roll.title + " : " + value);
  }

  side(" ");
  side("Sub Rolls:");

  // iterate the menu, displaying the values for sub rolls
  for (var i = 0; i < roll_table.sub_rolls.length; i++) {
    // log("roll_table.sub_rolls[i]:"+roll_table.sub_rolls[i]);
    id = get_roll_id(roll_table.sub_rolls[i]);
    // log("id:"+id);
    table = get_roll_table(roll_table.sub_rolls[i]);
    // log("table:"+table);
    roll = get_roll(id, table);
    value = roll_sub_roll(id, table);

    side(value);
  }








  display_side();

  document.getElementById("selectlist").focus();
}



// copy to clipboard
var copyTextareaBtn = document.querySelector('.js-textareacopybtn');
copyTextareaBtn.addEventListener('click', function(event) {
  var copyTextarea = document.querySelector('.js-copytextarea');
  copyTextarea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
    copyTextarea.innerHTML = "";
    document.getElementById("selectlist").focus();
  } catch (err) {
    console.log('Oops, unable to copy');
  }
});

// create menu
// <a href="#dungeons" accesskey="1" class='menuitem btn'>Dungeons/Locations</a>
// <a href="#" accesskey="2" class='menuitem btn'>Factions</a>
// <a href="#" accesskey="3" class='menuitem btn'>Monsters</a>
// <a href="#" accesskey="4" class='menuitem btn'>Objects</a>
// <a href="#" accesskey="4" class='menuitem btn'>NPCs</a>
// <a href="#" accesskey="5" class='menuitem btn'>Plots</a>
// <a href="#" accesskey="6" class='menuitem btn'>Settlements</a>
// <a href="#" accesskey="7" class='menuitem btn'>Wilderness</a>

var menu_item_template = "<a href='#' class='menuitem btn'>DESC</a>";
menu = top.menu;
for(i=0;i<menu.length;i++){
  $(".menu").append(menu_item_template.replace("DESC",menu[i].title));
  //console.log(menu[i].title);
}

//href("#")




// menu realtime
//
$(function() {
  $(".menuitem").click(function() {
    loadSelect($(this).html());
  });
});

$(function() {
  $(".menuitem").mouseover(function() {
    loadSelect($(this).html());
  });
});

$(document).ready(function() {
  init();
});
