import { fetchJSON, renderProjects } from '../global.js';

(async function () {
  // Fetch project data
  const projects = await fetchJSON('../lib/projects.json');

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