var $ = document.querySelector.bind(document);
// var $$ = document.querySelectorAll.bind(document);

var xhr;
// var searchResults;
var $searchButton = $('.fas.fa-glass-martini');
var $userInput = $('.user-input');

$searchButton.addEventListener('click', function (event) {
  getData($userInput.value);
  $userInput.value = '';
});

// function definitions
function getData(name) {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name);
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    // console.log(xhr.status);
    // console.log(xhr.response);
    // searchResults = xhr.response;
  });
}
