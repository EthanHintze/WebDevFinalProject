import { addProject, getCurrentProjectName, loadExistingProjects, setCurrentProjectName } from './Domain.js';
import { loadProjectTextFromAPI, storeProjectTextOnAPI } from './service.js';
// Simple hash-based router
const routes = {
  "/": "home",
  "/about": "about",
  "/projects": "projects",
  "/newProject": "newProject",
  "/writingInterface": "writingInterface",
  "/requirements": "requirements",
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

  
  // Drag and drop demo initialization
  function initDragAndDrop() {
    let dragged = null;
  
    function onDragStart(e) {
      dragged = e.target;
      e.dataTransfer?.setData("text/plain", "");
      e.dataTransfer?.setDragImage?.(e.target, 10, 10);
      e.target.classList.add("dragging");
    }
  
    function onDragEnd(e) {
      if (e.target) e.target.classList.remove("dragging");
      dragged = null;
      document.querySelectorAll('.dnd-container').forEach(c => c.classList.remove('drag-over'));
    }
  
    function onDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const container = e.currentTarget;
      container.classList.add('drag-over');
    }
  
    function onDragLeave(e) {
      e.currentTarget.classList.remove('drag-over');
    }
  
    function onDrop(e) {
      e.preventDefault();
      const container = e.currentTarget;
      if (!dragged) return;
      // Append the dragged element into the drop container
      container.appendChild(dragged);
      container.classList.remove('drag-over');
      dragged = null;
    }
  
    const items = document.querySelectorAll('.dnd-item');
    items.forEach(i => {
      i.addEventListener('dragstart', onDragStart);
      i.addEventListener('dragend', onDragEnd);
    });
  
    const containers = document.querySelectorAll('.dnd-container');
    containers.forEach(c => {
      c.addEventListener('dragover', onDragOver);
      c.addEventListener('dragleave', onDragLeave);
      c.addEventListener('drop', onDrop);
    });
  }
// Animal filter: sample data and UI
function initAnimalFilter() {
  const sampleAnimals = [
    { name: 'Lion', species: 'mammal' },
    { name: 'Elephant', species: 'mammal' },
    { name: 'Sparrow', species: 'bird' },
    { name: 'Cobra', species: 'reptile' },
    { name: 'Frog', species: 'amphibian' },
    { name: 'Salmon', species: 'fish' },
    { name: 'Butterfly', species: 'insect' },
    { name: 'Eagle', species: 'bird' },
    { name: 'Giraffe', species: 'mammal' }
  ];

  const listEl = document.getElementById('animal-list');
  const searchEl = document.getElementById('animal-search');
  const speciesEl = document.getElementById('animal-species');

  if (!listEl || !searchEl || !speciesEl) return;

  function renderList(filterText = '', speciesFilter = '') {
    const text = filterText.trim().toLowerCase();
    listEl.replaceChildren();
    const filtered = sampleAnimals.filter(a => {
      const matchesText = !text || a.name.toLowerCase().includes(text);
      const matchesSpecies = !speciesFilter || a.species === speciesFilter;
      return matchesText && matchesSpecies;
    });

    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No animals found';
      li.className = 'muted';
      listEl.appendChild(li);
      return;
    }

    filtered.forEach(a => {
      const liElement = document.createElement('li');
      const strongElement = document.createElement('strong');
      const divElement = document.createElement('div');
      strongElement.textContent = a.name;
      divElement.textContent = a.species;
      divElement.className = 'animal-species';

      liElement.appendChild(strongElement);
      liElement.appendChild(divElement);

      liElement.tabIndex = 0;
      listEl.appendChild(liElement);
    });
  }

  function onFilterChange() {
    renderList(searchEl.value, speciesEl.value);
  }

  searchEl.addEventListener('input', onFilterChange);
  speciesEl.addEventListener('change', onFilterChange);

  // initial render
  renderList();
}

window.addEventListener('load', () => {
  // initialize DnD demo and animal filter when page loads
  initDragAndDrop();
  initAnimalFilter();
});

// Map demo: demonstrates Array.prototype.map usage
function initMapDemo() {
  const animals = ['cat', 'dog', 'parrot', 'shark', 'ant'];
  const out = document.getElementById('map-output');
  const runBtn = document.getElementById('map-run');
  const upperBtn = document.getElementById('map-upper');
  if (!out || !runBtn || !upperBtn) return;

  function renderList(list) {
    // Clear existing content without using innerHTML
    out.replaceChildren();
    const frag = document.createDocumentFragment();
    list.forEach((name, i) => {
      const div = document.createElement('div');
      div.className = 'map-item';

      const strong = document.createElement('strong');
      strong.textContent = `${i + 1}.`;

      div.appendChild(strong);
      // add a space then the name as a text node
      div.appendChild(document.createTextNode(' ' + name));

      frag.appendChild(div);
    });
    out.appendChild(frag);
  }

  runBtn.addEventListener('click', () => renderList(animals));
  upperBtn.addEventListener('click', () => renderList(animals.map(n => n.toUpperCase())));

  // initial render
  renderList(animals);
}

// Attach map demo initialization to load
window.addEventListener('load', () => {
  try { initMapDemo(); } catch (e) { /* ignore for older pages */ }
});

