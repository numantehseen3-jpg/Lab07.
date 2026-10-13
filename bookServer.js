
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE = path.join(__dirname, "books.json");

// Read books from JSON file
let books = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
);

// Save updated books to JSON file
function saveBooks() {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(books, null, 2),
        "utf8"
    );
}

// Validate book data
function isValidBook(title, author, price) {
    return (
        typeof title === "string" &&
        title.trim().length > 0 &&
        typeof author === "string" &&
        author.trim().length > 0 &&
        typeof price === "number" &&
        Number.isFinite(price) &&
        price > 0
    );
}

// GET: Return all books
app.get("/books", (req, res) => {
    res.status(200).json(books);
});

// GET: Return one book by ID
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(book);
});

// POST: Create a new book
app.post("/books", (req, res) => {
    const { title, author, price } = req.body || {};

    if (!isValidBook(title, author, price)) {
        return res.status(400).json({
            message: "Valid title, author and positive numeric price are required"
        });
    }

    const newId = books.length
        ? Math.max(...books.map(b => b.id)) + 1
        : 1;

    const newBook = {
        id: newId,
        title: title.trim(),
        author: author.trim(),
        price: price
    };

    books.push(newBook);

    try {
        saveBooks();
    } catch (error) {
        books.pop();
        return res.status(500).json({
            message: "Could not save book"
        });
    }

    return res.status(201).json(newBook);
});

// PUT: Update an existing book
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body || {};

    if (!isValidBook(title, author, price)) {
        return res.status(400).json({
            message: "Valid title, author and positive numeric price are required"
        });
    }

    const oldBook = books[index];

    books[index] = {
        id: oldBook.id,
        title: title.trim(),
        author: author.trim(),
        price: price
    };

    try {
        saveBooks();
    } catch (error) {
        books[index] = oldBook;
        return res.status(500).json({
            message: "Could not update book"
        });
    }

    return res.status(200).json(books[index]);
});

// DELETE: Remove a book
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books[index];

    books.splice(index, 1);

    try {
        saveBooks();
    } catch (error) {
        books.splice(index, 0, deletedBook);
        return res.status(500).json({
            message: "Could not delete book"
        });
    }

    return res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Book API running at http://localhost:${PORT}`);
});
