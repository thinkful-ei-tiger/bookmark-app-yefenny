import $ from 'jquery';
import './index.css';

// import modules
import api from './api';
import store from './store';
import bookmarksList from './bookmarks-list';
// Main function that renders the shopping list
const main = function () {
  api.getBookmarksList().then((sites) => {
    console.log(sites);
    sites.forEach((bookmark) => {
      store.addBookmark(bookmark);
      bookmarksList.render();
    });
  });
  bookmarksList.render();
};

$(main);
