import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);

mongoose.connect(
  "mongodb+srv://emiliskleinas2003:qs9CgR2RZ0dCHuKn@book-data.2daegmi.mongodb.net/book-data?retryWrites=true&w=majority"
);

app.listen(3001, () => {
  console.log("Server started");
});
