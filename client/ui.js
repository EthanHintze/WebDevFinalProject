import { addProject, getCurrentProjectName, loadExistingProjects, setCurrentProjectName } from './Domain.js';
import { loadProjectTextFromAPI, storeProjectTextOnAPI } from './service.js';
// Simple hash-based router
const routes = {
  "/": "home",
  "/about": "about",
  "/projects": "projects",
  "/newProject": "newProject",
  "/writingInterface": "writingInterface",
};

const navLinks = document.querySelectorAll("a.navlink");
const pages = document.querySelectorAll(".page");
const projectTitleElement = document.getElementById("project-title");
const projectContentElement = document.getElementById("editor");
const newProjectFormElement = document.getElementById("new-project-form");
const writingTitleElement = document.getElementById("writing-title");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const existingProjectsObject = loadExistingProjects();

function setActive(route) {
  // show page
  pages.forEach((p) => p.classList.toggle("active", p.id === route));
  // set nav active class
  navLinks.forEach((a) => {
    const r = a.getAttribute("data-route") || "/";
    a.classList.toggle("active", r === (location.hash.replace("#", "") || "/"));
  });
}

function resolveRoute(hash) {
  const path = (hash || location.hash || "#/").replace("#", "") || "/";
  return routes[path] || "home";
}

function render() {
  const routeName = resolveRoute();
  setActive(routeName);
  // update document title minimally
  document.title = `${
    routeName[0].toUpperCase() + routeName.slice(1)
  } • Simple Pages`;
}

// handle clicks on buttons with data-link
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-link]");
  if (!btn) return;
  const link = btn.getAttribute("data-link");
  if (link) location.hash = link;
});

// initial render and listen for changes
window.addEventListener("hashchange", render);
window.addEventListener("load", render);

// Handle new project form submission
newProjectFormElement
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("project-title").value;
    const type = document.getElementById("project-type").value;

    setCurrentProjectName(title);
    
    const projectAnchorElement = document.createElement("a");
    projectAnchorElement.className = "card navLink";
    projectAnchorElement.href = "#/writingInterface";
    projectAnchorElement.textContent = title;
    writingTitleElement.textContent = title;
    
    addProject(projectAnchorElement);

    document.getElementById(type).appendChild(projectAnchorElement);
    newProjectFormElement.reset();
  });

  existingProjectsObject.forEach(element => {
    document.getElementById(element.type).appendChild(element);
  });

// Markdown editor and preview


  function updatePreview() {
    const markdown = editor.value;
    const html = marked(markdown, { breaks: true });
    preview.innerHTML = html;
  }

  editor.addEventListener("input", updatePreview);
  updatePreview();

const baseURL = 'http://localhost:5132';
// const baseURL = 'https://webdevfinalproject-geii.onrender.com';
// Project content saving and loading
document
  .getElementById("dataForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Save button clicked");
    await storeProjectTextOnAPI(
      getCurrentProjectName(),
      projectContentElement.value
    );
    console.log(await loadProjectTextFromAPI(getCurrentProjectName()));

  });

