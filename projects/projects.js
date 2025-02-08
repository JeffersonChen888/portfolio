// Update projects/projects.js to:
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

// Function to render pie chart
function renderPieChart(projectsGiven) {
  // Calculate rolled data
  let rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );
  
  // Convert the rolled data into the format we need
  let data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  // Create pie chart
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value(d => d.value);
  
  // Generate the pie chart data
  let arcData = sliceGenerator(data);
  let arcs = arcData.map(d => arcGenerator(d));
  
  // Create color scale
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  
  // Clear existing chart and legend
  d3.select('#projects-pie-plot').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();
  
  let selectedIndex = -1;
  
  // Draw the pie chart
  let svg = d3.select('#projects-pie-plot');
  arcs.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('cursor', 'pointer')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        
        // Update wedge styles
        svg.selectAll('path')
          .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');
        
        // Update legend styles
        d3.select('.legend')
          .selectAll('li')
          .attr('class', (_, idx) => idx === selectedIndex ? 'legend-item selected' : 'legend-item');
        
        // Filter projects based on selection
        if (selectedIndex === -1) {
          renderProjects(projectsGiven, document.querySelector('.projects'), 'h2');
        } else {
          const selectedYear = data[selectedIndex].label;
          const filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
          renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');
        }
      });
  });

  // Create legend
  let legend = d3.select('.legend');
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color: ${colors(idx)}`)
      .attr('cursor', 'pointer')
      .html(`<span class="swatch"></span>${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        
        // Update wedge styles
        svg.selectAll('path')
          .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');
        
        // Update legend styles
        legend.selectAll('li')
          .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item');
        
        // Filter projects based on selection
        if (selectedIndex === -1) {
          renderProjects(projectsGiven, document.querySelector('.projects'), 'h2');
        } else {
          const selectedYear = data[selectedIndex].label;
          const filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
          renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');
        }
      });
  });
}

// Add CSS styles for the pie chart interactions
const style = document.createElement('style');
style.textContent = `
  #projects-pie-plot:has(path:hover) path:not(:hover) {
    opacity: 0.5;
  }
  
  #projects-pie-plot path {
    transition: 300ms;
  }
  
  .selected {
    --color: oklch(60% 45% 0) !important;
  }
  
  .selected:is(path) {
    fill: var(--color);
  }
`;
document.head.appendChild(style);

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
      // Add search input
      const searchContainer = document.createElement('div');
      searchContainer.innerHTML = `
        <input
          class="searchBar"
          type="search"
          aria-label="Search projects"
          placeholder="🔍 Search projects…"
        />
      `;
      document.querySelector('.projects-title').after(searchContainer);

      // Initial render
      renderProjects(projects, projectsContainer, 'h2');
      renderPieChart(projects);
      
      // Add project count
      const projectsTitle = document.querySelector('.projects-title');
      if (projectsTitle) {
        projectsTitle.textContent += ` (${projects.length} projects)`;
      }

      // Add search functionality
      const searchInput = document.querySelector('.searchBar');
      searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const filteredProjects = projects.filter(project => {
          const values = Object.values(project).join('\n').toLowerCase();
          return values.includes(query);
        });
        
        // Update both the project list and pie chart
        renderProjects(filteredProjects, projectsContainer, 'h2');
        renderPieChart(filteredProjects);
      });
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
})();