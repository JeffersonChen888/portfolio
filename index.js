import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async function () {
    // Fetch all projects
    const projects = await fetchJSON('./lib/projects.json');
  
    if (!projects.length) {
      console.warn("No projects found. Rendering skipped.");
      return;
    }
  
    // Render projects if available
    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');
  
    if (projectsContainer) {
      renderProjects(latestProjects, projectsContainer, 'h3'); // Use 'h3' for smaller headings on the home page
    }
  })();
  
