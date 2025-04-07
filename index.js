const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

let books = [
    { id: 1, title: "Node.js Essentials", author: "John Doe", year: 2021 }
];

// Middleware to validate book data
function validateBook(req, res, next) {
    const { id, title, author, year } = req.body;
    if (!id || !title || !author || !year) {
        return res.status(400).json({ message: "All fields are required" });
    }
    next();
}

// Routes
app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
});

app.post('/books', validateBook, (req, res) => {
    const { id, title, author, year } = req.body;
    if (books.some(book => book.id === id)) {
        return res.status(400).json({ message: "Book with this ID already exists" });
    }
    const newBook = { id, title, author, year };
    books.push(newBook);
    res.status(201).json({ message: "Book added successfully", book: newBook });
});

app.put('/books/:id', validateBook, (req, res) => {
    const { id } = req.params;
    const { title, author, year } = req.body;
    const bookIndex = books.findIndex(book => book.id == id);
    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    books[bookIndex] = { id: Number(id), title, author, year };
    res.json({ message: "Book updated successfully", book: books[bookIndex] });
});

app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const bookIndex = books.findIndex(book => book.id == id);
    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }
    books.splice(bookIndex, 1);
    res.json({ message: "Book deleted successfully" });
});

app.get('/', (req, res) => {
    res.send("Welcome to the Library API!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
