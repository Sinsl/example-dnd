import { Form } from "./Form";
import { Card } from "./Card";

export class Field {
  constructor(container) {
    this.container = container;
    // определяем названия колонок, а значит и их количество
    this.names = ["todo", "progress", "done"];
  }

  createField() {
    this.names.forEach((el) => {
      // создаем разметку каждой колонки и добавляем на страницу
      const column = this.createColumn(el);
      this.container.append(column);
      // создаем форму и добавляем в конец колонки
      // форма всегда будет по нижнему клраю колонки (css)
      const form = new Form(column);
      column.append(form.formBox);
    });
  }

  createColumn(title) {
    const column = document.createElement("div");
    column.className = "column";
    column.title = title;

    const contentColumn = `
        <div class="column-content">
            <h2>${title}</h2>
            <div class="cards-list"></div>
        </div>
        `;

    column.insertAdjacentHTML("beforeend", contentColumn);
    return column;
  }

  // добавление карточке на страницу, либо дефолтных, либо из lc
  renderCard(data) {
    const arrColumn = Array.from(document.querySelectorAll(".column"));
    arrColumn.forEach((column) => {
      const title = column.title;
      const cardsListEl = column.querySelector(".cards-list");
      data[title].forEach((card) => {
        const newCard = new Card(card);
        cardsListEl.append(newCard.card);
      });
    });
  }
}
