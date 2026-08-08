function toggle_menu(e) {
  if ($("#index-menu").filter(":visible").length) {
    $("#index-menu").hide();
  } else {
    $("#index-menu").css({ top: e.pageY, left: e.pageX - 27 });
    $("#index-menu").show();
    $("body").one("click", function() {
      hide_menu();
    });
  }
}

function hide_menu() {
  $("#index-menu").hide();
}

// menu events
function init_menu() {
  $("body").on("click", ".menu-button", function(e) {
    toggle_menu(e);
  });
  $("body").on("click", ".refresh", function(e) {
    window.location.reload();
  });
  $("body").on("click", "#menu-auto-roll-tables", function() {
    window.location.replace("../index.html");
  });
  $("body").on("click", "#menu-hex-map-generator", function() {
    window.location.replace("../hex-map-generator/hex_map_generator.html");
  });
  $("body").on("click", "#menu-region-map-generator", function() {
    window.location.replace("../region-map-generator/index.html");
  });
}

$(document).ready(function() {
  init_menu();
});
