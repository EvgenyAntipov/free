const searchForm = document.querySelector('#search_form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
  event.preventDefault();
  const searchText = document.querySelector('.form-control').value;
  if (searchText.trim().length === 0) {
    movie.innerHTML =
      '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</div>';
    return;
  }
  const server =
    'https://api.themoviedb.org/3/search/multi?api_key=5767f8da32bfcf958116329df81f56e5&language=ru&query=' +
    searchText;
  movie.innerHTML = '<div class="spinner"></div>';

  fetch(server)
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error('Error'));
      }
      return value.json();
    })
    .then(function(output) {
      let inner = '';
      if (output.results.length === 0) {
        inner =
          '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</div>';
      }

      output.results.forEach(function(item) {
        let nameItem = item.name || item.title;
        const poster = item.poster_path
          ? urlPoster + item.poster_path
          : './img/noposter.png';
        let dataInfo = '';
        if (item.media_type !== 'person')
          dataInfo = `data-id="${item.id}" data-type ="${item.media_type}"`;
        inner += `
            <div class="col-12 col-md6 col-xl-3 item">
            <img src="${poster}" class ="img_poster" alt="${nameItem}" ${dataInfo}>
            <h5>${nameItem}</h5>
            </div>
        `;
      });
      movie.innerHTML = inner;

      addEventMedia();
    })
    .catch(function(reason) {
      movie.innerHTML = 'УПС что то пошло не так!';
      console.error(reason || reason.status);
      return;
    });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
  const media = movie.querySelectorAll('img[data-id]');

  media.forEach(function(elem) {
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', showFullInfo);
  });
}

function showFullInfo() {
  console.log('dataset:', this.dataset);
  console.log('ТВОЙ СТАРЫЙ ЗЫССССС:', this);
  console.log(this.dataset.id);
  let url = '';
  if (this.dataset.type === 'movie') {
    url =
      'https://api.themoviedb.org/3/movie/' +
      this.dataset.id +
      '?api_key=5767f8da32bfcf958116329df81f56e5&language=ru';
  } else if (this.dataset.type === 'tv') {
    url =
      'https://api.themoviedb.org/3/tv/' +
      this.dataset.id +
      '?api_key=5767f8da32bfcf958116329df81f56e5&language=ru';
  } else {
    inner = '<h2 class="col-12 text-center text-info">Произошла ошибка</div>';
  }
  fetch(url)
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error('Error'));
      }
      return value.json();
    })
    .then(function(output) {
      console.log(output);
      movie.innerHTML = `
        <h4 class="col-12 text-center text-info">${output.name ||
          output.title}</h4>
        <div class "col-4">
            <img src="${urlPoster +
              output.poster_path}" class ="img_poster" alt ="${output.name ||
        output.title}">
            ${
              output.homepage
                ? `<p class='text-center'> <a href="${output.homepage}" target="blank">Оффициальная страница</a></p> `
                : ''
            }
             ${
               output.imdb_id
                 ? `<p class='text-center'> <a href="https://imdb.com/title/${output.imdb_id}" target="blank">IMDB страница</a></p> `
                 : ''
             }
            </div>
        <div class "col-8">
            <p> Рэйтинг:${output.vote_average} </p>
            <p> Статус:${output.status} </p>
            <p> Премьера:${output.first_air_date || output.release_date} </p>
            ${
              output.last_episode_to_air
                ? `<p>${output.number_of_seasons} сезон 
            ${output.last_episode_to_air.episode_number} серий вышло</p>`
                : ''
            }

        <p> Описание: ${output.overview}</p>

        <br>
        <div class='youtube'></div>
        </div>
        
       
        
        `;
      console.log('ТВОЙ НОВЫЙ ЗЫССССС:', this);
      getVideo(this.dataset.type, this.dataset.id);
    })

    .catch(function(reason) {
      movie.innerHTML = 'УПС что то пошло не так!';
      console.error(reason || reason.status);
      return;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  fetch(
    'https://api.themoviedb.org/3/trending/all/day?api_key=5767f8da32bfcf958116329df81f56e5&language=ru'
  )
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error('Error'));
      }
      return value.json();
    })
    .then(function(output) {
      let inner =
        '<h2 class="col-12 text-center text-info">Популярное за неделю</div>';
      if (output.results.length === 0) {
        inner =
          '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</div>';
      }

      output.results.forEach(function(item) {
        let nameItem = item.name || item.title;
        let mediaType = item.title ? 'movie' : 'tv';
        const poster = item.poster_path
          ? urlPoster + item.poster_path
          : './img/noposter.png';
        let dataInfo = `data-id="${item.id}" data-type ="${mediaType}"`;
        inner += `
        <div class="col-12 col-md6 col-xl-3 item">
            <img src="${poster}" class ="img_poster" alt="${nameItem}" ${dataInfo}>
            <h5>${nameItem}</h5>
            </div>
        `;
      });
      movie.innerHTML = inner;

      addEventMedia();
    })
    .catch(function(reason) {
      movie.innerHTML = 'УПС что то пошло не так!';
      console.log('error' + reason.status);
      return;
    });
});

function getVideo(type, id) {
  let youtube = document.querySelector('.youtube');
  youtube.innerHTML = type;
}
