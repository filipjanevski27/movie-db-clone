/*
goto : https://www.themoviedb.org/
signup: https://www.themoviedb.org/signup
verify your email id and then sign in 
on landing page, left click on your profile icon (to the left of the search icon)
    then click on edit profile
In new page, from left side vertical menu, click on API menu option
Under the Request an API Key - click to create. 
Choose Developer option 
Accept Terms and COnditions 
Give a name like - MovieDBDemo
URL: https://localhost:80
give some summary
give your contact information
https://developer.themoviedb.org/docs/
*/

// setup configuration ~ typically will be done in the backend
const APIKey = "25c97c3c0d35cf690fe095069c3d340b";
// console.log(APIKey);
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&query=`;

// get form element from html
const form = document.getElementById("search-form");
// get user search input
const query = document.getElementById("search-input");

// grab the html container where results will be published
const result = document.getElementById("result");

// logic
let page = 1;
let isSearching = false;

// get JSON data from url
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ruhh oh.. something went wrong. check your url...");
    }
    return await response.json();
  } catch (err) {
    return null;
  }
}

// Get and show results based on previous url fetch
async function fetchAndShowResult(url) {
  const data = await fetchData(url);
  if (data && data.results) {
    showResults(data.results);
  }
}

// create dynamic movie display cards - similar to the product cards you all did in assignment
function createMovieCard(movie) {
  // destructuring an obj - access obj property like a variable name without using obj name and dot operator
  // If using JSON data from an API like in this case, make sure to name them exactly the way the API does.
  const { poster_path, original_title, release_date, overview } = movie;

  const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";

  const truncatedTitle =
    original_title.length > 15
      ? original_title.slice(0, 15) + "..."
      : original_title;

  const formattedDate = release_date || "No release date";

  const cardTemplate = `
    <div class="column">
        <div class="card">
            <a class="card-media" href="./img-01.jpeg">
                <img src="${imagePath}" alt="${original_title}" width="100%" />
            </a>
            <div class="card-content">
                <div class="card-header">
                    <div class="left-content">
                        <h3 style="font-weight: 600">${truncatedTitle}</h3>
                        <span style="color: #12efec">${formattedDate}</span>
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

// clear result output for search
function clearResults() {
  result.innerHTML = "";
}

// display results on the page
function showResults(item) {
  const newContent = item.map(createMovieCard).join("");
  result.innerHTML += newContent || "<p> No Results Found. Search again. </p>";
}

// Load more results
async function loadMoreResults() {
  if (isSearching) {
    return;
  }
  page++;
  const searchTerm = query.value;
  const url = searchTerm
    ? `${searchUrl}${searchTerm}&page=${page}`
    : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=${page}`;
  await fetchAndShowResult(url);
}

// detect end of page and load more results
function detectEnd() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    loadMoreResults();
  }
}

// Handle search operation
// input param - event parameter
async function handleSearch(e) {
  console.log("debug inside handleSearch function...");
  // prevent form from resetting when submit is clicked
  e.preventDefault();
  const searchTerm = query.value.trim();
  console.log(`input term by user is ${searchTerm}`);
  if (searchTerm) {
    isSearching = true;
    clearResults();
    const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
    await fetchAndShowResult(newUrl);
    query.value = "";
  }
}

// create event listeners and associate them to the function logic to be executed when detected on the page
// note - while specifying/calling the function here, we do nt include the first brackets.
form.addEventListener("submit", handleSearch);
window.addEventListener("scroll", detectEnd);
window.addEventListener("resize", detectEnd);

// initialize the page
async function init() {
  clearResults();
  const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${APIKey}&page=${page}`;
  isSearching = false;
  await fetchAndShowResult(url);
}

init();
