const WA_NUMBER = "6282274583689";

const TOPICS = {
  course:
    "Hello Abraham, saya ingin diskusi tentang kursus online/offline tentang web programming, data engineering, atau diskusi tentang karir.",
  skripsi:
    "Hello Abraham, saya ingin diskusi tentang projek skripsi baik dalam pembuatan aplikasi dan penulisan skripsi sampai lulus.",
  app: "Hello Abraham, saya ingin diskusi tentang projek aplikasi baik web dan android baik sederhana ataupun yang kompleks.",
};

function waUrl(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function initWhatsappPicker() {
  const trigger = document.querySelector(".whatsapp-float");
  const picker = document.getElementById("whatsapp-picker");
  if (!trigger || !picker) return;

  const closeBtn = picker.querySelector(".whatsapp-picker__close");
  const firstOption = picker.querySelector("[data-wa-topic]");
  let isOpen = false;

  function getFocusable() {
    return [...picker.querySelectorAll("button")].filter((el) => !el.hidden);
  }

  function open(e) {
    e.preventDefault();
    if (isOpen) return;

    isOpen = true;
    picker.hidden = false;
    picker.setAttribute("aria-hidden", "false");
    document.body.classList.add("wa-picker-open");
    firstOption?.focus();
    document.addEventListener("keydown", onKeyDown);
  }

  function close() {
    if (!isOpen) return;

    isOpen = false;
    picker.hidden = true;
    picker.setAttribute("aria-hidden", "true");
    document.body.classList.remove("wa-picker-open");
    document.removeEventListener("keydown", onKeyDown);
    trigger.focus();
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    if (e.key !== "Tab") return;

    const list = getFocusable();
    if (list.length === 0) return;

    const first = list[0];
    const last = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  trigger.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);

  picker.addEventListener("click", (e) => {
    if (e.target === picker) {
      close();
      return;
    }

    const option = e.target.closest("[data-wa-topic]");
    if (!option || !picker.contains(option)) return;

    const message = TOPICS[option.dataset.waTopic];
    if (!message) return;

    window.open(waUrl(message), "_blank", "noopener,noreferrer");
    close();
  });
}

export { TOPICS, waUrl };
