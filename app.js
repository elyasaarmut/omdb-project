// 1. Define the API Key and HTML elements
const API_KEY = '1640dff5'; 

const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter'); // New Filter
const yearFilter = document.getElementById('yearFilter'); // New Filter
const searchBtn = document.getElementById('searchBtn');
const movieContainer = document.getElementById('movieContainer');

// 2. Retrieve the last search and filters from memory when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const lastSearch = localStorage.getItem('lastMovieSearch');
    const lastType = localStorage.getItem('lastTypeFilter'); 
    const lastYear = localStorage.getItem('lastYearFilter'); 

    if (lastSearch) {
        searchInput.value = lastSearch;
        if (lastType) typeFilter.value = lastType;
        if (lastYear) yearFilter.value = lastYear;
        getMovie(lastSearch, lastType, lastYear); 
    }
});

// 3. Trigger the search when the button is clicked
searchBtn.addEventListener('click', () => {
    const movieName = searchInput.value.trim();
    const typeValue = typeFilter.value; 
    const yearValue = yearFilter.value.trim(); 

    if (movieName) {
        getMovie(movieName, typeValue, yearValue);
    } else {
        movieContainer.innerHTML = '<p style="color: orange;">Please enter a movie name.</p>';
    }
});

// Add the ability to search with the Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// 4. Async function that fetches movie data with applied filters
async function getMovie(movieName, type, year) {
    // Save search state to memory
    localStorage.setItem('lastMovieSearch', movieName);
    localStorage.setItem('lastTypeFilter', type); 
    localStorage.setItem('lastYearFilter', year); 
    
    movieContainer.innerHTML = '<p>Searching, please wait...</p>';

    try {
        // Dynamically build the API URL based on selected filters
        let apiUrl = `https://www.omdbapi.com/?t=${movieName}&apikey=${API_KEY}`;
        if (type) apiUrl += `&type=${type}`;
        if (year) apiUrl += `&y=${year}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.Response === "False") {
            movieContainer.innerHTML = `<p style="color: red;">Error: ${data.Error} (Not found)</p>`;
            return; 
        }

        movieContainer.innerHTML = `
            <div class="movie-card">
                <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${data.Title} Poster" style="max-width: 250px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Director:</strong> ${data.Director}</p>
                <p><strong>Type:</strong> <span style="text-transform: capitalize;">${data.Type}</span></p>
                <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
            </div>
        `;
    } catch (error) {
        movieContainer.innerHTML = `<p style="color: red;">A connection error occurred. Please check your internet connection and try again.</p>`;
        console.error("Error details:", error);
    }
}