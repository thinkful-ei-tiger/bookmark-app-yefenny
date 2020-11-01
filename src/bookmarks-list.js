import $ from 'jquery';
import store from './store';
import fullStar from './images/new-black.svg';
import emptyStar from './images/full-stroke.svg';
import deleteIcon from './images/trash-can.svg';
import api from './api';

// serialize form data
const serializeJson = function (form) {
  const formData = new FormData(form);
  const o = {};
  formData.forEach((val, name) => (o[name] = val));
  return JSON.stringify(o);
};

// insert error Message
const renderError = function () {
  if (store.store.error) {
    let element = generateErrorElements(store.store.error);
    $('.js-error-container').html(element);
  }
};
// generate error elements

const generateErrorElements = function (message) {
  return `<input type="button" name="cancel-err" id="cancel-err" value="x" class="button cancel-error" /> <span class="error">${message}</span> `;
};
// generate selectOptionsForm
const generateAddSelectOptions = function (rating) {
  let options = '';
  //   ${rating === i ? 'selected' : ''}
  for (let i = 1; i <= 5; i++) {
    options += `<option value="${i}" ${rating === i ? 'selected' : ''}>`;
    for (let x = 0; x < i; x++) {
      options += '★';
    }
    options += `</option>`;
  }
  return options;
};

//generate add form template that can be use for add or edit bookmark
const generateAddForm = function (item) {
  let options = generateAddSelectOptions(item ? item.rating : '');

  let html = ` <h2>${item ? 'Edit bookmark' : 'Add new bookmark'}</h2>
  <div class="js-error-container error-container flex-column "> </div>
  <form class="js-form flex-column" data-item-id="${item ? item.id : ''}">
      <input type="url" name="url" id="url" required placeholder="http:sample.com"/ value="${
        item ? item.url : ''
      }" required>
      <div class="details flex-column">
          <input type="text" class="title" placeholder="Insert bookmark name" name="title" value="${
            item ? item.title : ''
          }"  required>
          <label for="rating">Rating</label>
          
          <select name="rating" id="rating">
          ${options}
          </select>
          <textarea name="desc" id="description" cols="30" rows="10">${
            item ? item.desc : ''
          } </textarea>
      
      </div>
      <div class=" form-buttons flex-row">
  
          <button type="button" class=" buttons" id="cancel"> Cancel</button>
          <button type="submit" id="create" class="buttons">Save</button> 
      </div>
  </form>`;
  return html;
};

// generate start image to add to the list item
const getStarts = function (rating) {
  let starts = '';
  let offStar = 5 - rating;
  for (let i = 0; i < rating; i++) {
    starts += `<img src="${fullStar}" alt="full-star"/> `;
  }
  for (let i = 0; i < offStar; i++) {
    starts += `<img src="${emptyStar}" alt="empty-star"/> `;
  }

  return starts;
};

// generate list item for each side to display in the principal page
const generateListItem = function (items) {
  let listString = '';
  items.forEach((site) => {
    let starts = '';
    if (site.rating) {
      starts = getStarts(site.rating);
    }

    listString += ` <li class='js-list-item list-item flex-column' tabindex="0" data-item-id="${
      site.id
    }">
                    <div class="list-head flex-row">
                        <span class="item-title"> ${site.title}</span> 
                        <span class="stars icon ${
                          !site.expanded ? '' : 'hidden'
                        }"> ${starts} </span>
                      <span class="trash ${site.expanded ? '' : 'hidden'}">
                        <button type="button" name="delete-item" class='js-delete delete-button'><img src="${deleteIcon}" alt="delete"> </button>
                    </span>
                    </div>
                    <div class="js-expand item-preview flex-column  ${
                      site.expanded ? '' : 'hidden'
                    }">
                        <span class="flex-row top-description">
                            <button class="buttons visit-button"><a href="${
                              site.url
                            }" alt="link-to bookmark" target= "black">Visit page</a></button>
                            <span class= "star flex-column" > ${
                              site.rating
                            } </span>
                        </span>
                        <p class="description">${site.desc}
                        </p>
                         <input type="button" class="js-edit buttons edit" value="Edit">
                    </div>
                    </li> `;
  });

  return listString;
};

