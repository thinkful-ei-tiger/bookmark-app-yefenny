let store = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0,
  edit: ''
};

const findById = function (id) {
  return store.bookmarks.find((site) => site.id === id);
};
// add new bookmark item to store
const addBookmark = function (site) {
  site.expanded = false;
  console.log(site);
  this.store.bookmarks.push(site);
  console.log(this.store.bookmarks);
};

const changeFilter = function (filter) {
  this.store.filter = filter;
};

const toggleExpanded = function (id) {
  let found = findById(id);

  found.expanded = !found.expanded;
};

const toggleAdding = function () {
  this.store.adding = !this.store.adding;
};

const changeEdit = function (id) {
  this.store.edit = id;
};

const updateBookmark = function (id, params) {
  let foundBookmark = findById(id);
  params = JSON.parse(params);
  params.expanded = false;
  Object.assign(foundBookmark, params);
};

const deleteBookmark = function (id) {
  this.store.bookmarks = this.store.bookmarks.filter((item) => item.id !== id);
};

const setError = function (message) {
  this.store.error = message;
};

export default {
  store,
  addBookmark,
  changeFilter,
  toggleExpanded,
  toggleAdding,
  changeEdit,
  updateBookmark,
  setError,
  deleteBookmark
};
