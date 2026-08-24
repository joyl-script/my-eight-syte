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

function showSkeletons(containerId) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = Array.from({ length: 8 }, () =>
    '<div class="skeleton-card"><div class="skeleton-card__poster"></div></div>'
  ).join('')
}

async function getMovies(url, containerId) {
  showSkeletons(containerId)
  try {
    const response = await fetch(url, {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) throw new Error('HTTP ' + response.status)
    const responseData = await response.json()
    showMovies(responseData, containerId)
  } catch (error) {
    showError(containerId)
  }
}

function showError(containerId) {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML =
    '<p style="color:#9ca4ab;font-family:Rubik,sans-serif;padding:2rem 0;">Не удалось загрузить фильмы. Попробуйте обновить страницу.</p>'
}

function showMovies(data, containerId) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ''

  let films = data.films || data.items

  if (!films || !films.length) {
    container.innerHTML =
      '<p style="color:#9ca4ab;font-family:Rubik,sans-serif;padding:2rem 0;">Ничего не найдено</p>'
    return
  }

  films.forEach((movie, index) => {
    const movieEl = document.createElement('div')
    movieEl.classList.add('movie')
    movieEl.style.setProperty('--delay', `${(index % 12) * 40}ms`)

    const title = movie.nameRu || movie.nameEn || 'Название не указано'
    const poster = movie.posterUrlPreview || movie.posterUrl || 'https://placehold.co/230x345/0d0c0f/9ca4ab?text=No+Image'

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
        <div class="movie-container__cart">
          <img src='${poster}' alt="${title}" class="movie__img" width="230" height="345" loading="lazy" decoding="async">
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
      getMovies(apiSearchUrl, 'popular-container')
    }
  })
}
