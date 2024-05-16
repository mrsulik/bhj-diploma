// const { response } = require("express")

/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */

  onSubmit(data) {
    const callback = (err, response) => {
      if (response && response.user) {
        User.fetch(() => App.setState(User.current() ? 'user-logged' : 'init'));

        App.modals.login.activeElement.querySelector('#login-form').reset();
        App.modals.login.activeElement.style.display = '';
      }
    };

    User.login(data, callback);
  }
}
