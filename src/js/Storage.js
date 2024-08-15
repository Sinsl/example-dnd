export class Storage {
  getStorage() {
    return localStorage.getItem("trello");
  }

  setStorage() {
    const data = {};
    const column = document.querySelectorAll(".column");
    column.forEach((el) => {
      const arrCard = el.querySelectorAll(".card");
      data[el.title] = [];
      arrCard.forEach((item) => {
        data[el.title].push(item.querySelector(".card_text").textContent);
      });
    });

    localStorage.setItem("trello", JSON.stringify(data));
  }
}
