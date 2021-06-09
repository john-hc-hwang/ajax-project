var $ = document.querySelector.bind(document);
// var $$ = document.querySelectorAll.bind(document);
var $$$ = document.createElement.bind(document);

// global declartion & dom query
var xhr;
var $mainHeading = $('.main-heading');
var $divSearch = $('.search');
var $divSearchResults = $('.search-results');
var $divMyCocktailz = $(".my-cocktailz");
var $searchButton = $('.fas.fa-glass-martini');
var $notFound = $('.not-found');
var $userInput = $('.user-input');
var $ulSearch = $('.ul-search');
var $ulDrinks = $(".ul-drinks");

// Event Listeners
$mainHeading.addEventListener('click', function (event) {
  $divSearchResults.classList.add('hidden');
  $divMyCocktailz.classList.add("hidden");
  $divSearch.classList.remove('hidden');
});

$searchButton.addEventListener('click', function (event) {
  $notFound.classList.add('hidden'); // prevents user from seeing not found message
  if (data.drinks !== null) {
    for (var i = 0; i < data.drinks.length; i++) {
      var firstChild = $ulSearch.firstElementChild;
      $ulSearch.removeChild(firstChild);
    }
  }
  getData($userInput.value); // gets data and sets data.drinks to api response
  $userInput.value = '';
  $divSearch.classList.add('hidden');
  $divSearchResults.classList.remove('hidden');
});

$ulSearch.addEventListener("click", function (event) {
  if (event.target.getAttribute('data-entry-id') !== null) {
    var currentDrinkId = event.target.getAttribute("data-entry-id");
    prevData.drinks.unshift(data.drinks[currentDrinkId]); // unshift adds a drink to existing prevData object***
    $ulDrinks.prepend(renderShow(data.drinks[currentDrinkId])); // prepend to show added drink on My Cocktailz

    $divMyCocktailz.classList.remove("hidden");
    $divSearchResults.classList.add("hidden");
  }
});

window.addEventListener('DOMContentLoaded', function loadDom(event) {
  for (var i = 0; i < prevData.drinks.length; i++) {
    $ulDrinks.append(renderShow(prevData.drinks[i]));
  }
});

// function definitions
function getData(name) {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name);
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    data.drinks = xhr.response.drinks;
    if (data.drinks !== null) {
      $notFound.classList.add('hidden');
      for (var i = 0; i < data.drinks.length; i++) {
        $ulSearch.append(renderSearch(data.drinks[i], i));
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

function renderSearch(data, id) {
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
  $button.setAttribute("data-entry-id", id);
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

/* <div class="mediaview">
  <div class="column-half">
    <img src="images/placeholder-image-square.jpg" alt="placeholder">
  </div>
  <div class="column-half">
    <div>
      <i class="fas fa-minus-circle float-right"></i>
      <i class="fas fa-pen float-right"></i>
      <h1>Margarita</h1>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
      <i class="far fa-star"></i>
    </div>
    <p>Description</p>
    <p>Recipe</p>
  </div>
</div> */

function renderShow(data) {
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

  var $minusButton = $$$('i');
  $minusButton.className = 'fas fa-minus-circle float-right';
  // $minustButton.setAttribute("data-entry-id", id);
  $div.appendChild($minusButton);

  var $editButton = $$$('i');
  $editButton.className = 'fas fa-pen float-right';
  $div.appendChild($editButton);

  var $h1 = $$$('h1');
  $h1.textContent = data.strDrink;
  $div.appendChild($h1);

  for (var k = 0; k < 5; k++) {
    var $starButton = $$$('i');
    $starButton.className = "far fa-star";
    $div.appendChild($starButton);
  }

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
