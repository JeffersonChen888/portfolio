// Global variables to hold the loaded data and computed commit groups
let data = [];
let commits = [];

// Chart dimensions
const width = 1000;
const height = 600;
const margin = { top: 10, right: 10, bottom: 30, left: 40 };

const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
};

// Color scale for time of day
const colorScale = d3.scaleSequential()
    .domain([0, 24])
    .interpolator(d3.interpolateHslLong(d3.hsl(220, 0.8, 0.3), d3.hsl(30, 0.8, 0.5)));

let brushSelection = null;

// Move scales to global scope
let xScale, yScale;

function brushed(event) {
    brushSelection = event.selection;
    updateSelection();
    updateSelectionCount();
    updateLanguageBreakdown();
}

function isCommitSelected(commit) {
    if (!brushSelection) return false;
    
    // Now xScale and yScale are accessible here
    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);
    
    return x >= brushSelection[0][0] && 
           x <= brushSelection[1][0] && 
           y >= brushSelection[0][1] && 
           y <= brushSelection[1][1];
}

function updateSelection() {
    d3.selectAll('circle')
        .classed('selected', d => isCommitSelected(d));
}

function updateSelectionCount() {
    const selectedCommits = brushSelection 
        ? commits.filter(isCommitSelected) 
        : [];

    const countElement = document.getElementById('selection-count');
    countElement.textContent = `${selectedCommits.length || 'No'} commits selected`;

    return selectedCommits;
}

function updateLanguageBreakdown() {
    const selectedCommits = brushSelection 
        ? commits.filter(isCommitSelected) 
        : [];
    const container = document.getElementById('language-breakdown');

    if (selectedCommits.length === 0) {
        container.innerHTML = '';
        return;
    }

    const requiredCommits = selectedCommits.length ? selectedCommits : commits;
    const lines = requiredCommits.flatMap(d => d.lines);

    // Use d3.rollup to count lines per language
    const breakdown = d3.rollup(
        lines,
        v => v.length,
        d => d.type
    );

    // Update DOM with breakdown
    container.innerHTML = '';
    for (const [language, count] of breakdown) {
        const proportion = count / lines.length;
        const formatted = d3.format('.1~%')(proportion);

        container.innerHTML += `
            <dt>${language}</dt>
            <dd>${count} lines (${formatted})</dd>
        `;
    }

    return breakdown;
}

/**
 * loadData:
 * Uses d3.csv to load the code analysis CSV file.
 * A row conversion function converts numeric and date fields.
 */
async function loadData() {
  // Adjust the conversion function as needed based on your CSV column names.
  data = await d3.csv('loc.csv', (row) => ({
    ...row,
    // Convert string values to numbers
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    // Parse dates. We assume that "date" and "timezone" help form an ISO string.
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime)
  }));

  // Now that data is loaded, display the statistics
  displayStats();
  createScatterplot();
}

/**
 * processCommits:
 * Groups the data by commit and returns an array of commit objects.
 * Each commit object contains basic commit info plus derived stats.
 */
function processCommits() {
  commits = d3.groups(data, d => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        // Replace YOUR_REPO with your repository name if desired
        url: 'https://github.com/YOUR_REPO/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        // Calculate fractional hour for time analysis (e.g., 14.5 for 2:30 PM)
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length
      };
      // Hide the original line data so that it doesn't clutter console output
      Object.defineProperty(ret, 'lines', {
        value: lines,
        writable: false,
        configurable: true,
        enumerable: false
      });
      return ret;
    });
}

/**
 * displayStats:
 * Computes and displays various aggregate statistics about the codebase.
 */
