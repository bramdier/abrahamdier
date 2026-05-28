(function () {
  function siteRoot() {
    var script = document.currentScript;
    if (!script || !script.src) {
      var list = document.querySelectorAll('script[src*="layout-include.js"]');
      script = list.length ? list[list.length - 1] : null;
    }
    if (!script || !script.src) return "";
    return script.src.replace(/layout-include\.js$/i, "");
  }

  function loadPartial(url, mountId) {
    var mount = document.getElementById(mountId);
    if (!mount) return Promise.resolve();
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error(r.statusText);
        return r.text();
      })
      .then(function (html) {
        mount.innerHTML = html.trim();
      });
  }

  var root = siteRoot();
  Promise.all([
    loadPartial(root + "header.html", "site-header"),
    loadPartial(root + "footer.html", "site-footer"),
  ])
    .then(function () {
      if (typeof window.initSiteTabs === "function") {
        window.initSiteTabs();
      }
    })
    .catch(function () {
      console.warn("Could not load header/footer. Use a local server: npm run preview");
    });
})();
