/* global data */
/* global prevData */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $$$ = document.createElement.bind(document);

// global declartion & dom query
let xhr;

const $mainHeading = $('.main-heading');
const $divModal = $('.background');
const $divMain = $('.main-page');
const $divTab = $('.tab-container');
const $divSearchResults = $('.search-results');
const $divMyCocktailz = $('.my-cocktailz');

const $form = document.forms[0];
const $divEdit = $('.edit');
const $actionHeading = $('.action-heading');
const $imagePrev = $('.image-prev');
const $pictureURL = $('#picture-url');
const $cocktailName = $('#cocktail-name');
const $cocktailInstr = $('#cocktail-instr');
const $cocktailRecipe = $('#cocktail-recipe');
const $actionButton = $('.action-button');

const $tab = $('.fas.fa-align-justify');
const $searchTab = $('.search-tab');
const $myTab = $('.my-tab');
const $homeTab = $('.home-tab');

const $addButton = $('.add-button');
const $searchButton = $('.fas.fa-glass-martini');
const $backButtonOne = $('.back-one');
const $backButtonTwo = $('.back-two');
const $forwardButton = $('.fas.fa-arrow-alt-circle-right');
const $closeButton = $('.close-button');
const $notFound = $('.not-found');
const $noLoad = $('.no-load');
const $noCocktail = $('.no-cocktail');
const $userLogo = $('.far.fa-user');
const $userInput = $('.user-input');
const $ulSearch = $('.ul-search');
const $ulDrinks = $('.ul-drinks');

const showLists = [$divMain, $divTab, $divEdit, $divMyCocktailz, $divSearchResults];

// Event Listeners below
// open/close tab when clicked
$tab.addEventListener('click', event => {
  if ($divTab.classList.contains('hidden')) {
    $divTab.classList.remove('hidden');
  } else {
    $divTab.classList.add('hidden');
  }
});

$homeTab.addEventListener('click', event => {
  showList($divMain);
  data.mainPage = true;
});

$searchTab.addEventListener('click', event => {
  showList($divSearchResults);
  data.mainPage = false;
});

$myTab.addEventListener('click', event => {
  showList($divMyCocktailz);
  data.mainPage = false;
});

$mainHeading.addEventListener('click', event => {
  showList($divMain);
  data.editIndex = null;
  data.mainPage = true;
});

$userLogo.addEventListener('click', event => {
  showList($divMyCocktailz);
  data.editIndex = null;
  data.mainPage = false;
});

$backButtonOne.addEventListener('click', event => {
  showList($divMain);
  data.mainPage = true;
});

$backButtonTwo.addEventListener('click', event => {
  showList($divSearchResults);
  data.mainPage = false;
});

$forwardButton.addEventListener('click', event => {
  showList($divMyCocktailz);
  data.mainPage = false;
});

// allows users to search by pressing enter on mainPage
window.addEventListener('keydown', event => {
  if (event.key === 'Enter' && data.mainPage) {
    $notFound.classList.add('hidden'); // prevents user from seeing not found message
    if (data.drinks !== null) {
      for (let i = 0; i < data.drinks.length; i++) {
        const firstChild = $ulSearch.firstElementChild;
        $ulSearch.removeChild(firstChild);
      }
    }
    getData($userInput.value); // gets data and sets data.drinks to api response
    $userInput.value = ''; // resets user input
    showList($divSearchResults); // shows appropriate div block
    data.mainPage = false; // changes the state of data.mainPage
  }
});

// remove prev search results and show new results
$searchButton.addEventListener('click', event => {
  $notFound.classList.add('hidden'); // prevents user from seeing not found message
  if (data.drinks !== null) {
    for (let i = 0; i < data.drinks.length; i++) {
      const firstChild = $ulSearch.firstElementChild;
      $ulSearch.removeChild(firstChild);
    }
  }
  getData($userInput.value); // gets data and sets data.drinks to api response
  $userInput.value = '';
  showList($divSearchResults);
  data.mainPage = false;
});

// allows user to add a new cocktail
$addButton.addEventListener('click', event => {
  if (data.editIndex === null) {
    $form.reset();
    $imagePrev.setAttribute('src', 'images/placeholder-image-square.jpg');
    $imagePrev.setAttribute('alt', 'placeholder');
    $actionHeading.textContent = 'New Cocktail';
    $actionButton.textContent = 'Add';
    showList($divEdit);
  }
  data.mainPage = false;
});

