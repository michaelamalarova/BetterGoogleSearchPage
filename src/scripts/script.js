async function searchGoogle() {

    const query = document.getElementById('searchQuery').value;
    const resultsElement = document.getElementById('results');
    const URL = process.env.URL
    resultsElement.classList.remove('hidden');
    resultsElement.textContent = 'Searching...';

    if (!query.trim()) {
        resultsElement.textContent = 'Please enter a search query.';
        return;
    }
    
    try {
        const response = await fetch(`https://${URL}/.netlify/functions/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const results = await response.json();
        window.searchResults = results;
        resultsElement.textContent = null;
        displayResults(query, results);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        resultsElement.classList.remove('hidden');
        resultsElement.textContent = 'Error fetching results';
    }
}

function displayResults(query, results) {
    const resultsElement = document.getElementById('results');
    const downloadButton = document.getElementById('downloadButton');
    const backgroundMusic = document.getElementById('backgroundMusic');

    downloadButton.classList.remove('hidden');
    resultsElement.classList.remove('no-download-button');


    // Create table
    const table = document.createElement('table');
    table.classList.add('results-table');

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const thQuery = document.createElement('th');
    thQuery.colSpan = 3;
    thQuery.textContent = `Results for: ${query}`;
    headerRow.appendChild(thQuery);
    thead.appendChild(headerRow);

    // Create table column headers
    const headerRow2 = document.createElement('tr');
    const thTitle = document.createElement('th');
    thTitle.textContent = 'Title';
    const thSnippet = document.createElement('th');
    thSnippet.textContent = 'Snippet';
    const thLink = document.createElement('th');
    thLink.textContent = 'Link';
    headerRow2.appendChild(thTitle);
    headerRow2.appendChild(thSnippet);
    headerRow2.appendChild(thLink);
    thead.appendChild(headerRow2);

    // Create table body
    const tbody = document.createElement('tbody');
    results.items.forEach(item => {
        const row = document.createElement('tr');
        const tdTitle = document.createElement('td');
        tdTitle.textContent = item.title;
        const tdSnippet = document.createElement('td');
        tdSnippet.textContent = item.snippet;
        const tdLink = document.createElement('td');
        const link = document.createElement('a');
        link.href = item.link;
        link.target = '_blank';
        const linkIcon = document.createElement('img');
        linkIcon.src = 'assets/icons/link-icon.png';
        linkIcon.alt = 'Link Icon';
        link.appendChild(linkIcon);
        const linkContainer = document.createElement('div');
        linkContainer.classList.add('link');
        linkContainer.appendChild(link);
        tdLink.appendChild(linkContainer);
        row.appendChild(tdTitle);
        row.appendChild(tdSnippet);
        row.appendChild(tdLink);
        tbody.appendChild(row);

        backgroundMusic.play().catch(error => {
            console.error('Error playing background music:', error);
        });
});

table.appendChild(thead);
table.appendChild(tbody);
resultsElement.appendChild(table);}

function downloadResults() {
    if (!window.searchResults) {
        alert('No results to download');
        return;
    }
    const blob = new Blob([JSON.stringify(window.searchResults)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.json';
    a.click();
    URL.revokeObjectURL(url);
}

