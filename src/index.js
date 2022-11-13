import app from "./firebase-config";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";

const db = getFirestore(app);

//form div
const formDiv = document.querySelector(".form-div");

//add book btn
const addBookBtn = document.querySelector(".add-book");

//books grid

const booksGrid = document.querySelector(".books");

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
  toggleRead = function () {
    if (this.read) {
      this.read = false;
    } else {
      this.read = true;
    }
    return;
  };
}

const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let author = form.elements["author"].value;
  let title = form.elements["title"].value;
  let pages = form.elements["pages"].value;
  let read = form.elements["read"].checked;

  addBookToLibrary(new Book(title, author, pages, read));
  clearForm();
  hideForm();
  clearBookGrid();
  displayBooks();
});

addBookBtn.addEventListener("click", () => {
  formDiv.classList.add("show-form");
});

const hideForm = () => {
  formDiv.classList.remove("show-form");
};

let myLibrary = [
  new Book("this how title looks", "this is the author", 0, false),
  new Book("things fall apart", "chinua achebe", 321, true),
];

async function addBookToLibrary(book) {
  await addDoc(collection(db, "books"), {
    title: book.title,
    author: book.author,
    pages: book.pages,
    read: book.read,
  });
}

function clearForm() {
  form.elements["author"].value = "";
  form.elements["title"].value = "";
  form.elements["pages"].value = "";
  form.elements["read"].checked = false;
}

async function displayBooks() {
  const q = query(collection(db, "books"));
  const qsnap = await getDocs(q);
  qsnap.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    let book = document.createElement("div");
    book.classList.add("book");
    let title = document.createElement("h3");
    let author = document.createElement("p");
    let pages = document.createElement("p");
    let readBtn = document.createElement("button");
    let btn = document.createElement("button");
    let btnDiv = document.createElement("div");
    title.innerText = doc.data().title;
    author.innerText = `by ${doc.data().author}`;
    pages.innerText = `${doc.data().pages} pages`;
    readBtn.innerText = `${doc.data().read ? "read" : "not read"}`;
    readBtn.classList.add(`${doc.data().read ? "read" : "notread"}`);
    btn.innerText = "delete";
    btn.classList.add("delete");
    btnDiv.appendChild(readBtn);
    btnDiv.appendChild(btn);

    btn.addEventListener("click", (e) => deleteBook(e));
    readBtn.addEventListener("click", (e) => toggleRead(e));

    book.setAttribute("data-position", doc.id);
    book.appendChild(title);
    book.appendChild(author);
    book.appendChild(pages);
    book.appendChild(btnDiv);

    booksGrid.appendChild(book);
  });
}

async function toggleRead(e) {
  const idx = e.path[2].attributes["data-position"].value;

  const docRef = doc(db, "books", idx);
  const docSnap = await getDoc(docRef);

  const bookData = docSnap.data();

  updateDoc(docRef, { read: bookData.read ? false : true });

  clearBookGrid();
  displayBooks();
}

async function deleteBook(e) {
  const idx = e.path[2].attributes["data-position"].value;

  let bookRef = doc(db, "books", idx);
  await deleteDoc(bookRef);

  clearBookGrid();
  displayBooks();
}

function clearBookGrid() {
  booksGrid.innerHTML = "";
}

window.onload = () => {
  displayBooks();
};
