//Programmable Search Engine control panel.: nazev = InizioJobTaskProgrammableSearchEngine
//Google Custom Search JSON API project name = InizioJobTask
//API key = AIzaSyAEl4Ie76VvLvEz9WPFV8BUNtbGIt1JjYE

/*
<script async src="https://cse.google.com/cse.js?cx=7628e8eba52064244">
</script>
<div class="gcse-search"></div>
*/ 

async function searchGoogle() {
    const query = document.getElementById('searchQuery').value;
    const resultsElement = document.getElementById('results');
    resultsElement.textContent = 'Searching...';

    try {
        const apiKey = 'AIzaSyAEl4Ie76VvLvEz9WPFV8BUNtbGIt1JjYE';
        const cx = '7628e8eba52064244';
        const response = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        resultsElement.textContent = 'Error fetching results';
    }
}

function displayResults(results) {
    const resultsElement = document.getElementById('results');
    resultsElement.textContent = JSON.stringify(results, null, 2);
    window.searchResults = results; // Save results for downloading
}

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
