var $ = document.querySelector.bind(document);
// var $$ = document.querySelectorAll.bind(document);
var $$$ = document.createElement.bind(document);

// global declartion & dom query
var xhr;
var searchResults = [];
var $mainHeading = $('.main-heading');
var $divSearch = $('.search');
var $divSearchResults = $('.search-results');
var $searchButton = $('.fas.fa-glass-martini');
var $notFound = $('.not-found');
var $userInput = $('.user-input');
var $ulSearch = $('.ul-search');

// Event Listeners
$mainHeading.addEventListener('click', function (event) {
  $divSearchResults.classList.add('hidden');
  $divSearch.classList.remove('hidden');
});

$searchButton.addEventListener('click', function (event) {
  $notFound.classList.add('hidden'); // prevents user from seeing not found message
  if (searchResults !== null) {
    for (var i = 0; i < searchResults.length; i++) {
      var firstChild = $ulSearch.firstElementChild;
      $ulSearch.removeChild(firstChild);
    }
  }
  getData($userInput.value);
  $userInput.value = '';
  $divSearch.classList.add('hidden');
  $divSearchResults.classList.remove('hidden');
});

// function definitions
function getData(name) {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name);
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    searchResults = xhr.response.drinks;
    if (searchResults !== null) {
      $notFound.classList.add('hidden');
      for (var i = 0; i < searchResults.length; i++) {
        $ulSearch.append(renderSearch(searchResults[i]));
      }
    } else {
      $notFound.classList.remove('hidden');
    }
  });
}

/* <div class="mediaview">
  <div class="column-half">
    <img src="images/placeholder-image-square.jpg" alt="placeholder">
  </div>
  <div class="column-half">
    <div>
      <i class="fas fa-plus-circle float-right"></i>
      <h1>Margarita</h1>
    </div>
    <p>Description</p>
    <p>Recipe</p>
  </div>
</div> */

function renderSearch(data) {
  var $divMediaview = $$$('div');
  $divMediaview.className = 'mediaview';

  var $divColHalf = $$$('div');
  $divColHalf.className = 'column-half';
  $divMediaview.appendChild($divColHalf);

  var $image = $$$('img');
  $image.setAttribute('src', data.strDrinkThumb);
  $image.setAttribute('alt', data.strDrink);
  $divColHalf.appendChild($image);

  var $divColHalf2 = $$$('div');
  $divColHalf2.className = 'column-half';
  $divMediaview.appendChild($divColHalf2);

  var $div = $$$('div');
  $divColHalf2.appendChild($div);

  var $button = $$$('i');
  $button.className = 'fas fa-plus-circle float-right';
  $div.appendChild($button);

  var $h1 = $$$('h1');
  $h1.textContent = data.strDrink;
  $div.appendChild($h1);

  var $description = $$$('p');
  $description.textContent = data.strInstructions;
  $div.appendChild($description);

  var $recipe = $$$('p');
  var tempString = '';
  for (var i = 1; i <= 15; i++) {
    var ingredients = 'strIngredient' + i;
    var measure = 'strMeasure' + i;
    if (data[ingredients] !== null && data[measure] !== null) {
      tempString += data[ingredients] + ' ' + data[measure] + '  ';
    }
  }
  $recipe.textContent = tempString;
  $divColHalf2.appendChild($recipe);

  return $divMediaview;
}