$closeButton.addEventListener('click', event => {
  $divModal.classList.add('hidden');
});

// add drink to My Cocktailz feature
$ulSearch.addEventListener('click', event => {
  if (event.target.getAttribute('data-entry-id') !== null) {
    $noCocktail.classList.add('hidden');
    const currentDrinkId = event.target.getAttribute('data-entry-id');

    for (let x = 0; x < prevData.drinks.length; x++) {
      if (data.drinks[currentDrinkId].strDrink === prevData.drinks[x].strDrink) {
        $divModal.classList.remove('hidden');
        return;
      }
    }

    for (let i = 0; i < prevData.drinks.length; i++) {
      const firstChild = $ulDrinks.firstElementChild;
      $ulDrinks.removeChild(firstChild);
    }

    prevData.drinks.unshift(data.drinks[currentDrinkId]); // unshift adds a drink to existing prevData object
    for (let j = 0; j < prevData.drinks.length; j++) {
      $ulDrinks.append(renderShow(prevData.drinks[j], j));
    }
    starCheck();

    showList($divMyCocktailz);
  }
});

// on submit edit drinks in My Cocktailz
$form.addEventListener('submit', event => {
  event.preventDefault();
  if (data.editIndex !== null) {
    prevData.drinks[data.editIndex].strDrinkThumb = $pictureURL.value;
    prevData.drinks[data.editIndex].strDrink = $cocktailName.value;
    prevData.drinks[data.editIndex].strInstructions = $cocktailInstr.value;
    prevData.drinks[data.editIndex].recipe = $cocktailRecipe.value;

    for (let i = 0; i < prevData.drinks.length; i++) {
      const firstChild = $ulDrinks.firstElementChild;
      $ulDrinks.removeChild(firstChild);
    }

    for (let j = 0; j < prevData.drinks.length; j++) {
      $ulDrinks.append(renderShow(prevData.drinks[j], j));
    }
    starCheck();
  } else {
    const tempObj = {};
    tempObj.strDrinkThumb = $pictureURL.value;
    tempObj.strDrink = $cocktailName.value;
    tempObj.strInstructions = $cocktailInstr.value;
    tempObj.recipe = $cocktailRecipe.value;
    prevData.drinks.unshift(tempObj);

    for (let x = 0; x < prevData.drinks.length - 1; x++) {
      const firstChild = $ulDrinks.firstElementChild;
      $ulDrinks.removeChild(firstChild);
    }

    for (let y = 0; y < prevData.drinks.length; y++) {
      $ulDrinks.append(renderShow(prevData.drinks[y], y));
    }

    starCheck();
  }

  $form.reset();
  $imagePrev.setAttribute('src', 'images/placeholder-image-square.jpg');
  $imagePrev.setAttribute('alt', 'placeholder');
  data.editIndex = null;
  showList($divMyCocktailz);
});

