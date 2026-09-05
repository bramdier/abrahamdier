export const SLIDE_GROUPS = [
  { id: "intro", label: "Intro", start: 0, end: 2 },
  { id: "work", label: "Work", start: 3, end: 3 },
  { id: "built", label: "Built", start: 4, end: 4 },
  { id: "contact", label: "Contact", start: 5, end: 5 },
];

export const SLIDES = [
  { id: "hero", group: "intro", label: "Hero" },
  { id: "about", group: "intro", label: "About" },
  { id: "process", group: "intro", label: "Process" },
  { id: "work", group: "work", label: "Work" },
  { id: "built", group: "built", label: "Built" },
  { id: "contact", group: "contact", label: "Contact" },
];

export const SLIDE_COUNT = SLIDES.length;

export const WORK_SLIDE_INDEX = 3;
export const BUILT_SLIDE_INDEX = 4;
