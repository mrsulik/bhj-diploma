/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    this.element = element;

    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.create-income-button')) {
        const modalIncome = new Modal(App.modals.newIncome.activeElement);
        modalIncome.open();

        modalIncome.registerEvents();
      }

      if (e.target.closest('.create-expense-button')) {
        const modalExpense = new Modal(App.modals.newExpense.activeElement);
        modalExpense.open();

        modalExpense.registerEvents();
      }
    });
  }
}
