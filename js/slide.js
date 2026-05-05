const popular = document.getElementById('popular-container')
const movies = document.getElementById('movies-container')
const series = document.getElementById('series-container')
const cartoons = document.getElementById('cartoons-container')
const btnPrevPopular = document.getElementById('btn-prev-popular')
const btnNextPopular = document.getElementById('btn-next-popular')
const btnPrevMovies = document.getElementById('btn-prev-movies')
const btnNextMovies = document.getElementById('btn-next-movies')
const btnPrevSeries = document.getElementById('btn-prev-series')
const btnNextSeries = document.getElementById('btn-next-series')
const btnPrevCartoons = document.getElementById('btn-prev-cartoons')
const btnNextCartoons = document.getElementById('btn-next-cartoons')

const scrollAmount = 260

btnNextPopular.addEventListener("click", () => {
  popular.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })
})

btnPrevPopular.addEventListener("click", () => {
  popular.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  })
})


btnNextMovies.addEventListener("click", () => {
  movies.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })
})

btnPrevMovies.addEventListener("click", () => {
  movies.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  })
})

btnNextSeries.addEventListener("click", () => {
  series.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })
})

btnPrevSeries.addEventListener("click", () => {
  series.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  })
})

btnNextCartoons.addEventListener("click", () => {
  cartoons.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })
})

btnPrevCartoons.addEventListener("click", () => {
  cartoons.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  })
})

