import express from "express";
import Book from "../Models/Bookmodels.js";
import upload from "../Middleware/Upload.js"; // Multer upload

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🚀 TEMPORARY BULK INSERT ROUTE - Run once to insert all 20 books in MongoDB */
/* -------------------------------------------------------------------------- */
router.post("/bulk-insert", async (req, res) => {
  const books = [
    { title: "The Midnight Library", author: "Matt Haig", bio: "Mental health & fiction", price: 499, category: "Fiction", image: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg", badge: "New", rating: 4.5 },
    { title: "Atomic Habits", author: "James Clear", bio: "Productivity & habits", price: 699, category: "Self Help", image: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg", badge: "Bestseller", rating: 4.8 },
    { title: "The Psychology of Money", author: "Morgan Housel", bio: "Finance writer & speaker", price: 549, category: "Finance", image: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg", badge: "Bestseller", rating: 4.7 },
    { title: "Ikigai", author: "Héctor García", bio: "Happiness & purpose", price: 399, category: "Philosophy", image: "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg", badge: "New", rating: 4.6 },
    { title: "2 States", author: "Chetan Bhagat", bio: "Romantic fiction", price: 299, category: "Fiction", image: "https://covers.openlibrary.org/b/isbn/9788129135520-L.jpg", badge: "New", rating: 4.2 },
    { title: "It Ends With Us", author: "Colleen Hoover", bio: "Romantic & emotional", price: 799, category: "Fiction", image: "https://covers.openlibrary.org/b/isbn/9781501110368-L.jpg", badge: "Bestseller", rating: 4.9 },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", bio: "Classic literature", price: 499, category: "Fiction", image: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg", rating: 4.3 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", bio: "Classic literature", price: 399, category: "Fiction", image: "https://covers.openlibrary.org/b/isbn/9780060935467-L.jpg", rating: 4.8 },
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", bio: "Finance & investment", price: 599, category: "Finance", image: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg", rating: 4.5 },
    { title: "The Alchemist", author: "Paulo Coelho", bio: "Philosophy & journey", price: 349, category: "Philosophy", image: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg", rating: 4.6 },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", bio: "Psychology", price: 699, category: "Self Help", image: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg", rating: 4.7 },
    { title: "Sapiens", author: "Yuval Noah Harari", bio: "History & philosophy", price: 799, category: "Philosophy", image: "https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg", rating: 4.9 },
    { title: "Educated", author: "Tara Westover", bio: "Memoir", price: 599, category: "Self Help", image: "https://covers.openlibrary.org/b/isbn/9780525589983-L.jpg", rating: 4.7 },
    { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", bio: "Self development", price: 499, category: "Self Help", image: "https://covers.openlibrary.org/b/isbn/9780743269513-L.jpg", rating: 4.8 },
    { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", bio: "Self improvement", price: 449, category: "Self Help", image: "https://covers.openlibrary.org/b/isbn/9780062641540-L.jpg", rating: 4.6 },
    { title: "The Fault in Our Stars", author: "John Green", bio: "Young adult fiction", price: 399, category: "Fiction", image: "https://covers.openlibrary.org/b/isbn/9780525478812-L.jpg", rating: 4.7 },
    { title: "The Power of Now", author: "Eckhart Tolle", bio: "Spirituality", price: 499, category: "Philosophy", image: "https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg", rating: 4.8 },
    { title: "How to Win Friends & Influence People", author: "Dale Carnegie", bio: "Self Help classic", price: 349, category: "Self Help", image: "https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg", rating: 4.7 },
    { title: "1984", author: "George Orwell", bio: "Dystopian classic", price: 399, category: "Fiction", image: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg", rating: 4.6 },
    { title: "Brida", author: "Paulo Coelho", bio: "Philosophical fiction", price: 399, category: "Philosophy", image: "https://covers.openlibrary.org/b/isbn/9780061762705-L.jpg", rating: 4.4 },
  ];

  try {
    await Book.insertMany(books);
    res.status(201).json({ message: "20 books added successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/* 🧠 CRUD ROUTES                                                            */
/* -------------------------------------------------------------------------- */

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/* 🔥 FIXED: ADD BOOK WITH MULTER IMAGE UPLOAD                                */
/* -------------------------------------------------------------------------- */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const newBook = new Book({
      ...req.body,
      image: imageURL,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error("POST BOOK ERROR:", error);
    res.status(400).json({ message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/* UPDATE BOOK                                                                */
/* -------------------------------------------------------------------------- */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let imageURL = req.body.image;

    if (req.file) {
      imageURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imageURL },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/* DELETE BOOK                                                                */
/* -------------------------------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
