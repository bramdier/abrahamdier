import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getProjectById } from "../data/projects.js";
import { SLIDES } from "../data/slides.js";
import { isHashNavSuppressed, replaceHash } from "./hashState.js";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function initScrollNav({ scrollToSlide, getActiveIndex, projectModal }) {
  const sections = document.querySelectorAll(".scroll-section");
  const homeBrand = document.getElementById("home-brand");

  function updateUI(index, { updateHash = true } = {}) {
    sections.forEach((section, i) => {
      section.classList.toggle("is-active", i === index);
    });

    if (updateHash && !projectModal?.isOpen?.() && !isHashNavSuppressed()) {
      const slide = SLIDES[index];
      if (slide) {
        replaceHash(slide.id);
      }
    }
  }

  function goHome(e) {
    e?.preventDefault();
    if (projectModal?.isOpen?.()) {
      projectModal.close();
    }
    scrollToSlide(0);
    replaceHash("hero");
  }

  homeBrand?.addEventListener("click", goHome);

  function handleHash(hash) {
    if (!hash || isHashNavSuppressed()) return;

    if (hash === "hero") {
      if (getActiveIndex() !== 0) scrollToSlide(0);
      return;
    }

    if (getProjectById(hash)) {
      if (projectModal?.isOpen?.()) return;
      projectModal?.openFromHash?.(hash);
      return;
    }

    if (projectModal?.isOpen?.()) {
      projectModal.close();
    }

    const index = SLIDES.findIndex((s) => s.id === hash);
    if (index >= 0 && index !== getActiveIndex()) {
      scrollToSlide(index);
    }
  }

  window.addEventListener("hashchange", () => {
    handleHash(location.hash.replace("#", ""));
  });

  window.addEventListener("keydown", (e) => {
    if (projectModal?.isOpen?.()) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const current = getActiveIndex();
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      scrollToSlide(current + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      scrollToSlide(current - 1);
    }
  });

  const hash = location.hash.replace("#", "");
  if (hash && getProjectById(hash)) {
    projectModal?.openFromHash?.(hash);
  } else if (hash) {
    const hashIndex = SLIDES.findIndex((s) => s.id === hash);
    if (hashIndex >= 0) {
      requestAnimationFrame(() => {
        scrollToSlide(hashIndex, true);
        updateUI(hashIndex);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          animateSlideContent(hashIndex);
        }
      });
    } else {
      updateUI(getActiveIndex());
    }
  } else {
    updateUI(getActiveIndex());
  }

  return {
    onSlideChange(index) {
      if (projectModal?.isOpen?.()) return;
      updateUI(index);
      animateSlideContent(index);
    },
  };
}

function animateSlideContent(index) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const section = document.querySelectorAll(".scroll-section")[index];
  if (!section) return;

  const items = section.querySelectorAll(".slide-content > *");
  gsap.fromTo(
    items,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power2.out",
      overwrite: "auto",
    }
  );
}
