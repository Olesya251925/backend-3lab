import express, { type Router, type Request, type Response } from "express";
import UserModel from "../models/User";
import bcrypt from "bcrypt";

const router: Router = express.Router();

// Регистрация пользователя
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, username, password, role } = req.body;

  // Валидация входящих данных
  if (!firstName || !lastName || !username || !password || !role) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  try {
    // Проверка на существование пользователя
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user." });
  }
});

export default router;
