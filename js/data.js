/* exported data */
/* exported prevData */

const data = {
  drinks: [],
  editIndex: null,
  deleteIndex: null,
  mainPage: true
};

const prevData = {
  drinks: []
};

// beforeunload, store existing prevData.drinks to local storage
window.addEventListener('beforeunload', event => {
  const dataJSON = JSON.stringify(prevData);
  localStorage.setItem('prevData', dataJSON);
});

// on refresh, get previous data.entries and update current data.entries with it
const dataItems = localStorage.getItem('prevData');
const dataObj = JSON.parse(dataItems);

// set previous prevData data to current prevData object
prevData.drinks = dataObj.drinks;
