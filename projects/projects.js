import { fetchJSON, renderProjects } from '../global.js';

(async function () {
    // Fetch project data
    const projects = await fetchJSON(
    window.location.hostname === 'localhost' 
      ? '../lib/projects.json' // Correct relative path for local dev
      : 'https://raw.githubusercontent.com/JeffersonChen888/portfolio/main/lib/projects.json'
  );
  // Select the projects container
  const projectsContainer = document.querySelector('.projects');

  // Render projects
  renderProjects(projects, projectsContainer, 'h2');

  // Count and display the number of projects
  const projectsTitle = document.querySelector('.projects-title');
  if (projectsTitle) {
    projectsTitle.textContent += ` (${projects.length} projects)`;
  }
})();