/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  constructor() {
    super();
    this.URL = '/account';
  }

  static get(id = '', callback) {
    let userDataObj = JSON.parse(localStorage.user);

    let data = new FormData();
    data.append('email', userDataObj.email);
    data.append('password', userDataObj.password);

    createRequest({
      url: `${new this().URL}/${id}`,
      method: 'GET',
      responseType: 'json',
      data,
      callback: (err, response) => {
        callback(err, response);
      },
    });
  }
}
