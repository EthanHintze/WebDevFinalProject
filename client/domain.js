// export function convertToJson(form) {
//     console.log("Made it to domain")
//     let formData = {};
//     for (let i = 0; i < form.elements.length; i++) {
//         let element = form.elements[i];
//         if (element.type !== "submit") {
//             formData[element.name] = element.value;
//         }
//     }
//     let jsonData = JSON.stringify(formData);
//     return jsonData;
    
// }

// export function addNewProject() {
//   const newProject = {
//     title: `Project ${projects.length + 1}`,
//     description: "A new project.",
//   };
//   projects.push(newProject);

//   // Create a new project card element
//   const projectCard = document.createElement("div");
//   projectCard.className = "card";
//   projectCard.innerHTML = `<strong>${newProject.title}</strong><div class="muted" style="margin-top:6px">${newProject.description}</div>`;

//   // Append the new project card to the projects grid
//   document.getElementById("projects-grid").appendChild(projectCard);
// }
