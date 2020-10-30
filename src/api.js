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
          Promise.reject(error);
        }
      }
      return res.json();
    })
    .then((data) => {
      if (error) {
        error.message = data.message;
        Promise.reject(error);
      }

      return data;
    });
};

const getBookmarksList = function () {
  return filterFetch(BASE_URL);
};

export default {
  getBookmarksList
};
