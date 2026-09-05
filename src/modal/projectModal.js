import gsap from "gsap";
import { BUILT_SLIDE_INDEX, WORK_SLIDE_INDEX } from "../data/slides.js";
import { BUILT_PROJECTS, getProjectById } from "../data/projects.js";
import { replaceHash } from "../nav/hashState.js";
import { ModalSceneManager } from "../webgl/ModalSceneManager.js";

const BUILT_IDS = new Set(BUILT_PROJECTS.map((p) => p.id));

function setModalOpenClass(active) {
  document.documentElement.classList.toggle("modal-open", active);
  document.body.classList.toggle("modal-open", active);
}

export function initProjectModal({ scroll, scrollToSlide, reducedMotion }) {
  const modal = document.getElementById("project-modal");
  const canvas = document.getElementById("webgl-modal");
  if (!modal) return { openProject: () => {}, close: () => {}, openFromHash: () => false, isOpen: () => false };

  const closeBtn = modal.querySelector(".project-modal__close");
  const metaEl = modal.querySelector(".project-modal__meta");
  const titleEl = modal.querySelector(".project-modal__title");
  const descEl = modal.querySelector(".project-modal__description");
  const tagsEl = modal.querySelector(".project-modal__tags");
  const linkEl = modal.querySelector(".project-modal__link");
  const contentEl = modal.querySelector(".project-modal__content");

  const modalWebgl = canvas && !reducedMotion ? new ModalSceneManager(canvas, { reducedMotion }) : null;

  let isOpen = false;
  let lastTrigger = null;

  function populate(project) {
    const metaParts = [project.company, project.year != null ? String(project.year) : null].filter(Boolean);
    metaEl.textContent = metaParts.length ? metaParts.join(" · ") : "";
    titleEl.textContent = project.title;
    descEl.textContent = project.description;
    tagsEl.textContent = project.tags?.join(" · ") ?? "";

    if (project.link) {
      linkEl.href = project.link;
      linkEl.hidden = false;
    } else {
      linkEl.hidden = true;
    }
  }

  function trapFocus(e) {
    if (!isOpen || e.key !== "Tab") return;
    const focusable = modal.querySelectorAll("button, a[href]");
    const list = [...focusable].filter((el) => !el.hidden);
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

  async function openProject(projectId, originX = window.innerWidth / 2, originY = window.innerHeight / 2, trigger = null) {
    const project = getProjectById(projectId);
    if (!project || isOpen) return;

    lastTrigger = trigger;
    populate(project);
    isOpen = true;

    scroll?.pause?.();
    setModalOpenClass(true);
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    replaceHash(project.id);

    gsap.set(contentEl, { opacity: 0, y: 32 });

    if (modalWebgl) {
      await modalWebgl.open(originX, originY);
    } else {
      modal.classList.add("project-modal--visible");
    }

    gsap.to(contentEl, {
      opacity: 1,
      y: 0,
      duration: reducedMotion ? 0.2 : 0.6,
      ease: "power2.out",
    });

    closeBtn?.focus();
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keydown", trapFocus);
  }

  async function close() {
    if (!isOpen) return;

    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keydown", trapFocus);

    gsap.to(contentEl, {
      opacity: 0,
      y: 16,
      duration: reducedMotion ? 0.15 : 0.35,
      ease: "power2.in",
    });

    if (modalWebgl) {
      await modalWebgl.close();
    }

    modal.classList.remove("project-modal--visible");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    setModalOpenClass(false);
    isOpen = false;

    scroll?.resume?.();

    const activeSlide = scroll?.getActiveIndex?.() ?? 0;
    const slideId =
      activeSlide === BUILT_SLIDE_INDEX ? "built" : activeSlide === WORK_SLIDE_INDEX ? "work" : null;
    if (slideId) {
      replaceHash(slideId);
    }

    lastTrigger?.focus?.();
    lastTrigger = null;
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  function handleListActivate(item) {
    const rect = item.getBoundingClientRect();
    openProject(
      item.dataset.projectId,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      item
    );
  }

  document.querySelectorAll("[data-project-list]").forEach((list) => {
    list.addEventListener("click", (e) => {
      const item = e.target.closest(".project-list__item");
      if (!item) return;
      e.preventDefault();
      handleListActivate(item);
    });
    list.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const item = e.target.closest(".project-list__item");
      if (!item) return;
      e.preventDefault();
      handleListActivate(item);
    });
  });

  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  function openFromHash(hash) {
    const project = getProjectById(hash);
    if (!project) return false;
    if (isOpen) return true;

    const slideIndex = BUILT_IDS.has(hash) ? BUILT_SLIDE_INDEX : WORK_SLIDE_INDEX;
    scrollToSlide?.(slideIndex, true);

    requestAnimationFrame(() => {
      openProject(hash);
    });
    return true;
  }

  return { openProject, close, openFromHash, isOpen: () => isOpen };
}
