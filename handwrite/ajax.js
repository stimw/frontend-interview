// Do not consider IE browser compatibility

// Example for GET and POST
const ajax = (option) => {
  // option: type, url, data, timeout, success, error

  // 0. Object to String, and the characters should be legal for url
  const objToString = (obj) => {
    const result = [];
    for (let key in obj) {
      result.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }

    return result.join('&');
  };

  const dataStr = objToString(option.data || {});

  // 1. Create async object
  const xhr = new XMLHttpRequest();

  // 2. Ready to open and send request
  if (option.type.toLowerCase() === 'get') {
    xhr.open(option.type, option.url);
    xhr.send();
  } else if (option.type.toLowerCase() === 'post') {
    xhr.open(option.type, option.url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(dataStr);
  }

  // 3. Listen the state
  let timer;
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // reset timer
      clearTimeout(timer);
      // 304 indicates a cache
      if ((xhr.status >= 200 && xhr.status) < 300 || xhr.status === 304) {
        option.success(xhr.responseText);
      } else {
        option.error(xhr.responseText);
      }
    }
  };

  // 4. check timeout
  if (option.timeout) {
    timer = setTimeout(function () {
      clearTimeout(timer);
      xhr.abort();
    }, option.timeout);
  }
};

// Test on the browser
// After launch json-server
ajax({
  type: 'GET',
  url: 'http://localhost:3000/posts',
  timeout: 1000,
  success: (data) => {
    console.log('success', data);
  },
  error: (err) => {
    console.log('error', err);
  },
});
