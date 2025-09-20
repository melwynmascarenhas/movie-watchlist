// Watchlist page script (placeholder)

const watchlistEl = document.getElementById("watchlist");
const watchlistPlaceholder = document.querySelector(
  ".watchlist-wrap .placeholder"
);

async function loadWatchlist() {
  const movies = JSON.parse(localStorage.getItem("watchlist")) || [];

  // clear content and hide placeholder
  watchlistEl.innerHTML = "";
  watchlistPlaceholder.style.display = "none";

  if (movies.length === 0) {
    watchlistPlaceholder.style.display = "flex";
    return;
  }

  // show custom loader inside results container
  watchlistEl.innerHTML = `
    <div class="movies-loader">
      <img src="images/loading.svg" class="loading">
      <p id="upload-text">Loading wishlist...</p>
    </div>
  `;

  let movieCards = [];

  for (const movie of movies) {
    const detailRes = await fetch(
      `https://www.omdbapi.com/?apikey=d0e83a1e&i=${movie}`
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
          <button class="remove-btn" onclick="removeFromWatchlist('${details.imdbID}')">🗑️ Remove</button>
        </div>
      </div>
    `);
  }

  watchlistEl.innerHTML = movieCards.join(" ");
}

function removeFromWatchlist(imdbID) {
  let list = JSON.parse(localStorage.getItem("watchlist")) || [];
  list = list.filter((id) => id !== imdbID);
  localStorage.setItem("watchlist", JSON.stringify(list));
  loadWatchlist();
}

loadWatchlist();
