export class DnDMouses {
  constructor(container) {
    this.container = container;
    this.dragEl = null;
    this.fantomEl = null;
    this.shift = null;
    this.padding = 30;
    // два слушателя вынесены в свойства, потому что от них нужно корректно отписаться
    this.eventMove = this.onMouseMove.bind(this);
    this.eventUp = this.onMouseUp.bind(this);
  }

  start() {
    // при старте подписываемся на слушателя нажатия мыши на всем контейнере
    this.container.addEventListener("mousedown", this.onMouseDown.bind(this));
  }

  onMouseDown(e) {
    e.preventDefault();
    
    if(e.target.classList.contains('card_delete')) {
        return;
    }
    // получаем target только если нажатие было на карточке или внутри нее
    const target = e.target.closest(".card");

    // если не на карточке - выходим
    if (!target) {
      return;
    }

    // добавляем карточку в свойство, с которым дальше работаем
    this.dragEl = target;
    // устанавливаем ширину принудительно, поскольку элемент будет absolute
    this.dragEl.style.width = target.offsetWidth + "px";
    // запоминаем смещение курсора
    // если у контейнеров были padding'и, они повлияют на считывание положения мыши, их надо добавить
    this.shift = {
      x: e.clientX - target.getBoundingClientRect().left,
      y: e.clientY - target.getBoundingClientRect().top + this.padding,
    };

    // задаем сразу положение карточки на странице относительно курсора
    this.dragEl.style.left = e.pageX - this.shift.x + "px";
    this.dragEl.style.top = e.pageY - this.shift.y + "px";

    // создаем копию, которую будем вставлять, показывая место сброса
    if (!this.fantomEl) {
      this.fantomEl = document.createElement("div");
      this.fantomEl.className = "fantom";
      this.fantomEl.style.width = target.offsetWidth + "px";
      this.fantomEl.style.height = target.offsetHeight + "px";
      this.dragEl.before(this.fantomEl);
    }

    // присваиваем карточке нужный класс
    this.dragEl.classList.add("dragged");

    // подписываемся на события движение мыши и отжатие клавиши мыши
    document.addEventListener("mouseup", this.eventUp);
    document.addEventListener("mousemove", this.eventMove);
  }

  // движение мыши - основная задача - правильно поставить фантом
  onMouseMove(e) {
    if (!this.dragEl) {
      return;
    }
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    // следуем карточкой за курсором
    this.dragEl.style.left = e.pageX - this.shift.x + "px";
    this.dragEl.style.top = e.pageY - this.shift.y + "px";

    // e.target - это над чем курсор. В dragged должно обязательно стоять pointer-events: none;
    const targetCard = e.target.closest(".card");

    // если не над карточкой и не над полем сброса - выходим
    // cards-list должно быть вытянуто на всю высоту колонки от названия до формы (смотри css)
    if (!targetCard && !e.target.classList.contains("cards-list")) {
      return;
    }

    // если курсор над полем сброса
    if (e.target.classList.contains("cards-list")) {
      // собираем в массив все карточки в колонке, которые не фантом и не перетаскиваемая карточка
      const arrCards = Array.from(e.target.children).filter(
        (card) =>
          !card.classList.contains("dragged") &&
          !card.classList.contains("fantom"),
      );

      // если поле сброса пустое, добавляем в него фантом
      if (arrCards.length === 0) {
        this.fantomEl.remove();
        e.target.append(this.fantomEl);
        // e.target.firstElementChild.classList.remove('active');
      } else {
        // если в поле есть карточки
        // если курсор ниже последней карточки (не между ними)
        if (
          e.clientY - this.padding >
          arrCards[arrCards.length - 1].offsetTop +
            arrCards[arrCards.length - 1].offsetHeight
        ) {
          // и если там нет фантома
          if (
            !e.target.children[e.target.children.length - 1].classList.contains(
              "fantom",
            )
          ) {
            this.fantomEl.remove();
            e.target.append(this.fantomEl);
          }
        }
        // если расстояние между карточками большое (блолее 10px),
        // то тут надо еще обработать вставку фантома не только в конец, но и между карточками
        // для этого придется считывать положение курсора и проверять по массиву arrCards
        // между какими двумя карточками стоит курсор
      }
    }

    // если курсор над карточкой
    if (targetCard) {
      // вычисляем в каком месте курсор на карточке
      // в верхней половине - true, в нижней - false
      const isLocationUp = this.isPositionUp(
        targetCard.offsetTop,
        targetCard.offsetHeight,
        e.clientY - this.padding,
      );

      // если верхняя половина, но до карточки уже есть фантом - выходим
      // eslint-disable-next-line prettier/prettier
        if (isLocationUp &&
        e.target.previousElementSibling &&
        e.target.previousElementSibling.classList.contains("fantom")
      ) {
        return;
      }

      // если нижняя половина, но после карточки уже есть фантом - выходим
      if (
        !isLocationUp &&
        e.target.nextElementSibling &&
        e.target.nextElementSibling.classList.contains("fantom")
      ) {
        return;
      }

      // если дошли досюда, значит надо вставить фантом
      // удаляем его со старого места (где бы оно не было)
      // вставляем до или после (уже определили положение)
      this.fantomEl.remove();
      isLocationUp
        ? targetCard.before(this.fantomEl)
        : targetCard.after(this.fantomEl);
    }
  }

  // сброс карточки
  onMouseUp() {
    if (!this.fantomEl || !this.dragEl) {
      return;
    }

    // отписываемся от события движения мыши
    document.removeEventListener("mousemove", this.eventMove);

    // удаляем все style, которые до этого присваивали перетаскиваемой карточке
    this.dragEl.removeAttribute("style");
    // вставляем карточку перед фантомом
    this.fantomEl.before(this.dragEl);
    // удаляем класс для перетаскивания
    this.dragEl.classList.remove("dragged");
    // удаляем фантом со страницы
    this.fantomEl.remove();
    // обнуляем свойства
    this.dragEl = null;
    this.fantomEl = null;

    // отписываемся от текущего события
    document.removeEventListener("mouseup", this.eventUp);
  }

  isPositionUp(elemTop, elemheight, clientY) {
    if (clientY > elemTop && clientY < elemTop + elemheight / 2) {
      return true;
    }
    return false;
  }
}
