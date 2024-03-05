//setup config for API
//in a full stack app -- save api keys in a dot env file for more security!
const APIKey = "1ce10f690d0686f50d424eb6f57e6c97";
const imgAPI = "https://image.tmdb.org/t/p/w1280";
const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&query=`;

// connect input forms and child fields from html to js
const form = document.getElementById("search-form");

//for user query
const query = document.getElementById("search-input");

//html element where results needs to be embedded
const result = document.getElementById("result");

//control variables
let page = 1;
let isSearching = false;

//implement logic of various functionalities

//fetch initial data from API on page load
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Movie not found. Please Search again...");
    }
    return await response.json(); //converted to json format (i.e. key value pair for object metadata)
  } catch (err) {
    return null; //create your own error handling logic
  }
}

//show data after fetching it
async function fetchAndShowResult(url) {
  const data = await fetchData(url);
  if (data && data.results) {
    showResults(data.results);
  }
}

//dynamic content generation using JS code
function createMovieCard(movie) {
  //extract different objects from data returned by API
  //for this you need to know metadata of return set from API
  //new concepts - object destructuring in JS
  //syntax of obj property exactly same as provided by API
  const { poster_path, original_title, release_date, overview } = movie;

  const imagePath = poster_path ? imgAPI : "./img-01.jpeg";

  const truncatedTitle =
    original_title.length > 15
      ? original_title.slice(0, 14) + "..."
      : original_title;

  const formattedDate = release_date || "No release date available...";

  //creation of dynamic content in html format
  const cardTemplate = `
        <div class="column">
            <div class="card">
                <a class="card-media" href="./img-01.jpeg"><img src="${imagePath}" alt="${original_title}" width=100% />
                </a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="left-content">
                            <h3 style="font-weight: 600">${truncatedTitle}</h3>
                            <span style="color:#12efec">${formattedDate}</span>
                        </div>
                        <div class="right-content">
                            <a href="${imagePath}" target="_blank" class="card-btn"> See Cover </a>
                        </div>
                    </div>
                    <div class="info">
                        ${overview || "No overview available..."}
                    </div>
                </div>
            </div>
        </div>
    `;

  return cardTemplate;
}

//reset page upon new user search
function clearResults() {
  result.innerHTML = "";
}

//display the dynamic content with movie results
function showResults(item) {
  const newContent = item.map(createMovieCard).join(""); //.join for space between cards
  result.innerHTML += newContent || "<p> No Results Found. Search Again. </p>";
}

//load more results functionality
async function loadMoreResults() {
  if (isSearching) {
    return;
  }
  page++;
  const searchTerm = query.value;
  const url = searchTerm
    ? `${searchURL}${searchTerm}&page=${page}`
    : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=${page}`;

  await fetchAndShowResult(url);
}

//detect the end of the page to load more results
function detectEnd() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight <= scrollHeight - 20) {
    loadMoreResults();
  }
}

//functionality to hand search operations
//input param - event parameter
async function handleSearch(e) {
  const searchTerm = query.value.trim();
  if (searchTerm) {
    isSearching = true;
    clearResults();
    const newURL = `${searchURL}${searchTerm}&page=${page}`;
    await fetchAndShowResult(newURL);
    query.value = "";
  }
}

//create our event listeners
form.addEventListener("submit", handleSearch);
window.addEventListener("scroll", detectEnd);
window.addEventListener("resize", detectEnd);

//main function / to init and call all other pending functions above
async function init() {
  clearResults();
  const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=${page}`;
  isSearching = false;
  await fetchAndShowResult(url);
}

//call init function
init();
