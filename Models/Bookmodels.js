import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
    },
    bio: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    category: {
      type: String,
      enum: ["Fiction", "Self Help", "Finance", "Philosophy", "Other"],
      default: "Other",
    },
    image: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
