import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  price: { type: String, required: true },
  inStock: { type: Number, required: true },
  ref: { type: String, required: true },
  review: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
});

export const BookModel = mongoose.model("books", BookSchema);
