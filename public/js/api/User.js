/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * не наследуется от Entity. Статическое свойство URL равно /user.
 * */
class User {
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };

    let userString = JSON.stringify(responseUser);

    localStorage.user = userString
    // {name: 'Dmitriy', email: 'oleg6@demo.ru', password: 'qwe', id: '1e41a9554ldbx436n'}
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    delete localStorage.user
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() { 
    return localStorage.user
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    callback()
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: '/user' + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
 
    // Метод запускает выполнение функции createRequest.
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: '/user' + '/register',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    })
      
    //Метод запускает выполнение функции createRequest. 
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: '/user' + '/logout',
      method: 'POST',
      responseType: 'json',
      callback: (err, response) => { 
        callback(err, response);
      }
    })
    // Метод запускает выполнение функции createRequest. После успешного выхода необходимо вызвать метод User.unsetCurrent.
  }
}