window.initSiteTabs = function () {
  var tabs = document.querySelectorAll(".tab-btn");
  var panels = document.querySelectorAll(".tab-panel");
  var validTabs = { work: true, product: true, built: true };
  var onHome = panels.length > 0;

  function showTab(id, updateHash) {
    if (!validTabs[id]) return;
    tabs.forEach(function (btn) {
      var active = btn.dataset.tab === id;
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.id !== "panel-" + id;
    });
    if (updateHash && window.history.replaceState) {
      history.replaceState(null, "", "#" + id);
    }
  }

  if (onHome) {
    tabs.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var tab = btn.dataset.tab;
        if (validTabs[tab]) {
          e.preventDefault();
          showTab(tab, true);
        }
      });
    });

    window.addEventListener("hashchange", function () {
      var hash = location.hash.replace("#", "");
      if (validTabs[hash]) showTab(hash, false);
    });

    var hash = location.hash.replace("#", "");
    showTab(validTabs[hash] ? hash : "work", false);
  }
};
