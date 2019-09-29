// Book class : Represents a book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
};

// UI class : Handle UI taks
class UI {
    // cause we dont wanna instantitate the classes .'. we make them static
    static displayBooks(){
        const books = Store.getBooks();

        // loop through the list and add each book from the local storage to the UI
        books.forEach((book) => UI.addBookToList(book));
    }

    // this static functions adds the book to the local storage
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        // to create a tr element
        const row = document.createElement('tr');

        // adding the columns to the row that ae are inserting
        row.innerHTML = 
        `   <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td> 
        `;

        list.appendChild(row);
    }

    // this clear the fileds
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    // deletes a book from the list
    static deleteBook(el){
        if(el.classList.contains('delete'))
            el.parentElement.parentElement.remove();
    }

    // alert message : To show alert message when the fields are not filled
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;         //..gives it the bootstrap class for danger

        div.appendChild(document.createTextNode(message));  // appends a text-node into the div element

        // to insert
        const container = document.querySelector('.container'); //..parent element
        const form = document.querySelector('#book-form');      // to insert before
        container.insertBefore(div, form);      //  insert div before form

        // to remove the message after 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 1550);
    }
}
 
// local storage
// Store Class : Handles storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();         //  get books from class
        books.push(book);                       //  add new book to the list of books
        localStorage.setItem('books', JSON.stringify(books));   // we need to parse the object to string using JSON.stringify()
    }

    static removeBook(isbn){
        const books = Store.getBooks();     // get all the books in the store

        // iterate to find the book and if there than remove it
        books.forEach((book, index) => {
            if(book.isbn == isbn) {
                books.splice(index, 1);         //  removing the book
            }
        });

        // now we will store the new books list into the local storage
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event : Display Books
// basically it is here to display the books in the storage
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event : Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=> {
    
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate  
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill all the fileds', 'danger');
    }
    else {
        // Installate a book
        const book = new Book(title, author, isbn);

        // Add book to UI
        UI.addBookToList(book);

        // add book to store
        Store.addBook(book)

        // show success message
        UI.showAlert('Book Added', 'success')

        // clear fields
        UI.clearFields();
    }
});

// Event : Remove a Book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    // deleting book from UI
    UI.deleteBook(e.target);       

    // remove book from storage
    // In order to pass the isbn, 
    // we first have to go to the parent element of the delete button using parentElement
    // from there we wil go the elemenet above it using previousElementSibling
    // retrieve the isbn value using textContent
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show success message
    UI.showAlert('Book Removed', 'success')
});