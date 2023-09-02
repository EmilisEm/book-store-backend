import express from "express";
import { BookModel } from "../models/books.js";

const router = Express.router();

router.get("/download/data/books", async (req, res) => {
  const books = await BookModel.find({});

  if (books.length === 0) {
    return res.json({
      message: "No books found",
      data: [],
    });
  } else {
    return res.json({ data: books });
  }
});

router.get("/download/data/:bookId", async (req, res) => {
  const bookId = req.params.bookId;

  const bookToFind = await BookModel.findOne({ ref: bookId });

  bookToFind
    ? res.json({ data: bookToFind })
    : res.json({ message: "book not found" });
});

router.get("/download/data/filter", async (req, res) => {
  const bookRequirementsToMeet = req.data;

  console.log(bookRequirementsToMeet);

  const filteredBooks = await BookModel.find({ ...bookRequirementsToMeet });

  res.json({ data: filteredBooks });
});

export { router as bookRouter };
