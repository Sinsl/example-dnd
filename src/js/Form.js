import { Card } from "./Card";

export class Form {
  constructor(column) {
    this.column = column;
    this.init();
  }

  init() {
    // создание разметки блока добавления карточке
    this.createForm();
    // подписка на события в этом блоке
    this.addListener();
  }

  createForm() {
    this.formBox = document.createElement("div");
    this.formBox.className = "form-box";

    // создаем строчку add another task, и делаем ее видимой классом active
    this.elAdd = document.createElement("div");
    this.elAdd.className = "btn-form-visible active";
    this.elAdd.textContent = "+ Add task";

    // создаем форму, по умолчанию она скрыта
    this.form = document.createElement("form");
    this.form.className = "form-field";

    this.formBox.append(this.elAdd);
    this.formBox.append(this.form);

    const contectForm = `<textarea placeholder="add" rows="3"></textarea>
            <div class="form-btn-box">
                <button>add</button>
                <button type="reset">&#215;</button>
            </div>`;

    this.form.insertAdjacentHTML("beforeend", contectForm);
  }

  addListener() {
    // клик на строку add another task
    this.elAdd.addEventListener("click", this.onOpenForm.bind(this));
    // отправка формы
    this.form.addEventListener("submit", this.onSubmitForm.bind(this));
    // отмена (нажатие на крестик)
    this.form.addEventListener("reset", this.onCloseForm.bind(this));
  }

  onOpenForm() {
    // скрываем add another task, показываем форму
    this.elAdd.classList.remove("active");
    this.form.classList.add("active");
  }

  onSubmitForm(e) {
    e.preventDefault();
    // тримим введенный текст
    const text = this.form.querySelector("textarea").value.trim();
    if (text) {
      // если текст есть после трима,
      // создаем новую карточку и добавляем ее в конец списка в нужной колонке
      const newCard = new Card(text);
      this.column.querySelector(".cards-list").append(newCard.card);
    }
    this.onCloseForm();
  }

  onCloseForm() {
    // очищаем форму, показываем add another task, скрываем форму
    this.form.reset();
    this.elAdd.classList.add("active");
    this.form.classList.remove("active");
  }
}
