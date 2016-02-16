// autorolltable
// developed by dangeratio
// content by OrkishBlade
// originally posted to: reddit.com/r/DnD/comments/452r6r/a_massive_and_growing_resource_of_random_tables/
//
//

var roll_table = top.roll_table;

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

document.getElementById("selectlist").onchange = document.getElementById("selectlist").onclick = function selected() {
  var sel = document.getElementById("selectlist");
  var index = sel.selectedIndex;
  var seltext = sel.options;

  sideClear();
  side("Title: " + roll_table[index].title);
  side(" ");
  side("Suggested Use: " + roll_table[index].use);
  side(" ");
  side("Rolls:");
  side(" ");
  for (var i = 0; i < roll_table[index].rolls.length; i++) {
    side(roll_table[index].rolls[i].title);
    for (var z = 0; z < roll_table[index].rolls[i].roll.length; z++) {
      side(" " + (z+1) + " - " + roll_table[index].rolls[i].roll[z]);
    }
    side(" ");
  }

}

function init() {
  // fill select
  var selectlist = document.getElementById("selectlist");
  var rollbutton = document.getElementById("roll");

  for (var i = 0; i < roll_table.length; i++) {
    var obj = roll_table[i];
    selectlist.options[selectlist.options.length] = new Option(roll_table[i].title, roll_table[i].title);
  }

  //selectlist.onclick = selected();
  //rollbutton.onclick = jsRoll();
}

document.getElementById("roll").onclick = function jsRoll() {
  //roll_table
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
    var rand = roll_table[index].rolls[i].roll[Math.floor(Math.random() * roll_table[index].rolls[i].roll.length)];
    side(roll_table[index].rolls[i].title + ": " + rand);
    //side(" ");
  }
  document.getElementById("selectlist").focus();
}

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


init();
