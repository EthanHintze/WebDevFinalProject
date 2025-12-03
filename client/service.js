const baseURL = "http://localhost:5132";
// const baseURL = 'https://webdevfinalproject-geii.onrender.com';

export const storeProjectTextOnAPI = async (projectName, projectContent) => {
  const content = {
    projectName: projectName,
    projectData: projectContent,
  };

  const result = await fetch(baseURL + "/api/data/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  console.log("Content saved:", await result.text());
};

export const loadProjectTextFromAPI = async (projectName) => {
  const response = await fetch(
    `${baseURL}/api/data/load?projectName=${encodeURIComponent(projectName)}`
  );
  return await response.json();
};
