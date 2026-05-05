// Убираем жестко заданный FILM_ID
const NEW_API_KEY = '863891fb-ee82-445d-98e7-f1911eabc3cc';

// Функция преобразования YouTube ссылки
function convertToEmbedUrl(url) {
  if (!url) return url;

  if (url.includes('youtube.com/v/')) {
    const videoId = url.split('/v/')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

// Добавляем функцию для получения ID из URL
function getMovieIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Меняем функцию loadAllMovieData - теперь она принимает ID
async function loadAllMovieData(movieId) {
  if (!movieId) {
    console.error('No movie ID provided');
    return;
  }

  const API_ID_MOVIES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}`;
  const API_ACTER = `https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${movieId}`;
  const API_VIDEO = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/videos`;

  const [movieDetails, actorsData, videoData] = await Promise.all([
    fetch(API_ID_MOVIES, { headers: { 'X-API-KEY': NEW_API_KEY } }).then(r => r.json()),
    fetch(API_ACTER, { headers: { 'X-API-KEY': NEW_API_KEY } }).then(r => r.json()),
    fetch(API_VIDEO, { headers: { 'X-API-KEY': NEW_API_KEY } }).then(r => r.json())
  ]);

  renderDescription(movieDetails, 'story-container');
  renderActors(actorsData, 'acter-container');
  updateHeaderWithMovie(movieDetails);

  // Извлекаем ссылки на трейлер и полный фильм
  let trailerUrl = null;
  let movieFullUrl = null;

  if (videoData && videoData.items) {
    for (const item of videoData.items) {
      if (item.site === 'YOUTUBE' && !trailerUrl) {
        trailerUrl = item.url;
      }
      if (item.site === 'KINOPOISK_WIDGET' && !movieFullUrl) {
        movieFullUrl = item.url;
      }
    }
  }

  // Сохраняем ссылки глобально
  window.videoLinks = { trailerUrl, movieFullUrl };
  console.log('Видео ссылки загружены:', window.videoLinks);
}

function renderDescription(details, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <p class="story__desc">${details.description || details.shortDescription || 'Нет описания'}</p>
  `;
}

function renderActors(actors, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ` 
    <div class="acter-container">
      ${actors.slice(0, 6).map(actor => `
        <div class="acter-details">
          <img src="${actor.posterUrl || 'default.jpg'}" alt="${actor.nameRu || ''}" class="acter__img" width="40" height="70">
          <div class="acter-name">
            <h4 class="acter-name__one">${actor.nameRu || 'Неизвестно'}</h4>
            <p class="acter-name__two">${actor.description || ''}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function updateHeaderWithMovie(movie) {
  updateHeaderPoster(movie);
  updateHeaderInfo(movie);
}

function updateHeaderPoster(movie) {
  const header = document.querySelector('.header');
  const posterUrl = movie.backgroundImage || movie.coverUrl || movie.posterUrl;
  if (posterUrl) {
    header.style.setProperty('--header-poster', `url(${posterUrl})`);
  }
}

function updateHeaderInfo(movie) {
  const info = document.querySelector('.info');
  const title = movie.nameRu;
  const type = movie.type;

  info.innerHTML = `
    <button class="btn-genre">${type}</button>
    <h2 class="info__title">${title}</h2>
    <div class="info-button">
      <button id="watch-movie" class="btn-counting btn-big"> 
        <img src="icons/play.svg" alt="">Play Now
      </button>
      <button id="watch-treller" class="btn-add btn-big"> 
        <img src="icons/play.svg" alt="">Watch Trailer
      </button>
    </div>
  `;

  // После создания кнопок — навешиваем обработчики
  attachVideoHandlers();
}

// Получаем ID из URL и загружаем фильм
const movieId = getMovieIdFromUrl();
if (movieId) {
  loadAllMovieData(movieId);
} else {
  console.error('No movie ID specified in URL');
  document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;">Ошибка: Фильм не выбран</h1><p style="text-align:center;"><a href="index.html">Вернуться на главную</a></p>';
}

// ========== УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ ==========

// Находим элементы на странице
const modal = document.getElementById('videoModal');
const iframe = document.getElementById('videoIframe');
const closeBtn = document.querySelector('.close-modal');

// Функция открытия окна с видео (только для YouTube)
function openModalWithVideo(videoUrl) {
  if (!videoUrl) {
    alert('Видео не найдено');
    return;
  }

  const embedUrl = convertToEmbedUrl(videoUrl);
  iframe.src = '';
  iframe.removeAttribute('is');
  iframe.src = embedUrl;
  modal.style.display = 'flex';
}

// Функция закрытия окна
function closeModal() {
  modal.style.display = 'none';
  // Останавливаем видео
  iframe.src = '';
}

// При клике на крестик — закрываем
if (closeBtn) {
  closeBtn.addEventListener('click', closeModal);
}

// При клике на фон — тоже закрываем
if (modal) {
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// ========== ПРИВЯЗЫВАЕМ КНОПКИ К ОТКРЫТИЮ ОКНА ==========

function attachVideoHandlers() {
  const playMovieBtn = document.getElementById('watch-movie');
  const playTrailerBtn = document.getElementById('watch-treller');

  // Обработчик для кнопки "Play Now"
  if (playMovieBtn) {
    // Убираем старые обработчики
    const newPlayBtn = playMovieBtn.cloneNode(true);
    playMovieBtn.parentNode.replaceChild(newPlayBtn, playMovieBtn);

    newPlayBtn.addEventListener('click', function () {
      if (window.videoLinks && window.videoLinks.trailerUrl) {
        openModalWithVideo(window.videoLinks.trailerUrl);
      } else {
        alert('Трейлер не найден для этого фильма');
      }
    });
  }

  // Обработчик для кнопки "Watch Trailer"
  if (playTrailerBtn) {
    const newTrailerBtn = playTrailerBtn.cloneNode(true);
    playTrailerBtn.parentNode.replaceChild(newTrailerBtn, playTrailerBtn);

    newTrailerBtn.addEventListener('click', function () {
      if (window.videoLinks && window.videoLinks.trailerUrl) {
        openModalWithVideo(window.videoLinks.trailerUrl);
      } else {
        alert('Трейлер не найден для этого фильма');
      }
    });
  }
}

// Первоначальная попытка навесить обработчики
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(attachVideoHandlers, 500);
});