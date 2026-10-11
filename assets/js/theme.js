// Light / dark / system theme toggle (same behavior as al-folio), mobile nav and publication panels.
(function () {
  var root = document.documentElement;

  function readSetting() {
    try { return localStorage.getItem("theme") || "system"; } catch (e) { return "system"; }
  }

  function apply(setting) {
    var dark = setting === "dark" ||
      (setting === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.setAttribute("data-theme-setting", setting);
    root.setAttribute("data-theme", dark ? "dark" : "light");
  }

  apply(readSetting());

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (readSetting() === "system") apply("system");
  });

  document.addEventListener("DOMContentLoaded", function () {
    var order = ["system", "light", "dark"];
    var toggle = document.getElementById("light-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = order[(order.indexOf(readSetting()) + 1) % order.length];
        try { localStorage.setItem("theme", next); } catch (e) {}
        apply(next);
      });
    }

    var navBtn = document.querySelector(".nav-toggler");
    var menu = document.querySelector(".nav-menu");
    if (navBtn && menu) {
      navBtn.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // "Abs" / "Bib" buttons open the matching panel and close its sibling
    document.querySelectorAll("[data-panel]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var body = btn.closest(".pub-body");
        var target = body.querySelector("." + btn.getAttribute("data-panel"));
        body.querySelectorAll(".pub-panel").forEach(function (p) {
          if (p !== target) p.classList.remove("open");
        });
        target.classList.toggle("open");
      });
    });
  });
})();
