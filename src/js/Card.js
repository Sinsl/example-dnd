export class Card {
  constructor(text) {
    // получаем текст, который будет в карточке
    this.text = text;
    // выносим слушателей в свойства, что бы корректно от них отписываться
    this.mouseOverHandler = this.onMouseOver.bind(this);
    this.mouseOutHandler = this.onMouseOut.bind(this);
    this.deleteHandler = this.onDelete.bind(this);
    this.init();
  }

  init() {
    // создаем карточку
    this.createCard();
    // подписываем карточку на события внутри нее
    this.addListener();
  }

  createCard() {
    this.card = document.createElement("div");
    this.card.className = "card";
    // строка ниже нужна только для событий dnd, но на мышках она не мешает
    this.card.draggable = true;

    const content = `<div class="card_text">${this.text}</div>
        <div class="card_delete">&#215;</div>`;

    this.card.insertAdjacentHTML("beforeend", content);
    this.delete = this.card.querySelector(".card_delete");
  }

  addListener() {
    // наведение мышки и показ крестика закрытия
    this.card.addEventListener("mouseover", this.mouseOverHandler);
    // уход мышки и скрытие крестика
    this.card.addEventListener("mouseout", this.mouseOutHandler);
    // нажатие на крестик удаления карточки
    this.delete.addEventListener("click", this.deleteHandler);
  }

  onMouseOver() {
    this.delete.classList.add("active");
  }

  onMouseOut() {
    this.delete.classList.remove("active");
  }

  onDelete() {
    // перед удалением карточки отписываем ее от всех слушателей
    this.card.removeEventListener("mouseover", this.mouseOverHandler);
    this.card.removeEventListener("mouseout", this.mouseOutHandler);
    this.delete.removeEventListener("click", this.deleteHandler);
    this.card.remove();
  }
}
