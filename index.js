const APIKEY = "&apikey=45aea38c";

const filmNode = document.querySelector("#input-value");
const buttonSearch = document.querySelector(".button-search");
const moviesList = document.querySelector(".films-list");

buttonSearch.addEventListener("click", searchMovie);

function searchMovie() {
  const movie = getValueFromUser();

  if (!movie) return;

  getListMovie(movie);

  clearInput();
}

async function getListMovie(movie) {
  const res = await fetch(`https://www.omdbapi.com/?s=${movie}` + APIKEY);

  const result = await res.json();

  const movies = result.Search;

  if (!movies) {
    return alert('фильмы не найдены')};

  renderListMovies(movies);
}

function getValueFromUser() {
  const movie = filmNode.value;

  return movie;
}

function clearInput() {
  filmNode.value = "";
}

function renderListMovies(movies) {
  let listMoviesHTML = "";

  movies.forEach((movie) => {
    const movieHTML = `
    <li class="film-wrapper">
        <div class="film__image">
            <img src="${movie.Poster}" alt="" />
        </div>
        <div class="film__feature">
            <p class="film-header">${movie.Title}</p>
            <p class="film-realeased">${movie.Year}</p>
            <p class="film-category">${movie.Type}</p>
        </div>
    </li>
    `;
    listMoviesHTML += movieHTML;
  });

  moviesList.innerHTML = listMoviesHTML;
}

// fetch('https://www.omdbapi.com/?s=batman&apikey=45aea38c')
// .then(response => response.json())
// .then(json => console.log(json));
