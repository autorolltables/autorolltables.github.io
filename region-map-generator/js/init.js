// Renders the map into the shell, sized to whatever width the layout gives it.

var SVG_NS = "http://www.w3.org/2000/svg";
var MAP_INK = "#141a1f";
var MAP_PAPER = "#ffffff";

/*
 * The generator styles the map through the page's stylesheet, which is fine on
 * screen but leaves the exported SVG carrying no colours and, worse, no
 * background at all. Opened anywhere with a dark backdrop the dark ink then
 * disappears and the labels become unreadable. Stamping the appearance onto
 * the elements themselves, plus a real background rectangle, makes the map
 * look the same on the page, in the exported SVG and in the exported PNG.
 */
function styleMap(svg) {
  var el = svg.node ? svg.node() : svg;

  // background rectangle covering the whole viewBox
  var box = (el.getAttribute("viewBox") || "0 0 1000 1000").split(/[\s,]+/).map(Number);
  var bg = el.querySelector("rect.map-bg");
  if (!bg) {
    bg = document.createElementNS(SVG_NS, "rect");
    bg.setAttribute("class", "map-bg");
    el.insertBefore(bg, el.firstChild);
  }
  bg.setAttribute("x", box[0]);
  bg.setAttribute("y", box[1]);
  bg.setAttribute("width", box[2]);
  bg.setAttribute("height", box[3]);
  bg.setAttribute("fill", MAP_PAPER);

  function stamp(selector, attrs) {
    var nodes = el.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      for (var key in attrs) nodes[i].setAttribute(key, attrs[key]);
    }
  }

  stamp("line.slope", { fill: "none", stroke: MAP_INK, "stroke-width": 1, "stroke-linecap": "round" });
  stamp("path.river", { fill: "none", stroke: MAP_INK, "stroke-width": 2, "stroke-linecap": "round" });
  stamp("path.coast", { fill: "none", stroke: MAP_INK, "stroke-width": 4, "stroke-linecap": "round" });
  stamp("path.border", {
    fill: "none",
    stroke: MAP_INK,
    "stroke-width": 5,
    "stroke-linecap": "butt",
    "stroke-dasharray": "4,4",
  });
  stamp("circle.city", { fill: MAP_PAPER, stroke: MAP_INK, "stroke-width": 3 });

  // labels: dark type knocked out of a white halo so they stay legible over
  // the hatching underneath
  stamp("text", {
    fill: MAP_INK,
    stroke: MAP_PAPER,
    "stroke-width": 5,
    "stroke-linejoin": "round",
    "paint-order": "stroke",
    "font-family": '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
  });
  stamp("text.region", { "stroke-width": 10, "font-variant": "small-caps" });
}

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
    styleMap(svg);
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
