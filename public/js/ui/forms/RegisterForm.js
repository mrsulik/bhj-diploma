/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    const callback = (err, response) => {
      if (response && response.user) {
        User.fetch(() => App.setState(User.current() ? 'user-logged' : 'init'));

        App.modals.register.activeElement.querySelector('#register-form').reset();
        App.modals.register.activeElement.style.display = '';
      }
    };

    User.register(data, callback);
  }
}
