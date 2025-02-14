import { Request, Response } from "express";
import User from "../models/userModel";

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, username, password, role } = req.body;

  try {
    const newUser = new User({ firstName, lastName, username, password, role });
    await newUser.save();
    res.status(201).json({ message: "Регистрация успешна!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: "Ошибка регистрации: " + error.message });
    } else {
      res.status(400).json({ message: "Ошибка регистрации" });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль." });
    }
    res.json({ message: "Успешный вход!", token: "mock_token" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Ошибка входа: " + error.message });
    } else {
      res.status(500).json({ message: "Ошибка входа" });
    }
  }
};
