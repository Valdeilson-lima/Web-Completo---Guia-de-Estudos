document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ── 1. Tab scroll gradient indicator ──
  var wrapper = document.querySelector(".tabs-wrapper");
  var scrollEl = document.querySelector(".tabs-scroll");

  if (wrapper && scrollEl) {
    function checkScroll() {
      if (wrapper.scrollWidth > wrapper.clientWidth) {
        scrollEl.classList.add("can-scroll");
      } else {
        scrollEl.classList.remove("can-scroll");
      }
    }
    checkScroll();
    window.addEventListener("resize", checkScroll);
  }

  // ── 2. Scroll progress bar ──
  var progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    function updateProgress() {
      var scrollTop = window.scrollY;
      var docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.setProperty("--progress", progress + "%");
    }
    updateProgress();
    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);
  }

  // ── 3. Active tab highlighting on scroll (same-page anchors) ──
  var tabs = document.querySelectorAll(".tab-btn");
  var sections = [];

  tabs.forEach(function (tab) {
    var href = tab.getAttribute("href");
    if (href && href.startsWith("#")) {
      var el = document.getElementById(href.slice(1));
      if (el) sections.push({ tab: tab, el: el });
    }
  });

  if (sections.length) {
    function updateActive() {
      var scrollY = window.scrollY;
      var found = false;

      for (var i = 0; i < sections.length; i++) {
        var s = sections[i];
        if (scrollY >= s.el.offsetTop - 200) {
          found = true;
        } else {
          if (found || i === 0) {
            sections.forEach(function (t) {
              t.tab.classList.remove("current");
            });
            if (i > 0) sections[i - 1].tab.classList.add("current");
            else sections[0].tab.classList.add("current");
            return;
          }
        }
      }

      sections.forEach(function (t) {
        t.tab.classList.remove("current");
      });
      if (sections.length)
        sections[sections.length - 1].tab.classList.add("current");
    }

    updateActive();
    window.addEventListener("scroll", updateActive);
  }

  // ── 4. Scroll to top button ──
  var scrollTopBtn = document.querySelector(".scroll-top");
  if (scrollTopBtn) {
    var scrollThreshold = 400;

    function toggleScrollTop() {
      if (window.scrollY > scrollThreshold) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }

    toggleScrollTop();
    window.addEventListener("scroll", toggleScrollTop);

    scrollTopBtn.addEventListener("click", function () {
      var prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }
});
