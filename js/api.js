const API_KEY = '863891fb-ee82-445d-98e7-f1911eabc3cc'
const API_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=2'
const API_MOVIES = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1'
const API_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const API_SERIES = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=POPULAR_SERIES&page=1'
const API_CARTOONS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=KIDS_ANIMATION_THEME&page=1'

getMovies(API_POPULAR, 'popular-container')
getMovies(API_MOVIES, 'movies-container')
getMovies(API_SERIES, 'series-container')
getMovies(API_CARTOONS, 'cartoons-container')

async function getMovies(url, containerId) {
  const response = await fetch(url, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  })
  const responseData = await response.json()
  showMovies(responseData, containerId)
}

function showMovies(data, containerId) {
  const container = document.getElementById(containerId)

  container.innerHTML = ''

  let films = data.films || data.items

  films.forEach(movie => {
    const movieEl = document.createElement('div')
    movieEl.classList.add('movie')

    const title = movie.nameRu || movie.nameEn || 'Название не указано'
    const poster = movie.posterUrlPreview || movie.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image'

    let rating = movie.ratingKinopoisk || movie.ratingImdb || movie.rating

    if (typeof rating === 'number') {
      rating = rating.toFixed(1)
    } else if (typeof rating === 'string') {
      rating = parseFloat(rating).toFixed(1)
    } else {
      rating = 'N/A'
    }

    let genresText = ''
    if (movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0) {
      const firstTwoGenres = movie.genres.slice(0, 2).map(g => g.genre)
      genresText = firstTwoGenres.join(', ')
    }

    const movieId = movie.kinopoiskId || movie.filmId

    movieEl.innerHTML = `
      <div class="movie-container">
        <div class="movie-container__cart cart-img">
          <img src='${poster}' alt="${title}" class="movie__img">
          <h3 class="movie__name">${title}</h3>
          <div class="movie-desc">
            <p class="movie-desc__rating">⭐ ${rating}</p>
            <p class="movie-desc__genre">${genresText}</p>
          </div>
        </div>
      </div>
    `
    container.appendChild(movieEl)

    movieEl.addEventListener("click", () => {
      window.location.href = `movie-details.html?id=${movieId}`
    })
  })
}

// Поиск
const input = document.getElementById('form-poisk')
const form = document.getElementById('form')

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchText = input.value.trim()
    if (searchText) {
      const apiSearchUrl = API_SEARCH + searchText
      getMovies(apiSearchUrl, 'popular-container') // Заменяет популярные результаты
    }
  })
}

