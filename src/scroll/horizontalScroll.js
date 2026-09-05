import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SLIDE_COUNT } from "../data/slides.js";

export function initHorizontalScroll({ onProgress, onSlideChange, reducedMotion, lenis }) {
  const wrapper = document.querySelector(".scroll-wrapper");
  const track = document.querySelector(".scroll-track");
  const sections = gsap.utils.toArray(".scroll-section");

  if (!wrapper || !track || sections.length === 0) {
    return { scrollToSlide: () => {}, getActiveIndex: () => 0, pause: () => {}, resume: () => {} };
  }

  let activeIndex = 0;
  let isPaused = false;
  let lockedScrollY = 0;

  function preventScroll(e) {
    e.preventDefault();
  }

  function getScrollDistance() {
    return Math.max(track.scrollWidth - window.innerWidth, 0);
  }

  function indexFromProgress(progress) {
    const clamped = gsap.utils.clamp(0, 1, progress);
    return Math.round(clamped * (SLIDE_COUNT - 1));
  }

  const tween = gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      pin: true,
      scrub: reducedMotion ? 0.3 : 1,
      end: () => "+=" + getScrollDistance(),
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate(self) {
        if (isPaused) return;

        onProgress?.(self.progress);

        const nextIndex = indexFromProgress(self.progress);
        if (nextIndex !== activeIndex) {
          activeIndex = nextIndex;
          onSlideChange?.(activeIndex);
        }
      },
    },
  });

  function scrollToSlide(index, immediate = false) {
    const progress = SLIDE_COUNT <= 1 ? 0 : gsap.utils.clamp(0, SLIDE_COUNT - 1, index) / (SLIDE_COUNT - 1);
    const st = tween.scrollTrigger;
    if (!st) return;

    const targetScroll = st.start + (st.end - st.start) * progress;

    if (lenis) {
      lenis.scrollTo(targetScroll, { immediate });
      return;
    }

    if (immediate) {
      window.scrollTo(0, targetScroll);
      ScrollTrigger.update();
      return;
    }

    gsap.to(window, {
      scrollTo: { y: targetScroll, autoKill: true },
      duration: reducedMotion ? 0.4 : 1.2,
      ease: "power2.inOut",
      onUpdate: () => ScrollTrigger.update(),
    });
  }

  ScrollTrigger.addEventListener("refreshInit", () => {
    gsap.set(track, { x: 0 });
  });

  window.addEventListener("resize", () => ScrollTrigger.refresh());

  function pause() {
    if (isPaused) return;

    isPaused = true;
    lockedScrollY = lenis?.scroll ?? window.scrollY;

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    lenis?.stop();
  }

  function resume() {
    if (!isPaused) return;

    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);

    if (lenis) {
      lenis.scrollTo(lockedScrollY, { immediate: true });
      lenis.start();
    } else {
      window.scrollTo(0, lockedScrollY);
    }

    ScrollTrigger.update();
    isPaused = false;
  }

  return {
    scrollToSlide,
    getActiveIndex: () => activeIndex,
    scrollTrigger: tween.scrollTrigger,
    pause,
    resume,
    isPaused: () => isPaused,
  };
}
