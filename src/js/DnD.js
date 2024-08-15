export class DnD {
  constructor(container) {
    this.container = container;
    this.cardLists = container.querySelectorAll(".cards-list");
    this.dragEl = null;
    this.fantomEl = null;
    this.padding = 30;
  }

  start() {
    // подписываем колонки на слушателей перетаскивания
    this.cardLists.forEach((list) => this.addListners(list));
    // подписываем документ на перетаскивание и сброс карточки
    document.addEventListener("dragover", this.onDragOver.bind(this));
    document.addEventListener("drop", this.onDrop.bind(this));
  }

  addListners(list) {
    list.addEventListener("dragstart", this.onDragStart.bind(this));
    list.addEventListener("dragend", this.onDragEnd.bind(this));
  }

  onDragStart(e) {
    this.dragEl = e.target;
    this.dragEl.classList.add("selected");

    // создаем фантом
    if (!this.fantomEl) {
      this.fantomEl = document.createElement("div");
      this.fantomEl.className = "fantom";
      this.fantomEl.style.width = this.dragEl.offsetWidth + "px";
      this.fantomEl.style.height = this.dragEl.offsetHeight + "px";
    }

    // что бы копия осталась под курсором, делаем через асинхронное событие
    setTimeout(() => {
      this.dragEl.after(this.fantomEl);
      this.dragEl.remove();
    }, 0);
  }

  // перетаскивание завершено - очищаем переменные
  onDragEnd() {
    this.dragEl = null;
    this.fantomEl = null;
  }

  // тут все так же, как и в мышах
  onDragOver(e) {
    e.preventDefault();
    if (!this.dragEl) {
      return;
    }
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    // не отслеживаем положение карточки относительно курсора,
    // события dnd делают это сами
    // this.dragEl.style.left = e.pageX - this.shift.x + 'px';
    // this.dragEl.style.top = e.pageY - this.shift.y + 'px';

    const targetCard = e.target.closest(".card");

    if (!targetCard && !e.target.classList.contains("cards-list")) {
      return;
    }

    if (e.target.classList.contains("cards-list")) {
      const arrCards = Array.from(e.target.children).filter(
        (card) =>
          !card.classList.contains("dragged") &&
          !card.classList.contains("fantom"),
      );

      if (arrCards.length === 0) {
        this.fantomEl.remove();
        e.target.append(this.fantomEl);
        // e.target.firstElementChild.classList.remove('active');
      } else {
        if (
          e.clientY - this.padding >
          arrCards[arrCards.length - 1].offsetTop +
            arrCards[arrCards.length - 1].offsetHeight
        ) {
          if (
            !e.target.children[e.target.children.length - 1].classList.contains(
              "fantom",
            )
          ) {
            this.fantomEl.remove();
            e.target.append(this.fantomEl);
          }
        }
      }
    }

    if (targetCard) {
      const isLocationUp = this.isPositionUp(
        targetCard.offsetTop,
        targetCard.offsetHeight,
        e.clientY - this.padding,
      );
      // eslint-disable-next-line prettier/prettier
        if (isLocationUp &&
        e.target.previousElementSibling &&
        e.target.previousElementSibling.classList.contains("fantom")
      ) {
        return;
      }

      if (
        !isLocationUp &&
        e.target.nextElementSibling &&
        e.target.nextElementSibling.classList.contains("fantom")
      ) {
        return;
      }

      this.fantomEl.remove();
      isLocationUp
        ? targetCard.before(this.fantomEl)
        : targetCard.after(this.fantomEl);
    }
  }

  onDrop(e) {
    e.preventDefault();

    if (!this.fantomEl || !this.dragEl) {
      return;
    }

    this.dragEl.removeAttribute("style");
    this.fantomEl.before(this.dragEl);
    this.dragEl.classList.remove("selected");
    this.fantomEl.remove();
  }

  isPositionUp(elemTop, elemheight, clientY) {
    if (clientY > elemTop && clientY < elemTop + elemheight / 2) {
      return true;
    }
    return false;
  }
}
