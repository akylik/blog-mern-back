import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js";
import { SECRET_JWT_KEY } from "../constants.js";


export const register = async (req, res) => {
  try {


    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); //алгоритм шифрування паролю
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET_JWT_KEY, // ключ шифрування токену
      {
        expiresIn: "30d", // час життя токену
      }
    );

    const { passwordHash, ...userData } = user._doc; // витягуємо дату юзеру без passwordHash

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);

    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      // помилка дублювання ключа
      res.status(400).json({
        msg: `User with email '${error.keyValue.email}' already exists.`,
      });
    } else {
      // інші помилки
      res.status(500).json({
        msg: "Failed to register",
      });
    }
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return req.status(404).json({ msg: "User is not found" });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(403).json({ msg: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      SECRET_JWT_KEY, // ключ шифрування токену
      {
        expiresIn: "30d", // час життя токену
      }
    );

    const { passwordHash, ...userData } = user._doc; // витягуємо дату юзеру без passwordHash

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Failed to login",
    });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({msg: 'User not found'});
    }

    const { passwordHash, ...userData } = user._doc; // витягуємо дату юзеру без passwordHash

    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: 'No access'});
  }
}