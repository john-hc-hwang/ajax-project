/* global data */
/* exported data */

var $title = document.querySelector('#title'); // title input
var $photoUrl = document.querySelector('#photoUrl'); // photo url input
var $notes = document.querySelector('#notes'); // description input
var $img = document.querySelector('.imgPreview'); // img placeholder
var $hiddenEntry = document.querySelector('.entry.hidden'); // entry hidden
var $noEntry = document.querySelector('.noEntry.hidden'); // no entry notification hidden
var $editEntry = document.querySelector('.edit.hidden'); // edit entry header hidden
var $deleteEntry = document.querySelector('.deleteEntry.hidden'); // delete entry hidden
var $new = document.querySelector('.new'); // new entry header

// Keeps track of EntryId to use it to delete/splice the data where we want to
// that is [data.entries.length - Number(currentEntryId)] since we go in reverse chrono order
// Needs to reset to undefined after confirming delete, clicking navEntries, submitting form.
var currentEntryId;

// set img preview to desired picture
// if no input, placeholder is shown on img preview
$photoUrl.addEventListener('input', function (event) {
  $img.setAttribute('src', event.target.value);
  if (event.target.value === '') {
    $img.setAttribute('src', 'images/placeholder-image-square.jpg');
  }
});

// on submit, check to see if we are editing or adding new entries
// if edit, replace data.entries appropriately, remove all child of ul, render all updated data.entries
// if new, prepend one data entry to existing entries
// reset appropriately
var $form = document.forms[0];
$form.addEventListener('submit', function (event) {
  event.preventDefault();
  $noEntry.className = 'noEntry hidden';

  if (data.editing !== null) {
    data.entries[data.entries.length - data.editing.entryId].title = $title.value;
    data.entries[data.entries.length - data.editing.entryId].photoUrl = $photoUrl.value;
    data.entries[data.entries.length - data.editing.entryId].notes = $notes.value;
    data.entries[data.entries.length - data.editing.entryId].entryId = data.editing.entryId;

    for (var i = 0; i < data.entries.length; i++) {
      var firstChild = $ul.firstElementChild;
      $ul.removeChild(firstChild);
    }

    for (var j = 0; j < data.entries.length; j++) {
      $ul.appendChild(render(data.entries[j]));
    }
  } else {
    var newObj = {};

    newObj.title = $title.value;
    newObj.photoUrl = $photoUrl.value;
    newObj.notes = $notes.value;
    newObj.entryId = data.nextEntryId;
    data.nextEntryId++;

    data.entries.unshift(newObj);

    $ul.prepend(render(newObj));
  }
  data.editing = null;
  $form.reset();
  $img.setAttribute('src', 'images/placeholder-image-square.jpg');
  $img.setAttribute('alt', 'image placeholder');

  $form.className = 'hidden';
  $hiddenEntry.removeAttribute('class');
  currentEntryId = undefined;
});

// beforeunload, store existing data.entries to local storage
window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data', dataJSON);
});

// on refresh, get previous data.entries and update current data.entries with it
var dataItems = localStorage.getItem('data');
var dataObj = JSON.parse(dataItems);

data.view = dataObj.view;
data.entries = dataObj.entries;
data.editing = dataObj.editing;
data.nextEntryId = dataObj.nextEntryId;
data.editing = null;

/* <div class="row">
  <div class="container">
    <div class="mediaview">
      <div class="column-half">
        <div class="img-container">
          <img src="http://justice4cecil.weebly.com/uploads/5/2/3/3/52333429/2377089_orig.png"
            alt="image placeholder">
        </div>
      </div>
      <div class="column-half">
        <div class="flex">
          <p class="entryTitle">Monke</p>
          <div class="column-full flex end edit-container">
            <div>
              <img src="images/edit.PNG" alt="edit icon">
            </div>
          </div>
        </div>
        <p class="entryNotes">Monkey with AK47 Monkey with AK47 Monkey with AK47 Monkey with AK47
        Monkey with AK47 Monkey with AK47 </p>
      </div>
    </div>
  </div>
</div> */

// on refresh, show noEntry if there are no data.entries
// on refresh, render all data.entries
window.addEventListener('DOMContentLoaded', loadDom);

function loadDom(event) {
  if (data.entries.length === 0) {
    $noEntry.className = 'noEntry';
    return;
  }
  for (var i = 0; i < data.entries.length; i++) {
    $ul.appendChild(render(data.entries[i]));
  }
}

