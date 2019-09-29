// Book class : Represents a book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
};

// UI class : Handle UI tasks
class UI {
    // making the functions static
    static displayBooks(){
        const books = Store.getBooks();     //  gets all the books from local storage

        // adds each book from the local storage to the UI
        books.forEach((book) => UI.addBookToList(book));
    }

    // adding book from the <form> to the local storage
    static addBookToList(book){
        const list = document.querySelector('#book-list');

        // to create a tr element
        const row = document.createElement('tr');

        // adding the columns to the row
        row.innerHTML = 
        `   <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class="btn btn-danger btn-sm delete">X</a></td>
        `

        list.appendChild(row);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(el){
        if(el.classList.contains('delete'))
            el.parentElement.parentElement.remove();
    }

    // alert message on deletion, addition
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;

        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        
        // parent_element.insertBefore(the_element_to_be_inserted, to_be_inserted_before);
        container.insertBefore(div, form);  

        // to set time limit to the message
        setTimeout(() => document.querySelector('.alert').remove(), 1550);
    }
}

// handling local storage
class Store{
    static getBooks(){
        let books;

        if(localStorage.getItem('books') === null)
            books = [];
        else
            books = JSON.parse(localStorage.getItem('books'));

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);

        // storage.setItem(keyName, keyValue);
        // A DOMString containing the name of the key you want to create/update.
        // A DOMString containing the value you want to give the key you are creating/updating.
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        // finds the book in the local storage and then
        books.forEach((book, index) => {
            if(book.isbn == isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event : Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event : To add a book
document.querySelector('#book-from').addEventListener('submit', (e)=>{
    // prevent actual submit
    e.preventDefault();

    // Get from values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill all the fileds', 'danger');
    }
    else{
        // instantiate a book
        const book = new Book(title, author, isbn);

        UI.addBookToList(book);

        Store.addBook(book);

        UI.showAlert('Book Added', 'success');

        UI.clearFields();
    }
});

document.querySelector('#book-list').addEventListener('click', (e)=>{
    UI.deleteBook(e.target);

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed', 'success');
})