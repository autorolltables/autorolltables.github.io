// srd.js
//
// Includes functions used to perform interactive functions on the srd page
//


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
    //selectlist.options[selectlist.options.length] = new Option(current.items[i].title,current.items[i].title);
    var display_title = current.items[i].title;
    //var patt = /\/\(\/g/gi;

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
  $("#rightview-history-display").animate({ scrollTop: 0 }, "fast");
  $("#rightview-current-display").animate({ scrollTop: 0 }, "fast");
}

function blur() {
  $(':focus').blur();
  document.getSelection().removeAllRanges();
}

function clearleft() {
  $('#left-display-list').children().remove();
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// events
///////////////////////////////////////////////////////////////////////////////////////////////////

$('body').on('click', '.rolltables-button', function() { window.location.replace("index.html"); } );



// init

$(document).ready(function() {
  init();
});
