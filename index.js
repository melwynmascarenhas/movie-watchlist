// Placeholder search integration for index.html

let movies;

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsPlaceholder = document.querySelector(".results-wrap .placeholder");
const resultsEl = document.getElementById("results");

searchForm.addEventListener("submit", async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  //fetching all the matches
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=d0e83a1e&s=${query}`
  );
  const data = await response.json();

  let movieCards = [];

  //make fetch request using id of each movie to get detailed information
  if (data.Response === "True") {
    // first remove the placeholder then show custom loader inside results container
    resultsPlaceholder.style.display = "none";
    resultsEl.innerHTML = `
    <div class="movies-loader">
      <img src="images/loading.svg" class="loading">
      <p id="upload-text">Loading movies...</p>
    </div>
  `;

    const movies = data.Search;
    for (const movie of movies) {
      const detailRes = await fetch(
        `https://www.omdbapi.com/?apikey=d0e83a1e&i=${movie.imdbID}`
      );
      const details = await detailRes.json();

      movieCards.push(`
      <div class="movie-card">
        <img src="${details.Poster}" alt="Poster">
        <div class="movie-info">
          <div class="movie-header">
            <h2>${details.Title}</h2>
            <span class="rating">⭐ ${details.imdbRating}</span>
          </div>
          <div class="meta">${details.Runtime} | ${details.Genre}</div>
          <p class="description">${details.Plot}</p>
          <button class="add-btn" onclick="addToWatchlist('${details.imdbID}')">➕ Watchlist</button>
        </div>
      </div>
    `);
    }
  }

  resultsEl.innerHTML = movieCards.join(" ");

  console.log(resultsEl.innerHTML);
});

function addToWatchlist(imdbID) {
  const list = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!list.includes(imdbID)) {
    list.push(imdbID);
    localStorage.setItem("watchlist", JSON.stringify(list));
    alert("Added to watchlist!", imdbID);
  }
}
