$(window).on("load", function() {
  //
  //  SVG Export
  //
  $("body").on("click", ".exportsvg", function(e) {
    var exportSVG = function(svg) {
      var clone = svg.cloneNode(true);
      parseStyles(clone);
      var svgDocType = document.implementation.createDocumentType(
        "svg",
        "-//W3C//DTD SVG 1.1//EN",
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"
      );
      var svgDoc = document.implementation.createDocument(
        "http://www.w3.org/2000/svg",
        "svg",
        svgDocType
      );
      svgDoc.replaceChild(clone, svgDoc.documentElement);
      var svgData = new XMLSerializer().serializeToString(svgDoc);
      var a = document.createElement("a");
      a.href =
        "data:image/svg+xml; charset=utf8, " +
        encodeURIComponent(svgData.replace(/></g, ">\n\r<"));
      a.download = "region-map.svg";
      a.innerHTML = "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    var parseStyles = function(svg) {
      var styleSheets = [];
      var i;
      var docStyles = svg.ownerDocument.styleSheets;
      for (i = 0; i < docStyles.length; i++) {
        styleSheets.push(docStyles[i]);
      }
      if (!styleSheets.length) {
        return;
      }
      var defs =
        svg.querySelector("defs") ||
        document.createElementNS("http://www.w3.org/2000/svg", "defs");
      if (!defs.parentNode) {
        svg.insertBefore(defs, svg.firstElementChild);
      }
      svg.matches =
        svg.matches ||
        svg.webkitMatchesSelector ||
        svg.mozMatchesSelector ||
        svg.msMatchesSelector ||
        svg.oMatchesSelector;
      for (i = 0; i < styleSheets.length; i++) {
        var currentStyle = styleSheets[i];
        var rules;
        try {
          rules = currentStyle.cssRules;
        } catch (e) {
          continue;
        }
        var style = document.createElement("style");
        var l = rules && rules.length;
        for (var j = 0; j < l; j++) {
          var selector = rules[j].selectorText;
          if (!selector) {
            continue;
          }
          if (
            (svg.matches && svg.matches(selector)) ||
            svg.querySelector(selector)
          ) {
            var cssText = rules[j].cssText;
            style.innerHTML += cssText + "\n";
          }
        }
        if (style.innerHTML) {
          defs.appendChild(style);
        }
      }
    };
    exportSVG(document.getElementById("finalSVG"));
  });

  //
  //  PNG Export
  //
  $("body").on("click", ".exportpng", function(e) {
    saveSvgAsPng(document.getElementById("finalSVG"), "region-map.png", {
      scale: 2.0,
    });
  });
});
