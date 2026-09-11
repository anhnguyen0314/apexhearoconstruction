// Progressive enhancement: caps each service gallery to 6 photos on load
// and adds a "See Full Gallery" button to reveal the rest. Hidden photos
// stay in the DOM (just [hidden]), so lightbox.js can still navigate to
// them via next/prev once the gallery is expanded.
(function () {
  "use strict";

  var VISIBLE_COUNT = 6;

  Array.prototype.slice.call(document.querySelectorAll(".gallery-grid")).forEach(function (grid) {
    var figures = Array.prototype.slice.call(grid.children).filter(function (el) {
      return el.tagName === "FIGURE";
    });

    if (figures.length <= VISIBLE_COUNT) return;

    var hiddenFigures = figures.slice(VISIBLE_COUNT);
    hiddenFigures.forEach(function (figure) {
      figure.hidden = true;
    });

    var wrap = document.createElement("p");
    wrap.className = "text-center gallery-more-wrap";

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-dark";
    button.textContent = "See Full Gallery (" + figures.length + " Photos)";

    button.addEventListener("click", function () {
      hiddenFigures.forEach(function (figure) {
        figure.hidden = false;
      });
      wrap.remove();
    });

    wrap.appendChild(button);
    grid.insertAdjacentElement("afterend", wrap);
  });
})();
