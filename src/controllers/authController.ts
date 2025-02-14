// authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { firstName, lastName, login, password, role } = req.body;

    // Проверка на допустимость роли
    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Недопустимая роль" });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      login,
      password: hashedPassword,
      role,
    });

    // Сохранение нового пользователя
    await newUser.save();
    return res.status(201).json({ message: "Пользователь зарегистрирован" });
  } catch (error) {
    console.error(error); // Логирование ошибки для диагностики
    return res.status(500).json({ message: "Ошибка регистрации" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login });

    // Проверка на наличие пользователя и правильность пароля
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }

    // Генерация токена
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" },
    );
    return res.json({ token });
  } catch (error) {
    console.error(error); // Логирование ошибки для диагностики
    return res.status(500).json({ message: "Ошибка входа" });
  }
};
