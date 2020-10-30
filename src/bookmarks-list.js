import $ from 'jquery';
import store from './store';
import fullStar from './images/new-black.svg';
import emptyStar from './images/full-stroke.svg';
import deleteIcon from './images/trash-can.svg';

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
                        <span class="item-title"> ${site.title} </span> 
                        <span class="stars icon"> ${starts} </span>
                      <span class="trash hidden">
                        <img src="${deleteIcon}" alt="delete">
                    </span>
                    </div>
                    <div class="js-expand item-preview flex-column  ${
                      site.expanded ? '' : 'hidden'
                    }">
                        <span class="flex-row top-description">
                            <button class="buttons visit-button"><a href="${
                              site.url
                            }" alt="link-to bookmark" target= "black">Visit page</a></button>
                            <span class= "star flex-column" > <input type="number" value="${
                              site.rating
                            }" class="rating" max="5" min="1" required> </span>
                        </span>
                        <p class="description" contenteditable="true">${
                          site.desc
                        }
                        </p>
                         <input type="submit" class="buttons update" value="Update">
                    </div>
                    </li> `;
  });

  return listString;
};

// generate elements to show on the bookmarks list view
const generateListTemplate = function (items) {
  let template = `<div class="buttons-container flex-row">
        <button type="button" class="buttons" id='new-bookmark'> + New bookmark</button>
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
  if (newStore.filter === 0) {
    template += generateListTemplate(items);
  } else if (newStore.filter !== 0) {
    items = filterByRating(items, newStore.filter);
    console.log(items);
    template += generateListTemplate(items);
  }
  $('.container').html(template);
};

// Filter bookmarks by rating
const filterByRating = function (items, rating) {
  let filteredItems = items.filter((item) => item.rating >= rating);
  return filteredItems;
};

// Handle clicks

const handleFilterClick = function () {
  $('.container').on('change', '#filter', function (evt) {
    let filter = $(this).val();
    if (filter !== 0) {
      store.changeFilter(filter);
      render();
    }
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
    console.log('this other handle');
    const id = $(this).data('item-id');
    store.toggleExpanded(id);
    render();
  });
};

const eventsListener = function () {
  handleFilterClick();
  handleListItemClick();
  handlekeyDownListItem();
};

export default {
  render,
  eventsListener
};
