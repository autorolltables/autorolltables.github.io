function init() {
  var finalDiv = d3.select("div#final");
  var finalSVG = finalDiv
    .insert("svg", ":first-child")
    .attr("id", "finalSVG")
    .attr("height", 500)
    .attr("width", 500)
    .attr("viewBox", "0 0 500 500");
  doMap(finalSVG, defaultParams);
}

$(document).ready(function() {
  init();
});
