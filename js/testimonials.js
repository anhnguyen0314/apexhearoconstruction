// Fetches data/testimonials.json and renders testimonial cards into any
// element with [data-testimonials]. Add or edit testimonials by editing
// that JSON file only — no HTML changes required.
(function () {
  "use strict";

  function initials(name) {
    return name
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) {
        return part[0].toUpperCase();
      })
      .join("");
  }

  function starString(rating) {
    var full = Math.max(0, Math.min(5, Math.round(rating || 5)));
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function renderCard(item) {
    var card = document.createElement("article");
    card.className = "testimonial-card";

    var stars = document.createElement("div");
    stars.className = "stars";
    stars.setAttribute("aria-label", (item.rating || 5) + " out of 5 stars");
    stars.textContent = starString(item.rating);

    var quote = document.createElement("blockquote");
    quote.textContent = "“" + item.quote + "”";

    var attribution = document.createElement("div");
    attribution.className = "testimonial-attribution";

    var avatar = document.createElement("div");
    avatar.className = "testimonial-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = initials(item.name || "?");

    var who = document.createElement("div");
    var nameEl = document.createElement("span");
    nameEl.className = "testimonial-name";
    nameEl.textContent = item.name || "Anonymous";

    var projectEl = document.createElement("span");
    projectEl.className = "testimonial-project";
    var projectBits = [item.projectType, item.location].filter(Boolean);
    projectEl.textContent = projectBits.join(" — ");

    who.appendChild(nameEl);
    if (projectBits.length) {
      who.appendChild(projectEl);
    }

    attribution.appendChild(avatar);
    attribution.appendChild(who);

    card.appendChild(stars);
    card.appendChild(quote);
    card.appendChild(attribution);
    return card;
  }

  function renderInto(container, items) {
    container.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "testimonials-error";
      empty.textContent = "No testimonials yet.";
      container.appendChild(empty);
      return;
    }
    items.forEach(function (item) {
      container.appendChild(renderCard(item));
    });
  }

  function loadTestimonials() {
    var containers = document.querySelectorAll("[data-testimonials]");
    if (!containers.length) return;

    fetch("data/testimonials.json")
      .then(function (response) {
        if (!response.ok) throw new Error("Request failed: " + response.status);
        return response.json();
      })
      .then(function (data) {
        containers.forEach(function (container) {
          var limitAttr = container.getAttribute("data-testimonials-limit");
          var items = data;
          if (limitAttr) {
            items = data.slice(0, parseInt(limitAttr, 10));
          }
          renderInto(container, items);
        });
      })
      .catch(function (err) {
        containers.forEach(function (container) {
          container.innerHTML =
            '<p class="testimonials-error">Testimonials could not be loaded. If you are previewing this site locally by double-clicking the HTML file, run a local server instead (see README.md) — browsers block file:// requests for data files.</p>';
        });
        console.error("Failed to load testimonials.json", err);
      });
  }

  document.addEventListener("DOMContentLoaded", loadTestimonials);
})();
