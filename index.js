const APIKEY = "&apikey=45aea38c";
const TEXT_NOT_RESULT = "Movies not found...";
const CLASS_NOT_RESULT = "not-movies";

const body = document.querySelector("body");
const filmNode = document.querySelector("#input-value");
const buttonSearch = document.querySelector(".button-search");
const moviesList = document.querySelector(".films-list");
const modalCard = document.querySelector(".card");
// const buttonCloseModal = document.querySelector(".card__close-button");

// ----------- ОБРАБОТЧИКИ СОБЫТИЙ ----------------------
buttonSearch.addEventListener("click", searchMovie);
filmNode.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    searchMovie();
  }
});
// buttonCloseModal.addEventListener("click", closeInfoMovie);
window.addEventListener("click", (e) => {
  if (e.target === modalCard) {
    closeInfoMovie();
  }
});
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeInfoMovie();
  }
});
modalCard.addEventListener("click", (e) => {
  if (e.target.closest('.card__close-button')) {
    closeInfoMovie()
  }
});

// ------------ ФУНКЦИИ ---------------------
// функция поиска фильма
function searchMovie() {
  // берем введеное значение от пользователя
  const movie = getValueFromUser();

  // условие, если значение от пользователя пустое, остановиться
  if (!movie) return;

  // получаем список фильмов от сервера
  getListMovie(movie);

  // очищаем поле ввода
  clearInput();
}

// ассинхронная функция получения списка фильмов
async function getListMovie(movie) {
  // получение ответа по ссылке с веденным фильмом от пользователя
  const res = await fetch(`https://www.omdbapi.com/?s=${movie}` + APIKEY);

  // получение ответа в формате json
  const result = await res.json();

  // записываем в переменную результат поиска
  const search = result.Response;

  // проверка на результат поиска
  if (search === "False") {
    moviesList.innerText = TEXT_NOT_RESULT;
    moviesList.classList.add(CLASS_NOT_RESULT);
  } else {
    const movies = result.Search;
    renderListMovies(movies);
  }
}

// функция получения введеного значения от пользователя
function getValueFromUser() {
  const movie = filmNode.value.trim();

  return movie;
}

// функция очищения инпута
function clearInput() {
  filmNode.value = "";
}

// функция отрисовки карточек фильмов
function renderListMovies(movies) {
  let listMoviesHTML = "";

  
  movies.forEach((movie) => {
    const movieHTML = `
    <li class="film-wrapper" id="${movie.imdbID}">
        <div class="film__image">
            <img class="movie-poster" src="${movie.Poster !== "N/A" ? movie.Poster : 'img/not-poster.png'}" alt="" />
        </div>
        <div class="film__feature">
            <p class="film-header">${movie.Title}</p>
            <p class="film-realeased">${movie.Year}</p>
            <p class="film-category">${movie.Type}</p>
        </div>
    </li>
    `;
    listMoviesHTML += movieHTML;
    moviesList.innerHTML = listMoviesHTML;
  });
  openInfoMovie();
}

// функция открытия информации о фильме
function openInfoMovie() {
  const moviesNode = moviesList.querySelectorAll(".film-wrapper");

  moviesNode.forEach((movie) => {
    movie.addEventListener("click", function () {
      fetch(`https://www.omdbapi.com/?i=${movie.getAttribute("id")}` + APIKEY)
        .then((response) => response.json())
        .then((data) => {
          modalCard.classList.add("card_open");
          body.classList.add("stop-scrolling");
          renderDescription(data);
        });
    });
  });
}

// функция отрисовки модального окна информации о фильме
function renderDescription(movie) {
  const infoHTML = `
  <div class="card__content">
          <button class="card__close-button"></button>
          <div class="card__content_wrapper">
              <div class="">
                  <img class="movie-description-poster" src="${movie.Poster !== "N/A" ? movie.Poster : 'img/not-poster.png'}" alt="poster">
              </div>
              <div class="movie-characteristics">
                  <ul class="movie-descriprions__wrapper">
                      <li class="title">${movie.Title}</li>
                      <li class="tag">Year: <span>${movie.Year !== "N/A" ? movie.Year : "-"}</span></li>
                      <li class="tag">Rating: <span>${movie.Rated !== "N/A" ? movie.Rated : "-"}</span></li>
                      <li class="tag">Release date: <span>${movie.Released !== "N/A" ? movie.Released : "-"}</span></li>
                      <li class="tag">Duration: <span>${movie.Runtime !== "N/A" ? movie.Runtime : "-"}</span></li>
                      <li class="tag">Genre: <span>${movie.Genre !== "N/A" ? movie.Genre : "-"}</span></li>
                      <li class="tag">Director: <span>${movie.Director !== "N/A" ? movie.Director : "-"}</span></li>
                      <li class="tag">Scenario: <span>${movie.Writer !== "N/A" ? movie.Writer : "-"}</span></li>
                      <li class="tag">Actors: <span>${movie.Actor !== undefined ? movie.Actor : "-"}</span></li>
                  </ul>
              </div>
          </div>
          <div class="movie-descriprion">
              ${movie.Plot !== "N/A" ? movie.Plot : ""}
          </div>
      </div>
  `;
  modalCard.innerHTML = infoHTML;
}

// функция закрытия модального окна
function closeInfoMovie() {
  modalCard.classList.remove("card_open");
  body.classList.remove("stop-scrolling");
}
