import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async function () {
  // Fetch all projects
  const projects = await fetchJSON('./lib/projects.json');

  // Filter the first 3 projects
  const latestProjects = projects.slice(0, 3);

  // Select the projects container
  const projectsContainer = document.querySelector('.projects');

  // Render the latest projects
  if (projectsContainer) {
    renderProjects(latestProjects, projectsContainer, 'h3'); // Use 'h3' for smaller headings on the home page
  }

  // Fetch GitHub data
  const githubData = await fetchGitHubData('your-github-username'); // Replace with your GitHub username

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
  }
})();