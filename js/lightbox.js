// Click-to-enlarge lightbox for service gallery / before-after photos.
// Progressive enhancement: builds its own overlay markup, so no HTML
// changes are needed when new gallery images are added.
(function () {
  "use strict";

  var triggers = Array.prototype.slice.call(
    document.querySelectorAll(".gallery-grid img, .before-after img")
  );
  if (!triggers.length) return;

  var overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Photo viewer");
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close photo viewer">&times;</button>' +
    '<figure class="lightbox-figure">' +
    '<img class="lightbox-image" src="" alt="" />' +
    '<figcaption class="lightbox-caption"></figcaption>' +
    "</figure>";
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector(".lightbox-image");
  var captionEl = overlay.querySelector(".lightbox-caption");
  var closeBtn = overlay.querySelector(".lightbox-close");
  var lastFocused = null;

  function onKeydown(e) {
    if (e.key === "Escape") closeLightbox();
  }

  function openLightbox(trigger) {
    lastFocused = document.activeElement;
    imgEl.src = trigger.currentSrc || trigger.src;
    imgEl.alt = trigger.alt || "";
    captionEl.textContent = trigger.alt || "";
    overlay.classList.add("open");
    document.body.classList.add("lightbox-active");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeLightbox() {
    overlay.classList.remove("open");
    document.body.classList.remove("lightbox-active");
    imgEl.src = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });
  closeBtn.addEventListener("click", closeLightbox);

  triggers.forEach(function (img) {
    img.classList.add("lightbox-trigger");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "View larger photo: " + (img.alt || "project photo"));

    img.addEventListener("click", function () {
      openLightbox(img);
    });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });
})();
