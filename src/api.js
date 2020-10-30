import $ from 'jquery';

const BASE_URL = `https://thinkful-list-api.herokuapp.com/yefenny/bookmarks`;
// check fetch for error and return the errors
const filterFetch = function (...arg) {
  let error;
  return fetch(...arg)
    .then((res) => {
      if (!res.ok) {
        error = { code: res.status };

        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then((data) => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      return data;
    });
};

const getBookmarksList = function () {
  return filterFetch(BASE_URL);
};

const addBookmark = function (params) {
  return filterFetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: params
  });
};

const updateBookmark = function (id, params) {
  return filterFetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: params
  });
};

const deleteBookmark = function (id) {
  return filterFetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
};

export default {
  getBookmarksList,
  updateBookmark,
  addBookmark,
  deleteBookmark
};
