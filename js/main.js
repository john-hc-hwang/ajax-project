var $ = document.querySelector.bind(document);
// var $$ = document.querySelectorAll.bind(document);
var $$$ = document.createElement.bind(document);

var xhr;
var searchResults;
var $divSearch = $(".search");
var $searchButton = $('.fas.fa-glass-martini');
var $userInput = $('.user-input');
var $divSearchResults = $(".search-results");
var $ulSearch = $(".ul-search");

$searchButton.addEventListener('click', function (event) {
  getData($userInput.value);
  for (var i = 0; i < searchResults.length; i++) {
    $ulSearch.append(renderSearch(searchResults[i]));
  }
  $userInput.value = '';
});

// function definitions
function getData(name) {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name);
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    console.log(xhr.status);
    console.log(xhr.response);
    searchResults = xhr.response.drinks;
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
  var $divMediaview = $$$("div");
  $divMediaview.className = "mediaview";

  var $divColHalf = $$$("div");
  $divColHalf.className = "column-half";
  $divMediaview.appendChild($divColHalf);

  var $image = $$$("img");
  $image.setAttribute("src", data.strDrinkThumb);
  $image.setAttribute("alt", data.strDrink);
  $divColHalf.appendChild($image);

  var $divColHalf2 = $$$("div");
  $divColHalf2.className = "column-half";
  $divMediaview.appendChild($divColHalf2);

  var $div = $$$("div");
  $divColHalf2.appendChild($div);

  var $button = $$$("i");
  $button.className = "fas fa-plus-circle float-right";
  $div.appendChild($button);

  var $h1 = $$$("h1");
  $h1.textContent = data.strDrink;
  $div.appendChild($h1);

  var $description = $$$("p");
  $description.textContent = data.strInstructions;
  $div.appendChild($description);

  var $recipe = $$$("p");
  var tempString = '';
  for(var i = 1; i <= 15; i++) {
    var ingredients = "strIngredient" + i;
    var measure = "strMeasure" + i;
    if (data[ingredients] !== null && data[measure] !== null) {
      tempString += data[ingredients] + ' ' + data[measure] + '  ';
    }
  }
  $recipe.textContent = tempString;
  $divColHalf2.appendChild($recipe);

  return $divMediaview;
}
