export { projects };
const projects = [];

export function addNewProject() {
  const newProject = {
    title: `Project ${projects.length + 1}`,
    description: "A new project.",
  };
  projects.push(newProject);

  // Create a new project card element
  const projectCard = document.createElement("div");
  projectCard.className = "card";
  projectCard.innerHTML = `<strong>${newProject.title}</strong><div class="muted" style="margin-top:6px">${newProject.description}</div>`;

  // Append the new project card to the projects grid
  document.getElementById("projects-grid").appendChild(projectCard);
}
