var $ = document.querySelector.bind(document);
// var $$ = document.querySelectorAll.bind(document);
var $$$ = document.createElement.bind(document);

// global declartion & dom query
var xhr;
var $mainHeading = $('.main-heading');
var $divSearch = $('.search');
var $divSearchResults = $('.search-results');
var $divMyCocktailz = $(".my-cocktailz");

var $form = document.forms[0];
var $divEdit = $(".edit");
var $actionHeading = $(".action-heading");
var $imagePrev = $(".image-prev");
var $pictureURL = $("#picture-url");
var $cocktailName = $("#cocktail-name");
var $cocktailInstr = $("#cocktail-instr");
var $cocktailRecipe = $("#cocktail-recipe");
// var $actionButton = $(".action-button");

var $searchButton = $('.fas.fa-glass-martini');
var $backButtonOne = $(".back-one");
var $backButtonTwo = $(".back-two");
var $forwardButton = $(".fas.fa-arrow-alt-circle-right");
var $notFound = $('.not-found');
var $userLogo = $(".far.fa-user");
var $userInput = $('.user-input');
var $ulSearch = $('.ul-search');
var $ulDrinks = $(".ul-drinks");

// Event Listeners

// show search bar when main heading is clicked
$mainHeading.addEventListener('click', function (event) {
  $divSearchResults.classList.add('hidden');
  $divMyCocktailz.classList.add("hidden");
  $divEdit.classList.add("hidden");
  $divSearch.classList.remove('hidden');
  data.editIndex = null;
});

// show My Cocktailz when user logo is clicked
$userLogo.addEventListener('click', function (event) {
  $divMyCocktailz.classList.remove("hidden");
  $divSearchResults.classList.add('hidden');
  $divEdit.classList.add("hidden");
  $divSearch.classList.add('hidden');
  data.editIndex = null;
});

// return from Search Results to main page
$backButtonOne.addEventListener("click", function (event) {
  $divSearchResults.classList.add('hidden');
  $divMyCocktailz.classList.add("hidden");
  $divSearch.classList.remove('hidden');
});

// return from My Cocktailz to search results
$backButtonTwo.addEventListener("click", function (event) {
  $divMyCocktailz.classList.add("hidden");
  $divSearchResults.classList.remove('hidden');
  $divSearch.classList.add('hidden');
});

// go to My Cocktailz from Search Results
$forwardButton.addEventListener("click", function (event) {
  $divMyCocktailz.classList.remove("hidden");
  $divSearchResults.classList.add('hidden');
  $divSearch.classList.add('hidden');
});

// remove prev search results and show new results
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

// add drink to My Cocktailz feature
$ulSearch.addEventListener("click", function (event) {
  if (event.target.getAttribute('data-entry-id') !== null) {
    for (var i = 0; i < prevData.drinks.length; i++) {
      var firstChild = $ulDrinks.firstElementChild;
      $ulDrinks.removeChild(firstChild);
    }
    var currentDrinkId = event.target.getAttribute("data-entry-id");
    prevData.drinks.unshift(data.drinks[currentDrinkId]); // unshift adds a drink to existing prevData object
    for (var j = 0; j < prevData.drinks.length; j++) {
      $ulDrinks.append(renderShow(prevData.drinks[j], j));
    }

    $divMyCocktailz.classList.remove("hidden");
    $divSearchResults.classList.add("hidden");
  }
});

// var $form = document.forms[0];
// var $divEdit = $(".edit");
// var $actionHeading = $(".action-heading");
// var $imagePrev = $(".image-prev");
// var $pictureURL = $("#picture-url");
// var $cocktailName = $("#cocktail-name");
// var $cocktailInstr = $("#cocktail-instr");
// var $cocktailRecipe = $("#cocktail-recipe");
// var $actionButton = $(".action-button");

// on submit edit drinks in My Cocktailz
$form.addEventListener('submit', function (event) {
  event.preventDefault();
  if (data.editIndex !== null) {
    prevData.drinks[data.editIndex].strDrinkThumb = $pictureURL.value;
    prevData.drinks[data.editIndex].strDrink = $cocktailName.value;
    prevData.drinks[data.editIndex].strInstructions = $cocktailInstr.value;
    prevData.drinks[data.editIndex].recipe = $pictureURL.value;

    for (var i = 0; i < prevData.drinks.length; i++) {
      var firstChild = $ulDrinks.firstElementChild;
      $ulDrinks.removeChild(firstChild);
    }

    for (var j = 0; j < prevData.drinks.length; j++) {
      $ulDrinks.append(renderShow(prevData.drinks[j], j));
    }
  }



  $form.reset();
  $imagePrev.setAttribute('src', 'images/placeholder-image-square.jpg');
  $imagePrev.setAttribute('alt', 'placeholder');
  data.editIndex = null;

  $divEdit.classList.add("hidden");
  $divMyCocktailz.classList.remove("hidden");
});

// Edit, Delete, Rate drinks in My Cocktailz
$ulDrinks.addEventListener("click", function (event) {
  if (event.target.getAttribute('data-entry-id') !== null && event.target.getAttribute("data-entry-id").slice(0, 4) === "edit") {
    data.editIndex = Number(event.target.getAttribute("data-entry-id").slice(4));
    var editIndex = Number(event.target.getAttribute("data-entry-id").slice(4));
    $actionHeading.textContent = "Edit Cocktail";
    $imagePrev.setAttribute("src", prevData.drinks[editIndex].strDrinkThumb);
    $imagePrev.setAttribute("alt", prevData.drinks[editIndex].strDrink);
    $pictureURL.value = prevData.drinks[editIndex].strDrinkThumb;
    $cocktailName.value = prevData.drinks[editIndex].strDrink;
    $cocktailInstr.value = prevData.drinks[editIndex].strInstructions;
    $cocktailRecipe.value = prevData.drinks[editIndex].recipe;

    $divMyCocktailz.classList.add("hidden");
    $divEdit.classList.remove("hidden");
  }
});

$pictureURL.addEventListener('input', function (event) {
  $imagePrev.setAttribute('src', event.target.value);
  if (event.target.value === '') {
    $imagePrev.setAttribute('src', 'images/placeholder-image-square.jpg');
  }
});

// on refresh fill My Cocktailz with prevData
window.addEventListener('DOMContentLoaded', function loadDom(event) {
  for (var i = 0; i < prevData.drinks.length; i++) {
    $ulDrinks.append(renderShow(prevData.drinks[i], i));
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
      tempString += data[ingredients] + ' ' + data[measure] + ' & ';
    }
  }
  tempString = tempString.slice(0, tempString.length - 3);
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

function renderShow(data, id) {
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
  $minusButton.setAttribute("data-entry-id", "delete" + id);
  $div.appendChild($minusButton);

  var $editButton = $$$('i');
  $editButton.className = 'fas fa-pen float-right';
  $editButton.setAttribute("data-entry-id", "edit" + id);
  $div.appendChild($editButton);

  var $h1 = $$$('h1');
  $h1.textContent = data.strDrink;
  $div.appendChild($h1);

  for (var k = 0; k < 5; k++) {
    var $starButton = $$$('i');
    $starButton.className = "far fa-star";
    $starButton.setAttribute("data-entry-id", "star" + id);
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
      tempString += data[ingredients] + ' ' + data[measure] + ' & ';
    }
  }
  tempString = tempString.slice(0, tempString.length - 3);
  $recipe.textContent = tempString;
  data.recipe = tempString;
  $divColHalf2.appendChild($recipe);

  return $divMediaview;
}
