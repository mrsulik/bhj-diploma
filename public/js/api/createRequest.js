/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = (options = {}) => {
  let xhr;
  xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  if (options.method === 'GET' && options.url === '/transaction') {
    try {
      xhr.open(options.method, `${options.url}?account_id=${options.data.account_id}`);
      xhr.send();
    } catch (error) {
      console.log(error);
    }
  } else if (options.method === 'DELETE') {
    try {
      xhr.open(options.method, options.url);

      xhr.send(options.data);
    } catch (error) {
      console.log(error);
    }
  } else if (options.method === 'GET') {
    try {
      xhr.open(options.method, `${options.url}?mail=${options.data.email}&password=${options.data.password}`);
      xhr.send();
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      xhr.open(options.method, options.url);
      xhr.send(options.data);
    } catch (error) {
      console.log(error);
    }
  }

  xhr.addEventListener('load', (e) => {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      if (xhr.response.success === true) {
        options.callback(null, xhr.response);
      } else {
        options.callback(xhr.response.error);
      }
    }
  });
};
