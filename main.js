let carouselChildren = document.querySelectorAll('.carousel-objects');
let btn = document.querySelector('button');
let carouselButton = document.querySelectorAll('.dot');
let categoryEl = document.querySelector('.categories-content');
let pagination = document.querySelectorAll('.page');
let apikey = '2da64fa643204522a38df55a18425e21';
let body = document.querySelector('body');
let carouselContainer = document.querySelector('.carousel-container');
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
let info = `https://newsapi.org/v2/everything?`;
let getInput = document.querySelector('input');
let getForm = document.querySelector('.form-search');
let spinnerContainer = document.querySelector('.spinner-container');
let showResult = document.querySelector('.show-result');
let home=document.querySelector('.home')
let btnContainer=document.querySelector('.btns')
spinnerContainer.style.display = 'none';
let categories = ['Sport', 'Entertainment', 'Gaming', 'Lifestyle','Fashion','Education'];
let currentQuery
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

async function generateHash(text) {
  const msgUint8 = new TextEncoder().encode(text); // Encode text (string) as Uint8 array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // Hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
  return hashHex;
}

let clearResults = () => {
  while (getbody.firstChild) {
    getbody.removeChild(getbody.firstChild);
  }
};

home.addEventListener('click',(e)=>{
  currentQuery=e.target.textContent
  getbody.innerHTML=''
  logContent(currentQuery)
  
})
console.log(currentQuery)
getForm.addEventListener('submit', (e) => {
  e.preventDefault();
  getbody.innerHTML=''
  currentQuery=getInput.value
  logContent(currentQuery); 
  console.log(logContent(currentQuery))
  getInput.value = ''; 
  getInput.blur()
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
      currentQuery=categoryText
      logContent(currentQuery); 
      getSpin(true)
    sideToggle()
    });
  });
}
getCategory();

async function getApi(ap) {
  currentQuery=ap
  let api = await fetch(`https://newsapi.org/v2/everything?q=${currentQuery}&apiKey=${apikey}`)
  let response = await api.json()
  console.log(response)
  let data = await Promise.all(response.articles.map(async data => {
  let getHashId = await generateHash(data.title)
    return {
      id: getHashId,
      image:data.urlToImage,
      title: data.title,
      name: data.author,
      content:data.content,
      description:data.description,
      date:timeAgo(data.publishedAt)
    }
  }))
  return data
}

async function logContent(api) {
  currentQuery=api
  let id=window.location.hash.slice(1)
  let openContent = await getApi(currentQuery)
  console.log(openContent)
  let getInside = openContent.map(data => {
    let showContent = `

     <div href='#${data.id}' class="major-holder">
      <div class="img-holder">
        <img src=${data.image} loading='lazy' alt="">
      </div>
      <div class="minor-holder">
     <a class="link" href='#${data.id}' >${data.title}</a>
      <div class="profile">
      <div class="profile-holder">
        <img src="" alt=""></div>
        <div class="mario-holder">
          <p class="mario">${data.name}</p>
          <p class="date"><span><i class="fa-regular fa-calendar ey"></i></span>${data.date}</p>
          <p class="eye"><span><i class="fa-regular fa-eye"></i></span>20k Views</p>
        </div>
      </div>
      </div>
      </div> 
      </div>
    `
    getbody.insertAdjacentHTML('afterbegin', showContent)
    return showContent
  })
  return getInside
}
logContent('category')


async function showNewsPage() {
  btnContainer.style.display='none'
  let getcorrect = window.location.hash.slice(1)
  let hashpoint = await getApi(currentQuery)
  getbody.innerHTML=''
  let geti=hashpoint.find(m=>getcorrect===m.id)
  if(geti){
    let info=`
<div class="pageContainer">
  <div class="news">
    <img src=${geti.image} loading='lazy' alt="">
  </div>
  <h1 class="headline">${geti.title}</h1>
  <div class="residuals">
    <p class="h3">${geti.description}</p>
  <p class="aut">AUTHOR: <span>${geti.name}</span></p>
  <p class="date">${geti.date}</p>
  </div>
  <div class="social-icons">
  <i class="fa-brands fa-facebook-f"></i>
  <i class="fa-brands fa-telegram"></i>
  <i class="fa-brands fa-twitter"></i>
  <i class="fa-brands fa-whatsapp"></i>
  </div>
  <div class="main-content">
  <p>${geti.content}</p>
  </div>
  <div class="news2">
    <img src='' alt="">
  </div>
</div>
    `
   getbody.insertAdjacentHTML('afterbegin',info)
   return info
  }
  console.log(geti)
  return geti
}


window.addEventListener('hashchange',showNewsPage)
