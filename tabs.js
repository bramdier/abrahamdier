window.initSiteTabs = function () {
  var tabs = document.querySelectorAll(".tab-btn");
  var panels = document.querySelectorAll(".tab-panel");
  var validTabs = { work: true, product: true, built: true };

  function showTab(id, updateHash) {
    if (!validTabs[id]) id = "work";
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

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showTab(btn.dataset.tab, true);
    });
  });

  var hash = location.hash.replace("#", "");
  showTab(validTabs[hash] ? hash : "work", false);
};
