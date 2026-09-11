// Progressive enhancement: caps each service gallery to 6 photos on load
// and adds a toggle button to show the rest (and collapse back). Hidden
// photos stay in the DOM (just [hidden]), so lightbox.js can still
// navigate to them via next/prev once the gallery is expanded.
(function () {
  "use strict";

  var VISIBLE_COUNT = 6;

  Array.prototype.slice.call(document.querySelectorAll(".gallery-grid")).forEach(function (grid) {
    var figures = Array.prototype.slice.call(grid.children).filter(function (el) {
      return el.tagName === "FIGURE";
    });

    if (figures.length <= VISIBLE_COUNT) return;

    var extraFigures = figures.slice(VISIBLE_COUNT);
    var expanded = false;
    extraFigures.forEach(function (figure) {
      figure.hidden = true;
    });

    var wrap = document.createElement("p");
    wrap.className = "text-center gallery-more-wrap";

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-dark";

    function setLabel() {
      button.textContent = expanded ? "Show Fewer Photos" : "See Full Gallery (" + figures.length + " Photos)";
    }
    setLabel();

    button.addEventListener("click", function () {
      expanded = !expanded;
      extraFigures.forEach(function (figure) {
        figure.hidden = !expanded;
      });
      setLabel();
      if (!expanded) {
        grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    wrap.appendChild(button);
    grid.insertAdjacentElement("afterend", wrap);
  });
})();
