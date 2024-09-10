let carouselChildren = document.querySelectorAll('.carousel-objects');
let bu = document.querySelector('button');
let caroButton = document.querySelectorAll('.dot');
let current = 0;
let categoryEl = document.querySelector('.categories-content');
let pagination = document.querySelectorAll('.page');
let key = '8ff224c128214e4c8434aa50bec96d4c';
let body = document.querySelector('body');
let carouselCon = document.querySelector('.carousel-container');
let max = carouselChildren.length;
let over = document.querySelector('.over');
let open = document.querySelector('.cate');
let firstArrow = document.querySelector('.ko');
let secondArrow = document.querySelector('.ko-two');
let second = document.querySelector('.second');
let cnt = document.querySelector('.categories-content');
let blog = document.querySelector('.blog');
let barToggle = document.querySelector('.bar-container');
let sideBar = document.querySelector('.sidebar');
let getbody = document.querySelector('.content-holder');
let nfo = `https://newsapi.org/v2/everything?`;
let getInput = document.querySelector('input');
let getForm = document.querySelector('.form-search');
let spinnerContainer = document.querySelector('.spinner-container');
let showResult = document.querySelector('.show-result');
let start = 0;
let end = 4;
let itemsPerPage = 8;
let spin = false;
spinnerContainer.style.display = '';

let categories = ['Sport', 'Entertainment', 'Gaming', 'Lifestyle','Fashion','Education'];

let currentSearchQuery = '';
let currentPage = 0;

carouselChildren.forEach((tracker, index) => {
  tracker.style.transform = `translateX(${index * 100}%)`;
});

let period = function() {
  current = current !== max - 1 ? current + 1 : 0;
  updateSlides();
  updateButtonStyles();
};
setInterval(period, 6000);

let startX = 0;
let endX = 0;

open.style.fontWeight = 'bold';
open.addEventListener('click', function() {
  cnt.classList.toggle('wrap');
  firstArrow.classList.toggle('rot');
  second.classList.remove('wrap');
  secondArrow.classList.remove('rot');
});

blog.addEventListener('click', function() {
  second.classList.toggle('wrap');
  cnt.classList.remove('wrap');
  firstArrow.classList.remove('rot');
  secondArrow.classList.toggle('rot');
});

barToggle.addEventListener('click', function() {
  sideBar.style.right = '0';
  over.classList.add('ov');
  body.classList.add('stop');
})


over.addEventListener('click', sideToggle);
function sideToggle(){
sideBar.style.right = '-75%';
over.classList.remove('ov');
body.classList.remove('stop');
}
sideToggle()

/* set time to string */
function timeAgo(dateString) {
  const secs = Math.floor((new Date() - new Date(dateString)) / 1000);
  const units = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second']
  ];
  for (let [s, u] of units) {
    if (Math.floor(secs / s)) {
      return `${Math.floor(secs / s)} ${u}${Math.floor(secs / s) > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

function getSpin(spin) {
  if (spin) {
    spinnerContainer.style.display = 'none';
  } else {
    spinnerContainer.style.display = 'block';
  }
}

let info = async (api) => {
  let first = await fetch(`https://newsapi.org/v2/everything?q=${api}&apikey=${key}`);
  let response = await first.json();
  console.log(response)
  let seeResponse = response.articles.filter(data => data.author && data.urlToImage);
  let final = seeResponse.map(data => {
    getSpin(true)
    return {
      author: data.author,
      title: data.title,
      image: data.urlToImage,
      time: new Date(data.publishedAt),
      url:data.url
    };
  });
  return final;
};

let fetchAndDisplayResults = async (query, page) => {
  currentSearchQuery = query; 
  currentPage = page;         
  clearResults(); 

  let forward = await info(query);  
  let paginatedResults = forward.slice(page * itemsPerPage, (page + 1) * itemsPerPage); 
  
  paginatedResults.forEach(m => {
    console.log(m)
    let bodyContent = `
  
      <div href class="major-holder">
        <div class="img-holder">
          <img loading='lazy' src=${m.image} alt="">
        </div>
        <div class="minor-holder">
        <div class='title-holder'>
       <a class="link" href=${m.url} target="_blank">${m.title}</a>
        </div>
        <div class="profile">
        <div class="profile-holder">
          <img src='' alt=""></div>
          <div class="mario-holder">
            <p class="mario">${m.author}</p>
            <p class="date"><span><i class="fa-regular fa-calendar ey"></i></span>${timeAgo(m.time)}</p>
            <p class="eye"><span><i class="fa-regular fa-eye"></i></span>20k Views</p>
          </div>
        </div>
        </div>
        </div>
        
    `;

    getbody.insertAdjacentHTML('afterbegin', bodyContent);
  });

  showResult.textContent = `Showing ${paginatedResults.map(m=>m.length)} results for '${query.toUpperCase()}'`;


  paginationBtnStyle(page);
};

let secondInfo = async (h) => {
  start = 0;
  end = itemsPerPage;
  while (getbody.firstChild) {
    getbody.removeChild(getbody.firstChild);
  }
  await fetchAndDisplayResults(h, 0); 
};

let clearResults = () => {
  while (getbody.firstChild) {
    getbody.removeChild(getbody.firstChild);
  }
};

let paginationBtnStyle = (pageIndex) => {
  pagination.forEach((btn, index) => {
    if (index === pageIndex) {
      btn.style.cssText = 'color:white;background-color:red'; 
    } else {
      btn.style.cssText = 'color:black;background-color:white'; 
    }
  });
};

getForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchAndDisplayResults(getInput.value, 0); 
  getInput.value = ''; 
  carouselCon.style.display = 'none'; 
});

pagination.forEach((button, index) => {
  button.value = index;
  button.addEventListener('click', (e) => {
    let page = +e.target.value; 
    fetchAndDisplayResults(currentSearchQuery, page);
    page*1
  });
});

function getCategory() {
  categories.map((category) => {
    let categoryContent = `
      <div class='category-item'>
        <p>${category}</p>
      </div>
    `;

    categoryEl.insertAdjacentHTML('afterbegin', categoryContent);
  });

  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function(e) {
      let categoryText = e.target.textContent.trim(); 
      secondInfo(categoryText); 
      getSpin(false)
    sideToggle()
    });
  });
}

getCategory();

window.addEventListener('load', () => {
  let hash = window.location.hash.substring(1); 
  secondInfo('trending'); 
});
