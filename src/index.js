import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { userRouter } from "./routes/users.js";
import { GridFsStorage } from "multer-gridfs-storage";
import { MongoClient, GridFSBucket } from "mongodb";
import { bookRouter } from "./routes/books.js";

const url =
  "mongodb+srv://emiliskleinas2003:qs9CgR2RZ0dCHuKn@book-data.2daegmi.mongodb.net/book-data?retryWrites=true&w=majority";

const app = express();

app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(url);

app.use("/auth", userRouter);
app.use("/books", bookRouter);

const connection = mongoose.connect(url);

const storage = new GridFsStorage({
  db: connection,
  file: (req, file) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "photos",
        filename: `${Date.now()}_${file.originalname}`,
      };
    } else {
      return `${Date.now()}_${file.originalname}`;
    }
  },
});

const upload = multer({ storage });

app.post("/upload/image", upload.single("avatar"), (req, res) => {
  const file = req.file;

  res.send({
    message: "uploaded",
    id: file.id,
    name: file.filename,
    "Content-Type": file.contentType,
  });
});

app.get("/images", async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db("book-data");
    const images = database.collection("photos.files");
    const cursor = images.find({});
    const count = await images.countDocuments();
    console.log(count);
    if (count === 0) {
      return res.status(404).send({ message: "No images found!" });
    }

    const allImages = [];

    await cursor.forEach((image) => {
      allImages.push(image);
    });

    res.send({ files: allImages });
  } catch (err) {
    console.error(err);
    res.status(404).send({ message: "Failed to send images" });
  }
});

app.get("/image/:imageName", async (req, res) => {
  try {
    console.log(req.headers);
    await mongoClient.connect();
    const bookStoreDatabase = mongoClient.db("book-data");

    const imageBucket = new GridFSBucket(bookStoreDatabase, {
      bucketName: "photos",
    });

    imageBucket.openDownloadStreamByName(req.params.imageName).pipe(res);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: "Something went wrong!",
    });
  }
});

const server = app.listen(3001, () => {
  console.log("Server started");
});
