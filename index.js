// Update index.js to:
import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async function () {
  try {
    // const projects = await fetchJSON(
    //   window.location.hostname === 'localhost' 
    //     ? './lib/projects.json'
    //     : 'https://raw.githubusercontent.com/JeffersonChen888/portfolio/main/lib/projects.json'
    // );
    const projects = await fetchJSON('./lib/projects.json');

    // Render latest projects
    const projectsContainer = document.querySelector('.projects');
    if (projectsContainer) {
      renderProjects(projects.slice(0, 3), projectsContainer, 'h3');
    }

    // GitHub stats
    const githubData = await fetchGitHubData('JeffersonChen888');
    const profileStats = document.querySelector('#profile-stats');
    if (profileStats && githubData) {
      profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>`;
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
})();