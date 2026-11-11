const LABELS = {
  cv: "WhatsApp",
  wa: "CV",
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initContactFloat(closeWhatsappPicker) {
  const root = document.querySelector(".contact-float");
  if (!root) return;

  const toggle = root.querySelector(".contact-float__toggle");
  const label = root.querySelector("[data-toggle-label]");
  const cv = root.querySelector(".contact-float__cv");
  const whatsapp = root.querySelector(".whatsapp-float");
  if (!toggle || !label || !cv || !whatsapp) return;

  let flipId = 0;

  function setFace(el, active) {
    el.setAttribute("aria-hidden", active ? "false" : "true");
    if (active) el.removeAttribute("tabindex");
    else el.tabIndex = -1;
  }

  function setMode(mode) {
    const isCv = mode !== "wa";
    const next = isCv ? "cv" : "wa";
    if (root.dataset.mode === next) return;

    const id = ++flipId;
    if (isCv) closeWhatsappPicker?.();

    root.dataset.mode = next;
    setFace(cv, isCv);
    setFace(whatsapp, !isCv);

    if (reducedMotion) {
      label.textContent = LABELS[next];
      toggle.setAttribute("aria-label", isCv ? "Show WhatsApp" : "Show CV");
      return;
    }

    label.classList.add("is-leaving");
    window.setTimeout(() => {
      if (id !== flipId) return;
      label.textContent = LABELS[next];
      toggle.setAttribute("aria-label", isCv ? "Show WhatsApp" : "Show CV");
      label.classList.remove("is-leaving");
      label.classList.add("is-entering");
      void label.offsetWidth;
      label.classList.remove("is-entering");
    }, 220);
  }

  toggle.addEventListener("click", () => {
    setMode(root.dataset.mode === "cv" ? "wa" : "cv");
  });
}
