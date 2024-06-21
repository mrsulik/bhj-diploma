/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
	let xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.withCredentials = true;
  const formData = new FormData();
         
  if (options.method === 'GET') {
      options.url += `?`;
      for (let key in options.data) {
          options.url += `${key}=${options.data[key]}&`;
      }
  } else {
      for (let key in options.data) {
          formData.append(key, options.data[key]);

      }
  }
  try {
      xhr.open (options.method, options.url);
      xhr.send(formData);
  } catch (e) {
      console.log('catch' + e);
  };
  xhr.onload = () => {
      options.callback(null, xhr.response);
  };
  xhr.onerror = () => { 
      options.callback(xhr.statusText, null);
  };
};
