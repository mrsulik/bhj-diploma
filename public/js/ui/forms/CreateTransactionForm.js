// const { response } = require("express");

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  constructor(element) {
    super(element);

    this.element = element;

    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    if (localStorage.user) {
      const dataUser = JSON.parse(localStorage.user);

      const data = {
        email: dataUser.email,
        password: dataUser.password,
      };

      const callback = (err, response) => {
        if (response.success) {
          const collectionOption = this.element[3].querySelectorAll('option');
          collectionOption.forEach((el) => el.remove());

          response.data.forEach((el) => {
            const option = document.createElement('option');
            option.setAttribute('value', `${el.id}`);
            option.textContent = `${el.name}`;

            this.element[3].append(option);
          });
        }
      };

      Account.list(data, callback);
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const callback = (err, response) => {
      if (response.success) {
        App.update();
        this.element.reset();
        this.element.closest('.modal').style.display = 'none';

        TransactionsPage.update;
      } else {
        console.log(err);
      }
    };

    const formData = new FormData(this.element);

    Transaction.create(formData, callback);
  }
}
