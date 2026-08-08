// Renders the map into the shell, sized to whatever width the layout gives it.

function renderMap() {
  var holder = document.getElementById("final");
  var loading = document.getElementById("map-loading");
  if (loading) loading.hidden = false;

  // generation blocks for a second or two, so let the placeholder paint first
  setTimeout(function () {
    // the map is square, so fit it to the smaller of the two axes and it
    // lands fully on screen without the holder needing to scroll
    var availableW = holder.clientWidth - 24; // holder padding
    var availableH = holder.clientHeight - 24;
    var width = Math.max(320, Math.min(1100, availableW, availableH || availableW));

    var svg = d3.select("#finalSVG");
    if (svg.empty()) {
      svg = d3
        .select("div#final")
        .insert("svg", ":first-child")
        .attr("id", "finalSVG");
    }
    // doMap derives the height and the viewBox from this width
    svg.attr("width", width);

    doMap(svg, defaultParams);
    if (loading) loading.hidden = true;
  }, 20);
}

$(document).ready(function () {
  renderMap();

  // regenerate in place rather than reloading the page
  $("body").on("click", ".refresh", function () {
    renderMap();
    $(this).blur();
  });
});