// Edit, Delete, Rate drinks in My Cocktailz
$ulDrinks.addEventListener('click', event => {
  if (event.target.getAttribute('data-entry-id') !== null && event.target.getAttribute('data-entry-id').slice(0, 4) === 'edit') {
    data.editIndex = Number(event.target.getAttribute('data-entry-id').slice(4));
    $actionHeading.textContent = 'Edit Cocktail';
    $actionButton.textContent = 'Save Changes';
    $imagePrev.setAttribute('src', prevData.drinks[data.editIndex].strDrinkThumb);
    $imagePrev.setAttribute('alt', prevData.drinks[data.editIndex].strDrink);
    $pictureURL.value = prevData.drinks[data.editIndex].strDrinkThumb;
    $cocktailName.value = prevData.drinks[data.editIndex].strDrink;
    $cocktailInstr.value = prevData.drinks[data.editIndex].strInstructions;
    $cocktailRecipe.value = prevData.drinks[data.editIndex].recipe;

    showList($divEdit);
  }

  if (event.target.getAttribute('data-entry-id') !== null && event.target.getAttribute('data-entry-id').slice(0, 6) === 'delete') {
    data.deleteIndex = Number(event.target.getAttribute('data-entry-id').slice(6));
    prevData.drinks.splice(data.deleteIndex, 1);

    for (let i = 0; i < prevData.drinks.length + 1; i++) {
      const firstChild = $ulDrinks.firstElementChild;
      $ulDrinks.removeChild(firstChild);
    }

    for (let j = 0; j < prevData.drinks.length; j++) {
      $ulDrinks.append(renderShow(prevData.drinks[j], j));
    }
    starCheck();

    if (prevData.drinks.length === 0) {
      $noCocktail.classList.remove('hidden');
    }
  }

  if (event.target.getAttribute('data-entry-id') !== null && event.target.getAttribute('data-entry-id').slice(0, 4) === 'star') {
    let check = true;
    let howManyChecked = 0;
    let colorCheck = 0;
    const starPos = event.target.getAttribute('data-entry-id');
    const starSelector = "i[data-entry-id='" + starPos + "']";
    const starIndex = event.target.getAttribute('star-index');
    prevData.drinks[starPos[4]].starIndex = starIndex;

    const $$stars = $$(starSelector);
    for (let z = 0; z < 5; z++) {
      if ($$stars[z].classList.contains('fas')) howManyChecked++;
    }

    for (let k = 0; k < 5; k++) {
      if ($$stars[k].getAttribute('star-index') === starIndex && $$stars[starIndex].classList.contains('far')) {
        for (let x = 0; x <= starIndex; x++) {
          $$stars[x].classList.replace('far', 'fas');
          colorCheck++;
        }
        prevData.drinks[starPos[4]].starActive = true;
        check = false;
      }
      if (check) {
        if ($$stars[k].getAttribute('star-index') === starIndex && $$stars[starIndex].classList.contains('fas')) {
          for (let y = 0; y <= starIndex; y++) {
            $$stars[y].className = 'far fa-star';
          }
          prevData.drinks[starPos[4]].starActive = false;
        }
      }
    }
    // final check to appropriately rates star for UX
    if (Number(starIndex) + 1 < howManyChecked) {
      for (let a = 0; a < 5; a++) {
        $$stars[a].className = 'far fa-star';
      }

      for (let b = 0; b <= starIndex; b++) {
        $$stars[b].classList.replace('far', 'fas');
        colorCheck++;
      }
      prevData.drinks[starPos[4]].starActive = true;
    }

    // give stars colors depending on how many
    const colors = ['red', 'orange', 'yellow', 'green', 'torq'];

    for (let colorIndex = 0; colorIndex < colorCheck; colorIndex++) {
      $$stars[colorIndex].classList.add(colors[colorIndex]);
    }
  }
});

// allows users to see the preview of the image
$pictureURL.addEventListener('input', event => {
  $imagePrev.setAttribute('src', event.target.value);
  if (event.target.value === '') {
    $imagePrev.setAttribute('src', 'images/placeholder-image-square.jpg');
  }
});

// on refresh fill My Cocktailz with prevData
window.addEventListener('DOMContentLoaded', event => {
  if (prevData.drinks.length === 0) {
    $noCocktail.classList.remove('hidden');
  } else {
    $noCocktail.classList.add('hidden');
    for (let i = 0; i < prevData.drinks.length; i++) {
      $ulDrinks.append(renderShow(prevData.drinks[i], i));
    }
    starCheck();
  }
});

// function definitions
const getData = name => {
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + name);
  xhr.responseType = 'json';
  xhr.send();

  // initialize data failed to laod as hidden
  $noLoad.classList.add('hidden');
  xhr.addEventListener('error', () => {
    $noLoad.classList.remove('hidden');
  });

  xhr.addEventListener('load', () => {
    data.drinks = xhr.response.drinks;
    if (data.drinks !== null) {
      $notFound.classList.add('hidden');
      for (let i = 0; i < data.drinks.length; i++) {
        $ulSearch.append(renderSearch(data.drinks[i], i));
      }
    } else {
      $notFound.classList.remove('hidden');
    }
  });
};

// show and hide targeted divs appropriately
const showList = target => {
  for (const div of showLists) {
    if (div === target) {
      target.classList.remove('hidden');
    } else {
      div.classList.add('hidden');
    }
  }
};

