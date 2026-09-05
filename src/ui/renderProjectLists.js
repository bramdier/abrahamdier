import { BUILT_PROJECTS, getYearRange, WORK_PROJECTS } from "../data/projects.js";

function createProjectItem(project) {
  const li = document.createElement("li");
  li.className = "project-list__item";
  li.dataset.projectId = project.id;
  li.setAttribute("role", "button");
  li.setAttribute("tabindex", "0");
  li.setAttribute("aria-label", `View ${project.title}`);

  const title = document.createElement("span");
  title.className = "project-list__title";
  title.textContent = project.title;

  const year = document.createElement("span");
  year.className = "project-list__year label-text";
  year.textContent = project.year != null ? String(project.year) : "—";

  li.append(title, year);
  return li;
}

function renderList(container, projects) {
  if (!container) return;
  container.replaceChildren();
  projects.forEach((project) => {
    container.appendChild(createProjectItem(project));
  });
}

export function renderProjectLists() {
  renderList(document.querySelector('[data-project-list="work"]'), WORK_PROJECTS);
  renderList(document.querySelector('[data-project-list="built"]'), BUILT_PROJECTS);

  const workRange = document.querySelector("[data-work-range]");
  const builtRange = document.querySelector("[data-built-range]");
  if (workRange) workRange.textContent = getYearRange(WORK_PROJECTS);
  if (builtRange) builtRange.textContent = getYearRange(BUILT_PROJECTS);
}