// when edit button is clicked, update currentEntryId, show and hide content appropriately
// use for loop to find out which edit button was clicked and update data.editing to our current entry obj
// prefill title, photo url, description, img preview
var $ul = document.querySelector('ul');
$ul.addEventListener('click', function (event) {
  if (event.target.getAttribute('data-entry-id') !== null) {
    currentEntryId = event.target.getAttribute('data-entry-id');
    $form.removeAttribute('class');
    $hiddenEntry.className = 'hidden';
    $new.className = 'new hidden';
    $editEntry.className = 'edit';
    $deleteEntry.className = 'deleteEntry';

    for (var i = 0; i < data.entries.length; i++) {
      if (event.target.getAttribute('data-entry-id') === data.entries[i].entryId.toString()) {
        data.editing = data.entries[i];
      }
    }

    $title.value = data.editing.title;
    $photoUrl.value = data.editing.photoUrl;
    $notes.value = data.editing.notes;
    $img.setAttribute('src', $photoUrl.value);
    $img.setAttribute('alt', $title.value);
  }
});

// when clicked, hide form, show entries
// set data.editing to null and currentEntryId to undefined (their initial state)
var $navEntries = document.querySelector('.entries');
$navEntries.addEventListener('click', function (event) {
  $form.className = 'hidden';
  $hiddenEntry.removeAttribute('class');
  data.editing = null;
  currentEntryId = undefined;
});

// when new entry is clicked, show form and hide the rest of the content
var $newEntry = document.querySelector('.newEntry');
$newEntry.addEventListener('click', function (event) {
  $form.removeAttribute('class');
  $hiddenEntry.className = 'hidden';
  $new.className = 'new';
  $editEntry.className = 'edit hidden';
  $deleteEntry.className = 'deleteEntry hidden';
  $form.reset();
  $img.setAttribute('src', 'images/placeholder-image-square.jpg');
  $img.setAttribute('alt', 'image placeholder');
  data.editing = null;
});

// when delete button is clicked, show background (confirmation modal)
var $background = document.querySelector('.background.hidden');
$deleteEntry.addEventListener('click', function (event) {
  $background.className = 'background';
});

// when cancel button is clicked on modal, hide background (confirmation modal)
var $cancelButton = document.querySelector('.cancelButton');
$cancelButton.addEventListener('click', function (evnet) {
  $background.className = 'background hidden';
});

// when confirm button is clicked on modal, hide background (confirmation modal)
// remove all child of ul, delete desired data entry and update data.entries, render all
// hide and show appropriate content and check if there are any entries
var $confirmButton = document.querySelector('.confirmButton');
$confirmButton.addEventListener('click', function (event) {
  $background.className = 'background hidden';
  for (var i = 0; i < data.entries.length; i++) {
    var firstChild = $ul.firstElementChild;
    $ul.removeChild(firstChild);
  }

  data.entries.splice(data.entries.length - Number(currentEntryId), 1);
  data.nextEntryId--;
  for (var j = 0; j < data.entries.length; j++) {
    $ul.appendChild(render(data.entries[j]));
  }

  $form.className = 'hidden';
  $hiddenEntry.removeAttribute('class');
  currentEntryId = undefined;

  if (data.entries.length === 0) {
    $noEntry.className = 'noEntry';
  }
});

// Dom tree creation for new entry and return DOM Tree
function render(entry) {
  var $row = document.createElement('div');
  $row.className = 'row';

  var $container = document.createElement('div');
  $container.className = 'container';

  $row.appendChild($container);

  var $mediaview = document.createElement('div');
  $mediaview.className = 'mediaview';

  $container.appendChild($mediaview);

  var $colhalf = document.createElement('div');
  $colhalf.className = 'column-half';

  $mediaview.appendChild($colhalf);

  var $imgContainer = document.createElement('div');
  $imgContainer.className = 'img-container';

  $colhalf.appendChild($imgContainer);

  var $image = document.createElement('img');
  $image.setAttribute('src', entry.photoUrl);
  $image.setAttribute('alt', entry.title);

  $imgContainer.appendChild($image);

  var $colhalf2 = document.createElement('div');
  $colhalf2.className = 'column-half';

  $mediaview.appendChild($colhalf2);

  var $divflex = document.createElement('div');
  $divflex.className = 'flex';

  $colhalf2.appendChild($divflex);

  var $entryTitle = document.createElement('p');
  $entryTitle.className = 'entryTitle';
  $entryTitle.textContent = entry.title;

  $divflex.appendChild($entryTitle);

  var $editContainer = document.createElement('div');
  $editContainer.className = 'column-full flex end edit-container';
  $divflex.appendChild($editContainer);

  var $div = document.createElement('div');
  $div.className = 'fixedWidth';
  $editContainer.appendChild($div);

  var $edit = document.createElement('img');
  $edit.setAttribute('src', 'images/edit.PNG');
  $edit.setAttribute('alt', 'edit icon');
  $edit.setAttribute('data-entry-id', entry.entryId);
  $edit.className = 'editButton';

  $div.appendChild($edit);

  var $entryNotes = document.createElement('p');
  $entryNotes.className = 'entryNotes';
  $entryNotes.textContent = entry.notes;

  $colhalf2.appendChild($entryNotes);

  return $row;
}
