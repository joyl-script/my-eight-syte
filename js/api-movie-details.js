const API_KEY = '863891fb-ee82-445d-98e7-f1911eabc3cc';

function getMovieIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function youTubeEmbedUrl(url) {
  if (!url) return null;

  let match = url.match(/[?&]v=([\w-]{6,})/)
    || url.match(/youtu\.be\/([\w-]{6,})/)
    || url.match(/youtube\.com\/embed\/([\w-]{6,})/)
    || url.match(/youtube\.com\/v\/([\w-]{6,})/);

  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : null;
}

function youTubeSearchUrl(query) {
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'X-API-KEY': API_KEY } });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}

async function loadAllMovieData(movieId) {
  const API_ID_MOVIES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}`;
  const API_ACTER = `https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${movieId}`;
  const API_VIDEO = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/videos`;

  let movieDetails, actorsData, videoData;
  try {
    [movieDetails, actorsData, videoData] = await Promise.all([
      fetchJson(API_ID_MOVIES),
      fetchJson(API_ACTER),
      fetchJson(API_VIDEO),
    ]);
  } catch (error) {
    document.body.innerHTML =
      '<h1 style="text-align:center;margin-top:50px;color:#fff;">Не удалось загрузить данные о фильме</h1>' +
      '<p style="text-align:center;"><a href="main.html">Вернуться к каталогу</a></p>';
    return;
  }

  renderDescription(movieDetails, 'story-container');
  renderActors(actorsData, 'acter-container');
  updateHeaderWithMovie(movieDetails);
  updateHeaderPoster(movieDetails);

  const items = (videoData && videoData.items) || [];
  const youtubeTrailer = items.find(item => item.site === 'YOUTUBE');
  const externalSource = items.find(item => item.site !== 'YOUTUBE' && item.url);

  const title = movieDetails.nameRu || movieDetails.nameEn || '';

  window.videoLinks = {
    trailerEmbed: youTubeEmbedUrl(youtubeTrailer && youtubeTrailer.url),
    trailerSearch: youTubeSearchUrl(`${title} трейлер`),
    watchExternal: externalSource && externalSource.url,
    watchSearch: youTubeSearchUrl(`${title} фильм смотреть онлайн полностью`),
    webUrl: movieDetails.webUrl,
  };
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
  if (!container || !Array.isArray(actors)) return;

  container.innerHTML = `
    <div class="acter-container">
      ${actors.slice(0, 6).map(actor => `
        <div class="acter-details">
          <img src="${actor.posterUrl || 'https://placehold.co/40x70'}" alt="${actor.nameRu || ''}" class="acter__img" width="40" height="70" loading="lazy" decoding="async">
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
  updateHeaderInfo(movie);
}

function updateHeaderPoster(movie) {
  const header = document.querySelector('.header');
  const posterUrl = movie.backgroundImage || movie.coverUrl || movie.posterUrl;
  if (header && posterUrl) {
    header.style.setProperty('--header-poster', `url(${posterUrl})`);
  }
}

const TYPE_NAMES = {
  FILM: 'Фильм',
  TV_SERIES: 'Сериал',
  MINI_SERIES: 'Мини-сериал',
  TV_SHOW: 'ТВ-шоу',
  VIDEO: 'Видео',
};

function updateHeaderInfo(movie) {
  const info = document.querySelector('.info');
  if (!info) return;

  const type = TYPE_NAMES[movie.type] || 'Фильм';
  const year = movie.year ? ` (${movie.year})` : '';
  const rating = movie.ratingKinopoisk ? `⭐ ${Number(movie.ratingKinopoisk).toFixed(1)}` : '';
  const slogan = movie.slogan ? `<p class="info__slogan">${movie.slogan}</p>` : '';
  const genres = (movie.genres || []).map(g => g.genre).slice(0, 3).join(' · ');

  info.innerHTML = `
    <button class="btn-genre">${type}${year}${rating ? ' · ' + rating : ''}</button>
    <h2 class="info__title">${movie.nameRu || movie.nameEn || 'Без названия'}</h2>
    ${slogan}
    <p class="story__desc">${genres}</p>
    <div class="info-button">
      <button id="watch-movie" class="btn-counting btn-big">
        <img src="icons/play.svg" alt="">Смотреть фильм
      </button>
      <button id="watch-treller" class="btn-add btn-big">
        <img src="icons/play.svg" alt="">Смотреть трейлер
      </button>
    </div>
  `;

  attachVideoHandlers();
}

// ========== МОДАЛЬНОЕ ОКНО С ВИДЕО ==========

const modal = document.getElementById('videoModal');
const iframe = document.getElementById('videoIframe');
const closeBtn = document.querySelector('.close-modal');

function openModalWithVideo(embedUrl) {
  iframe.src = embedUrl;
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
  iframe.src = '';
}

if (closeBtn) closeBtn.addEventListener('click', closeModal);

if (modal) {
  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeModal();
  });
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && modal.style.display === 'flex') closeModal();
});

// ========== КНОПКИ ==========

function attachVideoHandlers() {
  const playMovieBtn = document.getElementById('watch-movie');
  const playTrailerBtn = document.getElementById('watch-treller');

  if (playTrailerBtn) {
    playTrailerBtn.addEventListener('click', () => {
      const links = window.videoLinks || {};
      if (links.trailerEmbed) {
        openModalWithVideo(links.trailerEmbed);
      } else {
        window.open(links.trailerSearch, '_blank', 'noopener');
      }
    });
  }

  if (playMovieBtn) {
    playMovieBtn.addEventListener('click', () => {
      const links = window.videoLinks || {};
      if (links.watchExternal) {
        window.open(links.watchExternal, '_blank', 'noopener');
      } else {
        window.open(links.watchSearch, '_blank', 'noopener');
      }
    });
  }
}

const movieId = getMovieIdFromUrl();
if (movieId) {
  loadAllMovieData(movieId);
} else {
  document.body.innerHTML =
    '<h1 style="text-align:center;margin-top:50px;color:#fff;">Ошибка: фильм не выбран</h1>' +
    '<p style="text-align:center;"><a href="main.html">Вернуться к каталогу</a></p>';
}
