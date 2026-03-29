(function () {
  var mount = document.getElementById("site-footer");
  if (!mount) return;
  var script = document.currentScript;
  if (!script || !script.src) {
    var list = document.querySelectorAll('script[src*="footer-include.js"]');
    script = list.length ? list[list.length - 1] : null;
  }
  if (!script || !script.src) return;
  var footerUrl = script.src.replace(/footer-include\.js$/i, "footer.html");
  fetch(footerUrl)
    .then(function (r) {
      if (!r.ok) throw new Error(r.statusText);
      return r.text();
    })
    .then(function (html) {
      mount.innerHTML = html.trim();
    })
    .catch(function () {
      mount.innerHTML = "";
    });
})();
