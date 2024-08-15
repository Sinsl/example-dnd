// app.js будет выступать в роли контроллера приложения, для простоты реализации
import { Field } from "./Field";
import { Storage } from "./Storage";
import defaultTexts from "./defaultContent";
import { DnDMouses } from "./DnDMouses";
import { DnD } from "./DnD";

const container = document.querySelector(".container");

// создаем колонки с разметкой и формой, сразу все колонки
const field = new Field(container);
field.createField();

// работа с localStorage
const storage = new Storage();
const storageCard = storage.getStorage();
storageCard
  ? field.renderCard(JSON.parse(storageCard))
  : field.renderCard(defaultTexts);

// window.addEventListener("unload", () => {
//     storage.setStorage();
// });

// Реализация на событиях мыши
const dnd = new DnDMouses(container);
dnd.start();

// Реализация на событиях dnd
// const dnd = new DnD(container);
// dnd.start()