const starCheck = () => {
  for (let p = 0; p < prevData.drinks.length; p++) {
    if (prevData.drinks[p].starIndex !== undefined && prevData.drinks[p].starActive) {
      let colorCheck = 0;
      const starSelector = "i[data-entry-id='" + 'star' + p + "']";
      const starIndex = prevData.drinks[p].starIndex;
      const $$stars = $$(starSelector);

      for (let q = 0; q <= starIndex; q++) {
        $$stars[q].classList.replace('far', 'fas');
        colorCheck++;
      }

      const colors = ['red', 'orange', 'yellow', 'green', 'torq'];

      for (let colorIndex = 0; colorIndex < colorCheck; colorIndex++) {
        $$stars[colorIndex].classList.add(colors[colorIndex]);
      }
    }
  }
};

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

// return DOM for search results
const renderSearch = (data, id) => {
  const $divMediaview = $$$('div');
  $divMediaview.className = 'mediaview';

  const $divColHalf = $$$('div');
  $divColHalf.className = 'column-half';
  $divMediaview.appendChild($divColHalf);

  const $image = $$$('img');
  $image.setAttribute('src', data.strDrinkThumb);
  $image.setAttribute('alt', data.strDrink);
  $divColHalf.appendChild($image);

  const $divColHalf2 = $$$('div');
  $divColHalf2.className = 'column-half';
  $divMediaview.appendChild($divColHalf2);

  const $div = $$$('div');
  $divColHalf2.appendChild($div);

  const $button = $$$('i');
  $button.className = 'fas fa-plus-circle float-right';
  $button.setAttribute('data-entry-id', id);
  $div.appendChild($button);

  const $h1 = $$$('h1');
  $h1.textContent = data.strDrink;
  $div.appendChild($h1);

  const $description = $$$('p');
  $description.textContent = data.strInstructions;
  $div.appendChild($description);

  const $recipe = $$$('p');
  let tempString = '';
  for (let i = 1; i <= 15; i++) {
    const ingredients = 'strIngredient' + i;
    const measure = 'strMeasure' + i;
    if (data[ingredients] !== null && data[measure] !== null) {
      tempString += data[ingredients] + ' ' + data[measure] + ' & ';
    }
  }
  tempString = tempString.slice(0, tempString.length - 3);
  $recipe.textContent = tempString;
  $divColHalf2.appendChild($recipe);

  return $divMediaview;
};

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

// return DOM for cocktails added from search results
const renderShow = (data, id) => {
  const $divMediaview = $$$('div');
  $divMediaview.className = 'mediaview';

  const $divColHalf = $$$('div');
  $divColHalf.className = 'column-half';
  $divMediaview.appendChild($divColHalf);

  const $image = $$$('img');
  $image.setAttribute('src', data.strDrinkThumb);
  $image.setAttribute('alt', data.strDrink);
  $divColHalf.appendChild($image);

  const $divColHalf2 = $$$('div');
  $divColHalf2.className = 'column-half';
  $divMediaview.appendChild($divColHalf2);

  const $div = $$$('div');
  $divColHalf2.appendChild($div);

  const $minusButton = $$$('i');
  $minusButton.className = 'fas fa-minus-circle float-right';
  $minusButton.setAttribute('data-entry-id', 'delete' + id);
  $div.appendChild($minusButton);

  const $editButton = $$$('i');
  $editButton.className = 'fas fa-pen float-right';
  $editButton.setAttribute('data-entry-id', 'edit' + id);
  $div.appendChild($editButton);

  const $h1 = $$$('h1');
  $h1.textContent = data.strDrink;
  $div.appendChild($h1);

  for (let k = 0; k < 5; k++) {
    const $starButton = $$$('i');
    $starButton.className = 'far fa-star';
    $starButton.setAttribute('data-entry-id', 'star' + id);
    $starButton.setAttribute('star-index', k);
    $div.appendChild($starButton);
  }

  const $description = $$$('p');
  $description.textContent = data.strInstructions;
  $div.appendChild($description);

  const $recipe = $$$('p');
  let tempString = '';
  for (let i = 1; i <= 15; i++) {
    const ingredients = 'strIngredient' + i;
    const measure = 'strMeasure' + i;
    if (data[ingredients] !== null && data[measure] !== null && data[ingredients] !== undefined && data[measure] !== undefined) {
      tempString += data[ingredients] + ' ' + data[measure] + ' & ';
    }
  }
  tempString = tempString.slice(0, tempString.length - 3);
  if (tempString === '') {
    $recipe.textContent = data.recipe;
  } else {
    data.recipe = tempString;
    $recipe.textContent = data.recipe;
  }
  $divColHalf2.appendChild($recipe);

  return $divMediaview;
};
