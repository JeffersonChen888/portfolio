import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async function () {
  const projects = await fetchJSON('./lib/projects.json');

  const latestProjects = projects.slice(0, 3);
  const projectsContainer = document.querySelector('.projects');

  if (projectsContainer) {
    renderProjects(latestProjects, projectsContainer, 'h3');
  }

  const githubData = await fetchGitHubData('your-github-username');

  const profileStats = document.querySelector('#profile-stats');
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
