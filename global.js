// global.js

console.log('IT'S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 3.1: Adding the navigation menu
const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'cv/', title: 'CV' },
  { url: "https://jeffersonchen888.github.io/portfolio/", title: 'GitHub' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

document.addEventListener("DOMContentLoaded", () => {
  const isGitHubPages = window.location.hostname === "jeffersonchen888.github.io";
  
  for (let p of pages) {
    let url = p.url;
    let title = p.title;

    // If on GitHub Pages, prepend "/portfolio/" to relative URLs
    if (isGitHubPages && !url.startsWith('http')) {
      url = `/portfolio/${url}`;
    } 
    // If not on home page and not an external link, add "../"
    // else if (!ARE_WE_HOME && !url.startsWith('http')) {
    //   url = '../' + url;
    // }

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

  // Theme switcher and related functions
  const existingButton = document.getElementById("theme-button");
  
  if (!existingButton) {
    // Create theme switcher button dynamically
    const themeButton = document.createElement("button");
    themeButton.id = "theme-button";
    themeButton.textContent = "Switch to Dark Theme";
    themeButton.style.position = "absolute";
    themeButton.style.top = "10px";
    themeButton.style.right = "10px";

    // Add the button to the body
    document.body.appendChild(themeButton);

    // Add click event listener
    themeButton.addEventListener("click", toggleTheme);

    // Load and apply the saved theme from localStorage
    applySavedTheme();
  }
});

// Remaining theme-related functions stay the same (toggleTheme, applySavedTheme, updateNavAndButtonContrast)
function toggleTheme() {
    const root = document.documentElement;

    // Toggle the theme class
    if (root.classList.contains("light-theme")) {
        root.classList.replace("light-theme", "dark-theme");
        document.getElementById("theme-button").textContent = "Switch to Light Theme";
        localStorage.setItem("theme", "dark-theme"); // Save the theme to localStorage
    } else {
        root.classList.replace("dark-theme", "light-theme");
        document.getElementById("theme-button").textContent = "Switch to Dark Theme";
        localStorage.setItem("theme", "light-theme"); // Save the theme to localStorage
    }

    // Update button and nav colors to ensure contrast
    updateNavAndButtonContrast();
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme") || "light-theme"; // Default to light theme
    const root = document.documentElement;
    root.className = savedTheme;

    const themeButton = document.getElementById("theme-button");
    if (savedTheme === "dark-theme") {
        themeButton.textContent = "Switch to Light Theme";
    } else {
        themeButton.textContent = "Switch to Dark Theme";
    }

    // Update button and nav colors to ensure contrast
    updateNavAndButtonContrast();
}

function updateNavAndButtonContrast() {
    const root = document.documentElement;

    // Update nav background color
    const nav = document.querySelector("nav");
    if (nav) {
        nav.style.backgroundColor =
            root.classList.contains("dark-theme") ? "var(--background-color-light)" : "var(--background-color-dark)";
    }

    // Update button background color
    const themeButton = document.getElementById("theme-button");
    if (themeButton) {
        themeButton.style.backgroundColor =
            root.classList.contains("dark-theme") ? "var(--button-background-light)" : "var(--button-background-dark)";
        themeButton.style.color =
            root.classList.contains("dark-theme") ? "var(--button-text-color-light)" : "var(--button-text-color-dark)";
    }
}