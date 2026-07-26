// Click-to-enlarge lightbox for service gallery photos, with next/prev
// navigation between photos in the same gallery. Progressive enhancement:
// builds its own overlay markup, so no HTML changes are needed when new
// gallery images are added.
(function () {
  "use strict";

  var galleries = Array.prototype.slice.call(document.querySelectorAll(".gallery-grid"));
  if (!galleries.length) return;

  var groups = galleries
    .map(function (gallery) {
      return Array.prototype.slice.call(gallery.querySelectorAll("img"));
    })
    .filter(function (group) {
      return group.length > 0;
    });

  if (!groups.length) return;

  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Photo viewer");
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close photo viewer">&times;</button>' +
    '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous photo">&lsaquo;</button>' +
    '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next photo">&rsaquo;</button>' +
    '<figure class="lightbox-figure">' +
    '<img class="lightbox-image" src="" alt="" />' +
    '<figcaption class="lightbox-caption"></figcaption>' +
    "</figure>";
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector(".lightbox-image");
  var captionEl = overlay.querySelector(".lightbox-caption");
  var closeBtn = overlay.querySelector(".lightbox-close");
  var prevBtn = overlay.querySelector(".lightbox-prev");
  var nextBtn = overlay.querySelector(".lightbox-next");

  var currentGroup = null;
  var currentIndex = 0;
  var lastFocused = null;

  function render() {
    var trigger = currentGroup[currentIndex];
    imgEl.src = trigger.currentSrc || trigger.src;
    imgEl.alt = trigger.alt || "";
    captionEl.textContent = trigger.alt || "";
    var multiple = currentGroup.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    render();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentGroup.length;
    render();
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  }

  function openLightbox(group, index) {
    currentGroup = group;
    currentIndex = index;
    lastFocused = document.activeElement;
    render();
    overlay.classList.add("open");
    document.body.classList.add("lightbox-active");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeLightbox() {
    overlay.classList.remove("open");
    document.body.classList.remove("lightbox-active");
    imgEl.src = "";
    currentGroup = null;
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });
  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);

  groups.forEach(function (group) {
    group.forEach(function (img, index) {
      img.classList.add("lightbox-trigger");
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "View larger photo: " + (img.alt || "project photo"));

      img.addEventListener("click", function () {
        openLightbox(group, index);
      });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(group, index);
        }
      });
    });
  });
})();
