import express, { type Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/userModel"; // Import your User model with proper types

const router: Router = express.Router();
const SECRET_KEY = "your_secret_key";

interface CustomJwtPayload {
  id: string;
  username: string;
  role: string;
}

// 📌 1. Регистрация пользователя
const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, username, password, role } = req.body;

    if (!["student", "teacher"].includes(role)) {
      res.status(400).json({ message: "Неверная роль" });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Имя пользователя занято" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Log user addition to console
    console.log(`Пользователь добавлен: ${newUser.username} (${newUser.role})`);

    res.status(201).json({ message: "Пользователь зарегистрирован" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// 📌 2. Авторизация (вход)
const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = (await User.findOne({ username })) as IUser | null; // Ensure proper typing

    if (!user) {
      res.status(400).json({ message: "Неверный логин или пароль" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Неверный логин или пароль" });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// 📌 3. Получение информации о пользователе
const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Нет доступа" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
    const user = (await User.findById(decoded.id).select(
      "-password",
    )) as IUser | null;

    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Неверный токен" });
  }
};

// 📌 4. Удаление пользователя
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (await User.findByIdAndDelete(req.params.id)) as IUser | null;
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }
    res.json({ message: "Пользователь удален" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getUserInfo);
router.delete("/:id", deleteUser);

export default router;
