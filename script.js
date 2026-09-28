const movies = [
  {
    id: 1, title: "Kantara: A Legend", language: "Kannada", genre: "Action • Drama",
    rating: "8.4", poster: "https://placehold.co/420x630/231f20/ffffff?text=Kantara"
  },
  {
    id: 2, title: "Devara", language: "Telugu", genre: "Action • Drama",
    rating: "7.0", poster: "https://placehold.co/420x630/17202a/ffffff?text=Devara"
  },
  {
    id: 3, title: "Pushpa 2", language: "Telugu", genre: "Action • Thriller",
    rating: "8.2", poster: "https://placehold.co/420x630/321b12/ffffff?text=Pushpa+2"
  },
  {
    id: 4, title: "Stree 2", language: "Hindi", genre: "Comedy • Horror",
    rating: "7.6", poster: "https://placehold.co/420x630/251d35/ffffff?text=Stree+2"
  },
  {
    id: 5, title: "Leo", language: "Tamil", genre: "Action • Thriller",
    rating: "7.3", poster: "https://placehold.co/420x630/17202a/ffffff?text=Leo"
  },
  {
    id: 6, title: "Fighter", language: "Hindi", genre: "Action • Drama",
    rating: "6.9", poster: "https://placehold.co/420x630/18252d/ffffff?text=Fighter"
  }
];

const movieGrid = document.getElementById("movieGrid");
const movieCount = document.getElementById("movieCount");
const search = document.getElementById("search");
const bookingPanel = document.getElementById("bookingPanel");
const successModal = document.getElementById("successModal");

let selectedMovie = null;
let selectedShow = null;
let selectedSeats = [];

function renderMovies(list = movies) {
  movieGrid.innerHTML = "";
  movieCount.textContent = `${list.length} movies`;
  if (!list.length) {
    movieGrid.innerHTML = "<p>No movies found. Try another search.</p>";
    return;
  }

  list.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie-card";
    card.innerHTML = `
      <img class="poster" src="${movie.poster}" alt="${movie.title} poster">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.language} • ${movie.genre}</p>
        <p>⭐ ${movie.rating}</p>
        <button class="primary" data-id="${movie.id}">Book Tickets</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => openBooking(movie));
    movieGrid.appendChild(card);
  });
}

function openBooking(movie) {
  selectedMovie = movie;
  selectedShow = null;
  selectedSeats = [];

  document.getElementById("selectedMovieTitle").textContent = movie.title;
  document.getElementById("selectedMovieMeta").textContent =
    `${movie.language} • ${movie.genre} • ⭐ ${movie.rating}`;
  document.getElementById("summaryMovie").textContent = movie.title;
  document.getElementById("summaryShow").textContent = "Choose a show";
  renderShowtimes();
  renderSeats();
  updateSummary();

  bookingPanel.classList.remove("hidden");
  bookingPanel.scrollIntoView({ behavior: "smooth" });
}

function renderShowtimes() {
  const container = document.getElementById("showtimes");
  container.innerHTML = "";
  ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM", "10:00 PM"].forEach(time => {
    const btn = document.createElement("button");
    btn.className = "showtime";
    btn.textContent = time;
    btn.addEventListener("click", () => {
      selectedShow = time;
      document.querySelectorAll(".showtime").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      updateSummary();
    });
    container.appendChild(btn);
  });
}

function renderSeats() {
  const container = document.getElementById("seats");
  container.innerHTML = "";
  const occupied = new Set(["A3", "A4", "B5", "C2", "D7", "E4", "F6"]);

  ["A","B","C","D","E","F"].forEach(row => {
    for (let number = 1; number <= 8; number++) {
      const label = `${row}${number}`;
      const btn = document.createElement("button");
      btn.className = "seat";
      btn.textContent = label;

      if (occupied.has(label)) {
        btn.classList.add("occupied");
        btn.disabled = true;
      } else {
        btn.addEventListener("click", () => toggleSeat(label, btn));
      }
      container.appendChild(btn);
    }
  });
}

function toggleSeat(label, button) {
  if (selectedSeats.includes(label)) {
    selectedSeats = selectedSeats.filter(s => s !== label);
    button.classList.remove("selected");
  } else {
    if (selectedSeats.length >= 6) {
      alert("You can select a maximum of 6 seats.");
      return;
    }
    selectedSeats.push(label);
    button.classList.add("selected");
  }
  updateSummary();
}

function updateSummary() {
  document.getElementById("summaryShow").textContent = selectedShow || "Choose a show";
  document.getElementById("summarySeats").textContent =
    selectedSeats.length ? selectedSeats.join(", ") : "0";
  document.getElementById("total").textContent = `₹${selectedSeats.length * 180}`;
  document.getElementById("bookBtn").disabled = !(selectedShow && selectedSeats.length);
}

document.getElementById("bookBtn").addEventListener("click", () => {
  if (!selectedMovie || !selectedShow || !selectedSeats.length) return;

  const bookingId = "MB" + Math.floor(100000 + Math.random() * 900000);
  document.getElementById("confirmationText").textContent =
    `${selectedMovie.title} • ${selectedShow} • Seats: ${selectedSeats.join(", ")} • Booking ID: ${bookingId}`;
  successModal.classList.remove("hidden");
});

document.getElementById("finishBtn").addEventListener("click", () => {
  successModal.classList.add("hidden");

  // Browsers normally allow window.close() only for windows opened by script.
  // For a normal tab, this fallback returns the user to the home section.
  window.close();

  setTimeout(() => {
    bookingPanel.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    alert("Booking completed. This tab cannot be closed automatically because the browser opened it normally.");
  }, 150);
});

document.getElementById("stayBtn").addEventListener("click", () => {
  successModal.classList.add("hidden");
});

document.getElementById("closeBooking").addEventListener("click", () => {
  bookingPanel.classList.add("hidden");
});

document.getElementById("browseBtn").addEventListener("click", () => {
  document.getElementById("moviesSection").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("homeBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

search.addEventListener("input", e => {
  const query = e.target.value.toLowerCase().trim();
  renderMovies(movies.filter(m =>
    `${m.title} ${m.language} ${m.genre}`.toLowerCase().includes(query)
  ));
});

renderMovies();
