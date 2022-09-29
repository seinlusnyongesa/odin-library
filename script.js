//form div
const formDiv = document.querySelector(".form-div");

//add book btn
const addBookBtn = document.querySelector(".add-book");

//books grid

const booksGrid = document.querySelector(".books");

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

let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(book) {
  myLibrary = [...myLibrary, book];
}

function clearForm() {
  form.elements["author"].value = "";
  form.elements["title"].value = "";
  form.elements["pages"].value = "";
  form.elements["read"].checked = false;
}

function displayBooks() {
  for (let i = 0; i < myLibrary.length; i++) {
    let book = document.createElement("div");
    book.classList.add("book");
    let title = document.createElement("h3");
    let author = document.createElement("p");
    let pages = document.createElement("p");
    let read = document.createElement("p");
    btn = document.createElement("button");
    title.innerText = myLibrary[i].title;
    author.innerText = `by ${myLibrary[i].author}`;
    pages.innerText = `${myLibrary[i].pages} pages`;
    read.innerText = `${
      myLibrary[i].read ? "you have read this book" : "not read"
    }`;
    btn.innerText = "delete";
    btn.setAttribute("data-position", i);
    btn.addEventListener("click", (e) => deleteBook(e));

    book.appendChild(title);
    book.appendChild(author);
    book.appendChild(pages);
    book.appendChild(read);
    book.appendChild(btn);

    booksGrid.appendChild(book);
  }
}

function deleteBook(e) {
  const idx = e.target.attributes["data-position"].value;
  myLibrary.splice(idx, 1);
  clearBookGrid();
  displayBooks();
}

function clearBookGrid() {
  booksGrid.innerHTML = "";
}