// generate elements to show on the bookmarks list view
const generateListTemplate = function (items) {
  let template = `<div class="js-error-container error-container flex-row "> </div>
  <div class="buttons-container flex-row">
        <button type="button" class="js-new buttons" id='new-bookmark'> + New bookmark</button>
        <select name="filter" id="filter" class='buttons'>
            <option value="" selected disabled >Filter By</option>
            <option value="0">No filter</option>
            <option value="1">+1 Star</option>
            <option value="2">+2 Star</option>
            <option value="3">+3 Star</option>
            <option value="4">+4 Star</option>
            <option value="5">+5 Star</option>
          </select>
    </div>
    <div class="result-list">
        <ul class="flex-column"> 
      `;
  template += generateListItem(items);
  return template;
};

// render
const render = function () {
  const newStore = store.store;
  let items = newStore.bookmarks;
  let template = '';

  if (newStore.edit) {
    let item = newStore.bookmarks.find((item) => item.id === newStore.edit);
    template += generateAddForm(item);
  } else if (newStore.adding) {
    template += generateAddForm();
  } else if (newStore.filter === 0) {
    // To display the bookmarks without filters
    template += generateListTemplate(items);
  } else if (newStore.filter !== 0) {
    // to display bookmarks filtered by selected rating
    items = filterByRating(items, newStore.filter);
    template += generateListTemplate(items);
  }

  $('.container').html(template);
};

// Filter bookmarks by rating
const filterByRating = function (items, rating) {
  let filteredItems = items.filter((item) => item.rating >= rating);
  return filteredItems;
};

/**-------------------------- Handles -----------------------**/
// check if It is submitting to update form or to new Bookmark form
const handleFormSubmit = function () {
  $('.container').on('submit', '.js-form', function (evt) {
    evt.preventDefault();
    let id = $(this).data('item-id');
    let vals = serializeJson(this);
    if (id) handleUpdateBookmark(id, vals);
    else handleNewBookmark(vals);
  });
};

const handleNewBookmark = function (params) {
  api
    .addBookmark(params)
    .then((item) => {
      console.log(item);
      store.addBookmark(item);
      store.toggleAdding();
      render();
    })
    .catch((error) => {
      store.setError(error.message);
      renderError();
    });
};

const handleUpdateBookmark = function (id, params) {
  api
    .updateBookmark(id, params)
    .then(() => {
      store.updateBookmark(id, params);
      store.changeEdit('');
      render();
    })
    .catch((error) => {
      console.log(error);
      store.setError(error.message);
      renderError();
    });
};

// Handle on deleteButton
const handleDeleteItem = function () {
  $('.container').on('click', '.js-delete', function (evt) {
    let id = $(this).closest('.js-list-item').data('item-id');
    api
      .deleteBookmark(id)
      .then(() => {
        store.deleteBookmark(id);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};

// Handle on click cancel error "x"

const handleCancelError = function () {
  $('.container').on('click', '#cancel-err', function () {
    store.setError(null);
    render();
  });
};
// Handle on click cancel button on add form and check if what clicked from Edit or addNew
const handleCancelClick = function () {
  $('.container').on('click', '#cancel', function (evt) {
    let id = $(this).closest('.js-form').data('item-id');
    if (id) store.changeEdit('');
    else store.toggleAdding();
    render();
  });
};

const handleFilterClick = function () {
  $('.container').on('change', '#filter', function (evt) {
    let filter = $(this).val();
    if (filter !== 0) {
      store.changeFilter(filter);
      render();
    }
  });
};

const handleClickNew = function () {
  $('.container').on('click', '.js-new', function (evt) {
    store.toggleAdding();
    render();
  });
};

const handlekeyDownListItem = function () {
  $('.container').on('keydown', '.js-list-item', function (evt) {
    if (evt.which == 13) {
      $(this).click();
    }
  });
};

const handleListItemClick = function () {
  $('.container').on('click', '.js-list-item', function (evt) {
    evt.stopPropagation();
    const id = $(this).data('item-id');
    store.toggleExpanded(id);
    render();
  });
};

const handleEditClick = function () {
  $('.container').on('click', '.js-edit', function (evt) {
    let id = $(this).closest('.js-list-item').data('item-id');
    store.changeEdit(id);
    render();
  });
};

// Listen every function inside it
const eventsListener = function () {
  handleFilterClick();
  handleListItemClick();
  handlekeyDownListItem();
  handleEditClick();
  handleCancelClick();
  handleFormSubmit();
  handleCancelError();
  handleClickNew();
  handleDeleteItem();
};

export default {
  render,
  eventsListener
};
