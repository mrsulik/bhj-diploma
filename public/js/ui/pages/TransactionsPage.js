/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (element) {
      this.element = element;
    }

    this.lastOptions = null;
    this.contentTitle = this.element.querySelector('.content-title');
    this.content = this.element.querySelector('.content');

    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.content.addEventListener('click', (e) => {
      if (e.target.closest('.transaction__remove')) {
        this.removeTransaction(e.target.closest('.transaction__remove').dataset.id);
      }
    });

    this.content.previousElementSibling.addEventListener('click', (e) => {
      if (e.target.closest('.remove-account')) {
        this.removeAccount();
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    let resultConfirm = confirm('Вы действительно хотите удалить счёт?');

    if (resultConfirm && this.lastOptions) {
      const callback = (err, response) => {
        if (response.success) {
          App.updateWidgets();
          App.updateForms();
        } else {
          console.log(err);
        }
      };

      const data = new FormData();
      data.append('id', this.lastOptions.account_id);

      Account.remove(data, callback);
      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let resultConfirm = confirm('Вы подтверждаете удаление транзакции?');

    if (resultConfirm) {
      const callback = (err, response) => {
        if (response.success) {
          App.update();
          this.update();
          console.log(response);
        } else {
          console.log(err);
        }
      };

      const data = new FormData();
      data.append('id', id);

      Transaction.remove(data, callback);
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;
      // Title
      const callbackForTitle = (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
        }
      };

      Account.get(this.lastOptions.account_id, callbackForTitle);

      // Transactions
      const callbackForList = (err, response) => {
        if (response.success) {
          this.renderTransactions(response.data);
        }
      };

      const dataUser = JSON.parse(localStorage.user);

      const data = {
        account_id: this.lastOptions.account_id,
      };

      Transaction.list(data, callbackForList);
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    // date === "2023-01-29T14:53:37.443Z"
    const dateParsed = Date.parse(date);

    const objDate = new Date(dateParsed);

    const optionsFirst = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const optionsSecond = {
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
    };

    const transactionDate = `${objDate.toLocaleString('ru', optionsFirst)} в ${objDate.toLocaleString('ru', optionsSecond)}`;

    return transactionDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    let date = this.formatDate(item.created_at);

    let divTransaction = document.createElement('div');
    divTransaction.classList.add('transaction');
    divTransaction.classList.add(`transaction_${item.type}`);
    divTransaction.classList.add('row');
    divTransaction.innerHTML = `<div class="col-md-7 transaction__details">
                                  <div class="transaction__icon">
                                      <span class="fa fa-money fa-2x"></span>
                                  </div>
                                  <div class="transaction__info">
                                      <h4 class="transaction__title">${item.name}</h4>
                                      <div class="transaction__date">${date}</div>
                                  </div>
                                </div>
                                <div class="col-md-3">
                                  <div class="transaction__summ">
                                      ${item.sum} <span class="currency">₽</span>
                                  </div>
                                </div>
                                <div class="col-md-2 transaction__controls">
                                    <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                                        <i class="fa fa-trash"></i>  
                                    </button>
                                </div>`;
    return divTransaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    let lastElements = [...this.content.children];

    lastElements.forEach((el) => el.remove());

    data.forEach((el) => {
      this.content.append(this.getTransactionHTML(el));
    });
  }
}
