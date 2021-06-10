/* exported data */

var data = {
  drinks: [],
  editIndex: null,
  deleteIndex: null
};

// strDrink: null,
// strInstructions: null,
// strRecipe: null,
// strDrinkThumb: null

var prevData = {
  drinks: []
}

// beforeunload, store existing prevData.drinks to local storage
window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(prevData);
  localStorage.setItem('prevData', dataJSON);
});

// on refresh, get previous data.entries and update current data.entries with it
var dataItems = localStorage.getItem('prevData');
var dataObj = JSON.parse(dataItems);

// set previous prevData data to current prevData object
prevData.drinks = dataObj.drinks;
