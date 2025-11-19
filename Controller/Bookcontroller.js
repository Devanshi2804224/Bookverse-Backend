import Book from "../Models/Bookschema.js";
import path from "path";

// ---------------------------
// CREATE NEW BOOK
// ---------------------------
export const createBook = async (req, res) => {
  try {
    const { title, author, bio, price, category, badge, rating } = req.body;

    let imagePath = "";
    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
    }

    const book = await Book.create({
      title,
      author,
      bio,
      price,
      category,
      image: imagePath,
      badge,
      rating,
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------
// GET ALL BOOKS
// ---------------------------
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------
// GET ONE BOOK
// ---------------------------
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book)
      return res.status(404).json({ success: false, message: "Book not found" });

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------
// UPDATE BOOK
// ---------------------------
export const updateBook = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      updateData.image = "/uploads/" + req.file.filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Book updated successfully",
      updatedBook,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------
// DELETE BOOK
// ---------------------------
export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
