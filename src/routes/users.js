import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { userName, password } = req.body;

  const user = await UserModel.findOne({ userName });

  if (user) {
    return res.json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ userName, password: hashedPassword });
  newUser.save();
  res.json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  const user = await UserModel.findOne({ userName });
  const passwordIsValid =
    user && (await bcrypt.compare(password, user.password));

  if (!user) {
    return res.json({ message: "No account of that name exists" });
  } else if (!passwordIsValid) {
    return res.json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ id: user._id }, "books-dont-suck");
  res.json({ token, userId: user._id });
});

export { router as userRouter };
