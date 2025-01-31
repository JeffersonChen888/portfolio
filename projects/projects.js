// Update projects/projects.js to:
import { fetchJSON, renderProjects } from '../global.js';

(async function () {
  try {
    // const projects = await fetchJSON(
    //   window.location.hostname === 'localhost' 
    //     ? '../lib/projects.json'
    //     : 'https://raw.githubusercontent.com/JeffersonChen888/portfolio/main/lib/projects.json'
    // );
    const projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    if (projectsContainer) {
      renderProjects(projects, projectsContainer, 'h2');
      
      // Add project count
      const projectsTitle = document.querySelector('.projects-title');
      if (projectsTitle) {
        projectsTitle.textContent += ` (${projects.length} projects)`;
      }
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
})();