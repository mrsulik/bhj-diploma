/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    const callback = (err, response) => {
      if (response.success) {
        App.modals.createAccount.activeElement.querySelector('#new-account-form').reset();
        App.modals.createAccount.activeElement.style.display = 'none';

        App.update();
      }
    };

    Account.create(data, callback);
  }
}
