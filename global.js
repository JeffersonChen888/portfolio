console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 3.1: Adding the navigation menu
const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
  { url: '/portfolio/', title: 'Home' },
  { url: '/portfolio/projects/', title: 'Projects' },
  { url: '/portfolio/contact/', title: 'Contact' },
  { url: '/portfolio/cv/', title: 'CV' },
  { url: "https://jeffersonchen888.github.io/portfolio/", title: 'GitHub' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Create <a> element for the link
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  // Highlight the current page link
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  // Open external links in a new tab
  a.toggleAttribute('target', a.host !== location.host);

  // Append the link to the navigation menu
  nav.append(a);
}

document.addEventListener("DOMContentLoaded", () => {
    const existingButton = document.getElementById("theme-button");
    
    if (!existingButton) {
        const themeButton = document.createElement("button");
        themeButton.id = "theme-button";
        themeButton.textContent = "Switch to Dark Theme";
        themeButton.style.position = "absolute";
        themeButton.style.top = "10px";
        themeButton.style.right = "10px";

        document.body.appendChild(themeButton);

        themeButton.addEventListener("click", toggleTheme);
        applySavedTheme();
    }
});

function toggleTheme() {
    const root = document.documentElement;

    if (root.classList.contains("light-theme")) {
        root.classList.replace("light-theme", "dark-theme");
        document.getElementById("theme-button").textContent = "Switch to Light Theme";
        localStorage.setItem("theme", "dark-theme");
    } else {
        root.classList.replace("dark-theme", "light-theme");
        document.getElementById("theme-button").textContent = "Switch to Dark Theme";
        localStorage.setItem("theme", "light-theme");
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme") || "light-theme";
    const root = document.documentElement;
    root.className = savedTheme;

    const themeButton = document.getElementById("theme-button");
    if (savedTheme === "dark-theme") {
        themeButton.textContent = "Switch to Light Theme";
    } else {
        themeButton.textContent = "Switch to Dark Theme";
    }
}

export async function fetchGitHubData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return null;
    }
}

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch JSON data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

export function renderProjects(projects, container, headingTag = 'h2') {
    container.innerHTML = '';
    for (let project of projects) {
        const projectElement = document.createElement('div');
        const heading = document.createElement(headingTag);
        heading.textContent = project.title;

        const description = document.createElement('p');
        description.textContent = project.description;

        projectElement.append(heading, description);
        container.append(projectElement);
    }
}
