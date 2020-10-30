let store = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0
};

const siteById = function (id) {
  return store.bookmarks.find((site) => site.id === id);
};
// add new bookmark item to store
const addBookmark = function (site) {
  site.expanded = false;
  this.store.bookmarks.push(site);
};

const changeFilter = function (filter) {
  this.store.filter = filter;
};

const toggleExpanded = function (id) {
  let found = siteById(id);
  found.expanded = !found.expanded;
};

export default {
  store,
  addBookmark,
  changeFilter,
  toggleExpanded
};
