/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

// const { response } = require("express");

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element) {
      this.element = element;
    } else {
      throw new Error('Не передан элемент в аккаунт виджет');
    }

    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();

      if (e.target.matches('.create-account')) {
        const el = App.getModal('createAccount');
        const modalCreateAccaunt = new Modal(el.activeElement);
        modalCreateAccaunt.open();

        modalCreateAccaunt.registerEvents();
      }

      if (e.target.closest('.account')) {
        this.onSelectAccount(e.target.closest('.account'));
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      const dataUser = JSON.parse(localStorage.user);

      const data = {
        email: dataUser.email,
        password: dataUser.password,
      };

      const callback = (err, response) => {
        if (response.success) {
          this.clear();
          this.renderItem(response.data);
        }
      };

      Account.list(data, callback);
      // очистить список отображённых счетов через AccountsWidget.clear()
      // Отображает список полученных счетов с помощью метода renderItem()
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const collectionAccount = this.element.querySelectorAll('.account');
    collectionAccount.forEach((element) => element.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });   ???????????
   * */
  onSelectAccount(element) {
    if (this.element.querySelector('.active')) {
      this.element.querySelector('.active').classList.remove('active');
    }

    element.classList.add('active');

    App.showPage('transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    let li = document.createElement('li');
    li.classList.add('account');
    li.setAttribute('data-id', `${item.id}`);

    let a = document.createElement('a');
    a.setAttribute('href', `#`);
    a.style.display = 'flex';
    a.style.justifyContent = 'space-between';

    let spanName = document.createElement('span');
    spanName.textContent = `${item.name} `;

    let valute = '₽';
    let spanSum = document.createElement('span');
    spanSum.textContent = `${item.sum} ${valute}`;
    spanSum.style.marginRight = '10px';

    li.append(a);
    a.append(spanName);
    a.append(spanSum);

    return li;
    // Возможно нужно будет вызывать onSelectAccount
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    // перебирать массив с информацией о счетах и каждый раз вызывать getAccountHTML и передавать в item данные для подстановки, и добавлением в this.element
    data.forEach((el) => {
      const itemLi = this.getAccountHTML(el);

      this.element.append(itemLi);
    });
  }
}
