let store = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0
};

// add new bookmark item to store
const addBookmark = function (site) {
  site.expanded = false;
  this.store.bookmarks.push(site);
};

const changeFilter = function (filter) {
  this.store.filter = filter;
};

export default {
  store,
  addBookmark,
  changeFilter
};
