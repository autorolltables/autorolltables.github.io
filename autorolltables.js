// autorolltable
// developed by dangeratio
// content by OrkishBlade
// originally posted to: reddit.com/r/DnD/comments/452r6r/a_massive_and_growing_resource_of_random_tables/
//
//

var current;

function debug(obj) {
  var output = document.getElementById("output");
  output.innerHTML = output.innerHTML + obj + '\n';
  return 0;
}

function out(obj) {
  var output = document.getElementById("output");
  output.innerHTML = output.innerHTML + obj + '\n';
  return 0;
}

function side(obj) {
  var side = document.getElementById("rightview");
  side.innerHTML = side.innerHTML + obj + '\n';
  return 0;
}

function sideClear() {
  var side = document.getElementById("rightview");
  side.innerHTML = "";
  return 0;
}

function clearSelect() {
  var select = document.getElementById("selectlist");
  var length = select.options.length;
  for (i = select.options.length; i > -1; i--) {
    select.options[i] = null;
  }
}


// return table variable from table name
function getTable(table_name) {
  switch(table_name) {
    case "dungeons":
      return top.dungeons;
      break;
    case "factions":
      return top.factions;
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
    default:
      return top.dungeons;
      break;
  }
}


// fill select table helper function
function loadSelect(curr_table) {
  clearSelect();

  var selectlist = document.getElementById("selectlist");
  var rollbutton = document.getElementById("roll");

  current = getTable(curr_table.toLowerCase());

  //alert(current[0].title);

  for (var i = 0; i < current.length; i++) {
    selectlist.options[selectlist.options.length] = new Option(current[i].title, current[i].title);
  }

}


// handle new selections
document.getElementById("selectlist").onchange = document.getElementById("selectlist").onclick = function selected() {
  var sel = document.getElementById("selectlist");
  var index = sel.selectedIndex;
  var seltext = sel.options;
  roll_table = current;

  sideClear();
  side("Title: " + roll_table[index].title);
  side(" ");
  side("Suggested Use: " + roll_table[index].use);
  side(" ");
  side("Rolls: " + roll_table[index].rolls.length);
  side(" ");
  for (var i = 0; i < roll_table[index].rolls.length; i++) {
    side(roll_table[index].rolls[i].title);
    for (var z = 0; z < roll_table[index].rolls[i].roll.length; z++) {
      side(" " + (z+1) + " - " + roll_table[index].rolls[i].roll[z]);
    }
    side(" ");
  }

}

// initial load of select list
function init() {
  // default to dungeons
  current = top.dungeons;

  // fill select
  var selectlist = document.getElementById("selectlist");
  var rollbutton = document.getElementById("roll");

  for (var i = 0; i < current.length; i++) {
    var obj = current[i];
    selectlist.options[selectlist.options.length] = new Option(current[i].title, current[i].title);
  }

}

// regex for identifying sub-rolls
var sub_roll_match = /\([dD][\d]{1,3}\) ?:/;
var indicator_match = /\<\*>.? ? ?([^\d]*)/;

// sub roll (for inline string rolls)
function inline_roll(roll_text) {

  console.log("roll_text:" + roll_text);
  var result = "";

  // identify roll type
  roll_type = roll_text.match(sub_roll_match);
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
  var rand = Math.floor(Math.random() * roll_type) + 1;

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

        if(returned.match(sub_roll_match)) {
          //side(returned + ": matched");
          returned = inline_roll(returned);
        }
      }
    }
  }

  document.getElementById("test").focus();
}

// roll button
document.getElementById("roll").onclick = function jsRoll() {
  var sel = document.getElementById("selectlist");
  var index = sel.selectedIndex;
  var seltext = sel.options;

  sideClear();
  side("Title: " + roll_table[index].title);
  side(" ");
  side("Suggested Use: " + roll_table[index].use);
  side(" ");
  side("Rolls: " + roll_table[index].rolls.length);
  side(" ");

  for (var i = 0; i < roll_table[index].rolls.length; i++) {

    var returned = roll_table[index].rolls[i].roll[Math.floor(Math.random() * roll_table[index].rolls[i].roll.length)];

    if(returned.match(sub_roll_match)) {
      //side(returned + ": matched");
      returned = inline_roll(returned);
    }

    // add roll
    side(roll_table[index].rolls[i].title + ": " + returned);
  }
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


// menu
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
