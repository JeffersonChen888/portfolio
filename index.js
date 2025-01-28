import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async function () {
  try {
    // Use the GitHub Pages URL format
    const projectsUrl = 'https://github.com/JeffersonChen888/portfolio/blob/main/lib/projects.js';
    const data = await fetchJSON(projectsUrl);
    
    if (!data || !data.projects) {
      throw new Error('Invalid projects data structure');
    }

    // Filter the first 3 projects
    const latestProjects = data.projects.slice(0, 3);

    // Select the projects container
    const projectsContainer = document.querySelector('.projects');

    // Render the latest projects
    if (projectsContainer) {
      renderProjects(latestProjects, projectsContainer, 'h3');
    } else {
      console.warn('Projects container not found');
    }

    // Fetch GitHub data
    const githubData = await fetchGitHubData('JeffersonChen888');

    // Select the GitHub stats container
    const profileStats = document.querySelector('#profile-stats');

    // Update the HTML with GitHub stats
    if (profileStats && githubData) {
      profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
      `;
    } else if (!profileStats) {
      console.warn('Profile stats container not found');
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
})();