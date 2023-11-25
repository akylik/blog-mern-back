import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

import { registerValidation, loginValidation, postCreateValidation } from "./validations/validation.js";
import { UserController, PostController } from "./controllers/index.js";
import {checkAuth, handleValidationErrors} from "./utils/index.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB connect");
  })
  .catch((err) => {
    console.log("DB error:", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads'); // завантажувати картинки в дерикторію uploads
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname); // присвоюємо назву оригінального файлу
  },
});

const upload = multer({storage});  // створюємо хранилище

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.get("/tags", PostController.getLastTags);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
});


app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server listening on port 4444");
});