function displayStats() {
  // Process commit data first
  processCommits();

  // Create a <dl> element for the stats
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // 1. Total Lines of Code (LOC)
  dl.append('dt').html('Total <abbr title="Lines of Code">LOC</abbr>');
  dl.append('dd').text(data.length);

  // 2. Total Commits
  dl.append('dt').text('Total Commits');
  dl.append('dd').text(commits.length);

  // 3. Number of Files in the Codebase
  const files = d3.group(data, d => d.file);
  dl.append('dt').text('Number of Files');
  dl.append('dd').text(files.size);

  // 4. Maximum & Average File Length (in lines)
  // For each file, we compute the maximum line number.
  const fileLengths = Array.from(files, ([file, lines]) => d3.max(lines, d => d.line));
  const maxFileLength = d3.max(fileLengths);
  const avgFileLength = d3.mean(fileLengths);
  dl.append('dt').text('Longest File (lines)');
  dl.append('dd').text(maxFileLength);
  dl.append('dt').text('Average File Length (lines)');
  dl.append('dd').text(avgFileLength.toFixed(1));

  // 5. Average Line Length (in characters)
  // Using the 'length' field which is assumed to be the character count.
  const avgLineLength = d3.mean(data, d => d.length);
  dl.append('dt').text('Average Line Length (chars)');
  dl.append('dd').text(avgLineLength.toFixed(1));

  // 6. Day of the Week with Most Commits
  // Group commits by day-of-week using the commit's datetime.
  const commitsByDay = d3.rollups(
    commits,
    v => v.length,
    d => new Date(d.datetime).toLocaleDateString('en', { weekday: 'long' })
  );
  // d3.greatest returns the tuple [day, count] with the highest count.
  const mostActiveDayTuple = d3.greatest(commitsByDay, d => d[1]);
  dl.append('dt').text('Most Active Day');
  dl.append('dd').text(`${mostActiveDayTuple[0]} (${mostActiveDayTuple[1]} commits)`);
}

function updateTooltipContent(commit) {
    if (!commit || Object.keys(commit).length === 0) return;

    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');
    const time = document.getElementById('commit-time');
    const author = document.getElementById('commit-author');
    const lines = document.getElementById('commit-lines');

    link.href = commit.url;
    link.textContent = commit.id.slice(0, 7);
    date.textContent = commit.datetime?.toLocaleString('en', {
        dateStyle: 'full'
    });
    time.textContent = commit.datetime?.toLocaleString('en', {
        timeStyle: 'short'
    });
    author.textContent = commit.author;
    lines.textContent = commit.totalLines;
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    const padding = 10;
    
    // Position tooltip near cursor but ensure it stays within viewport
    let left = event.clientX + padding;
    let top = event.clientY + padding;
    
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust if tooltip would go off right edge
    if (left + tooltipRect.width > viewportWidth) {
        left = event.clientX - tooltipRect.width - padding;
    }
    
    // Adjust if tooltip would go off bottom edge
    if (top + tooltipRect.height > viewportHeight) {
        top = event.clientY - tooltipRect.height - padding;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function createScatterplot() {
    // Sort commits by size for better overlapping
    const sortedCommits = d3.sort(commits, d => -d.totalLines);
    
    // Create radius scale
    const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);
    const rScale = d3.scaleSqrt()
        .domain([minLines, maxLines])
        .range([3, 20]);

    // Create SVG
    const svg = d3.select('#chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'visible');

    // Create scales (now assigning to global variables)
    xScale = d3.scaleTime()
        .domain(d3.extent(commits, d => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    yScale = d3.scaleLinear()
        .domain([0, 24])
        .range([usableArea.bottom, usableArea.top]);

    // Add gridlines
    const gridlines = svg.append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`);

    gridlines.call(
        d3.axisLeft(yScale)
            .tickFormat('')
            .tickSize(-usableArea.width)
    );

    // Add dots
    const dots = svg.append('g')
        .attr('class', 'dots');

    dots.selectAll('circle')
        .data(sortedCommits)
        .join('circle')
        .attr('cx', d => xScale(d.datetime))
        .attr('cy', d => yScale(d.hourFrac))
        .attr('r', d => rScale(d.totalLines))
        .attr('fill', d => colorScale(d.hourFrac))
        .attr('opacity', 0.7)
        .on('mouseenter', (event, d) => {
            const circle = event.target;
            d3.select(circle)
                .attr('opacity', 1)
                .style('transform', 'scale(1.5)');
            updateTooltipContent(d);
            document.getElementById('commit-tooltip').hidden = false;
            updateTooltipPosition(event);
        })
        .on('mousemove', (event) => {
            updateTooltipPosition(event);
        })
        .on('mouseleave', (event) => {
            const circle = event.target;
            d3.select(circle)
                .attr('opacity', 0.7)
                .style('transform', 'none');
            document.getElementById('commit-tooltip').hidden = true;
        });

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => String(d % 24).padStart(2, '0') + ':00');

    svg.append('g')
        .attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(yAxis);

    // Add brush
    const brush = d3.brush()
        .on('start brush end', brushed);
    
    svg.append('g')
        .attr('class', 'brush')
        .call(brush);

    // Raise dots above brush overlay
    svg.selectAll('.dots, .overlay ~ *').raise();
}

/* Kick off data loading when the DOM is ready */
document.addEventListener('DOMContentLoaded', loadData);
