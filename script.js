const API_URL = "http://localhost:3000/movies";

const movieListDiv = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const addForm = document.getElementById("add-movie-form");

// NEW 🔥
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");

let allMovies = [];

// Render movies
function renderMovies(movies) {
    movieListDiv.innerHTML = "";

    if (movies.length === 0) {
        movieListDiv.innerHTML = "<p>No movies found.</p>";
        return;
    }

    movies.forEach(movie => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}
            <button onclick="editMovie('${movie.id}')">Edit</button>
            <button onclick="deleteMovie('${movie.id}')">Delete</button>
        `;
        movieListDiv.appendChild(div);
    });
}

// Fetch movies
function fetchMovies() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            allMovies = data;
            renderMovies(data);
        })
        .catch(() => {
            movieListDiv.innerHTML =
                "<p style='color:red'>Could not load movies. Is JSON-Server running?</p>";
        });
}

fetchMovies();



// Click search button
searchBtn.addEventListener("click", () => {
    const word = searchInput.value.toLowerCase();

    const filtered = allMovies.filter(m =>
        m.title.toLowerCase().includes(word) ||
        m.genre.toLowerCase().includes(word)
    );

    renderMovies(filtered);
});

// Click clear button
clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderMovies(allMovies);
});

// Add Movie
addForm.addEventListener("submit", e => {
    e.preventDefault();

    const newMovie = {
        id: Date.now().toString(),
        title: document.getElementById("title").value,
        genre: document.getElementById("genre").value,
        year: Number(document.getElementById("year").value)
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie)
    })
        .then(res => res.json())
        .then(() => {
            addForm.reset();
            fetchMovies();
        });
});

// Edit Movie (prompt)
function editMovie(id) {

    const movie = allMovies.find(m => m.id === id);
    if (!movie) return;

    const newTitle = prompt("New Title:", movie.title);
    const newGenre = prompt("New Genre:", movie.genre);
    const newYear = prompt("New Year:", movie.year);

    if (!newTitle || !newGenre || !newYear) return;

    const updated = {
        title: newTitle,
        genre: newGenre,
        year: Number(newYear)
    };

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
    }).then(() => fetchMovies());
}

// Delete Movie
function deleteMovie(id) {
    if (!confirm("Delete this movie?")) return;

    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(() => fetchMovies());
}
