// Simple hash-based router
const routes = {
  "/": "home",
  "/about": "about",
  "/projects": "projects",
  "/newproject": "newproject",
};

const navLinks = document.querySelectorAll("a.navlink");
const pages = document.querySelectorAll(".page");

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
document
  .getElementById("new-project-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("project-title").value;
    const type = document.getElementById("project-type").value;

    const card = document.createElement("button");
    card.className = "card";
    card.textContent = title;


    
    document.getElementById(type).appendChild(card);

    this.reset();
  });
