import "lenis/dist/lenis.css";
import "./input.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getProjectById } from "./data/projects.js";
import { loadLayout } from "./layout/loadLayout.js";
import { initProjectModal } from "./modal/projectModal.js";
import { initScrollNav } from "./nav/scrollNav.js";
import { initHorizontalScroll } from "./scroll/horizontalScroll.js";
import { createLenis } from "./scroll/lenisSetup.js";
import { renderProjectLists } from "./ui/renderProjectLists.js";
import { initWhatsappPicker } from "./ui/whatsappPicker.js";
import { SceneManager } from "./webgl/SceneManager.js";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function bootstrap() {
  await loadLayout();
  renderProjectLists();
  initWhatsappPicker();

  const canvas = document.getElementById("webgl");
  let sceneManager = null;

  if (canvas && !reducedMotion) {
    sceneManager = new SceneManager(canvas, { reducedMotion });
    sceneManager.start();
  }

  const lenis = createLenis(reducedMotion);

  let nav;

  const scroll = initHorizontalScroll({
    reducedMotion,
    lenis,
    onProgress(progress) {
      sceneManager?.setProgress(progress);
    },
    onSlideChange(index) {
      sceneManager?.setActiveIndex(index);
      nav?.onSlideChange(index);
    },
  });

  const projectModal = initProjectModal({
    scroll,
    scrollToSlide: scroll.scrollToSlide,
    reducedMotion,
  });

  nav = initScrollNav({
    scrollToSlide: scroll.scrollToSlide,
    getActiveIndex: scroll.getActiveIndex,
    projectModal,
  });

  ScrollTrigger.refresh();

  const hash = location.hash.replace("#", "");
  if (!hash || !getProjectById(hash)) {
    nav.onSlideChange(scroll.getActiveIndex());
  }
}

bootstrap().catch((err) => {
  console.error("Failed to initialize portfolio:", err);
});
