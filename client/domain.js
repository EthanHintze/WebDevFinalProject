var currentProjectName = undefined;
const projects = [];
export function addProject (project) {
    projects.push(project);
}

export function setCurrentProjectName(name) {
    currentProjectName = name;
}

export function getCurrentProjectName() {
    return currentProjectName;
}

export function loadExistingProjects() {
    return projects;
}
