// 1. Define the API Key and HTML elements
const API_KEY = '1640dff5'; 

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movieContainer = document.getElementById('movieContainer');

// 2. Retrieve the last search from memory (localStorage) when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const lastSearch = localStorage.getItem('lastMovieSearch');
    if (lastSearch) {
        searchInput.value = lastSearch;
        getMovie(lastSearch); // If there is a movie in memory, search for it directly
    }
});

// 3. Trigger the search when the button is clicked
searchBtn.addEventListener('click', () => {
    const movieName = searchInput.value.trim();
    if (movieName) {
        getMovie(movieName);
    } else {
        // Error handling (Prevent empty search)
        movieContainer.innerHTML = '<p style="color: orange;">Please enter a movie name.</p>';
    }
});

// Add the ability to search with the Enter key for better user experience
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// 4. Our asynchronous (async/await) function that fetches movie data from the API
async function getMovie(movieName) {
    // Meeting the requirement: Save the searched movie to memory (It won't be lost when the page is refreshed)
    localStorage.setItem('lastMovieSearch', movieName);
    
    // Show a loading message on the screen until the data arrives
    movieContainer.innerHTML = '<p>Searching for the movie, please wait...</p>';

    try {
        // Send a request to the OMDB API (the t= parameter fetches a single, detailed result)
        const response = await fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${API_KEY}`);
        const data = await response.json();

        // Meeting the requirement: If the API says "Movie not found" (Response: "False"), display an error message
        if (data.Response === "False") {
            movieContainer.innerHTML = `<p style="color: red;">Error: ${data.Error} (Movie not found)</p>`;
            return; // Stop the function here
        }

        // 5. Meeting the requirement: If data arrives successfully, print the requested details to the screen (into HTML)
        movieContainer.innerHTML = `
            <div class="movie-card">
                <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${data.Title} Poster" style="max-width: 250px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Director:</strong> ${data.Director}</p>
                <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
            </div>
        `;
    } catch (error) {
        // Meeting the requirement: For unexpected errors like internet disconnection
        movieContainer.innerHTML = `<p style="color: red;">A connection error occurred. Please check your internet connection and try again.</p>`;
        console.error("Error details:", error);
    }
}