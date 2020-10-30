import $ from 'jquery';
import store from './store';
import fullStar from './images/new-black.svg';
import emptyStar from './images/full-stroke.svg';
import deleteIcon from './images/trash-can.svg';

// to display starts
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
// render

const render = function () {
  let html = `<h1>Bookmarks app</h1>  
    <div class="buttons-container flex-row">
        <button type="button" class="buttons" id='new-bookmark'> + New bookmark</button>
        <select name="filter" id="filter" class='buttons'>
            <option value=""selected disabled >Filter By</option>
            <option value="1 Star">1 star</option>
            <option value="+1 Star">+1 Star</option>
            <option value="+2 Star">+2 Star</option>
            <option value="+3 Star">+3 Star</option>
            <option value="+4 Star">+4 Star</option>
          </select>
    </div>
    <div class="result-list">
        <ul class="flex-column"> 
      `;
  store.store.bookmarks.forEach((site) => {
    let starts = '';
    if (site.rating) {
      starts = getStarts(site.rating);
    }

    html += ` <li class='list-item flex-column' tabindex="0">
                <div class="list-head flex-row">
                    <span class="item-title"> ${site.title} </span> 
                    <span class="stars icon"> ${starts} </span>
                  <span class="trash hidden">
                    <img src="${deleteIcon}" alt="delete">
                </span>
                </div>
                <div class="item-preview flex-column  hidden">
                    <span class="flex-row top-description">
                        <button class="buttons visit-button"><a href="${site.url}" alt="link-to bookmark" target= "black">Visit page</a></button>
                        <span class= "star flex-column" > <input type="number" value="${site.rating}" class="rating" max="5" min="1" required> </span>
                    </span>
                    <p class="description" contenteditable="true">${site.desc}
                    </p>
                    <input type="submit" class="buttons update" value="Update">
                </div>
                </li>`;
  });

  $('.container').html(html);
};

export default {
  render
};
