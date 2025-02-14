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

    // Проверка наличия всех необходимых полей
    if (!firstName || !lastName || !login || !password || !role) {
      return res
        .status(400)
        .json({ message: "Все поля обязательны для заполнения" });
    }

    // Проверка на допустимость роли
    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Недопустимая роль" });
    }

    // Проверка на уникальность логина
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ message: "Логин уже занят" });
    }

    if (!login.trim()) {
      // Проверка на пустую строку
      return res.status(400).json({ message: "Логин не может быть пустым" });
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
    if (error instanceof Error) {
      console.error("Ошибка при регистрации:", error.message);
      return res
        .status(500)
        .json({ message: "Ошибка регистрации", error: error.message });
    } else {
      console.error("Неизвестная ошибка:", error);
      return res.status(500).json({ message: "Ошибка регистрации" });
    }
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

// Получение данных пользователя по логину
export const getUserByLogin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { login } = req.query; // Получаем логин из параметров запроса

    if (!login) {
      return res.status(400).json({ message: "Логин не предоставлен" });
    }

    const user = await User.findOne({ login }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Возвращаем необходимые данные о пользователе
    return res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      login: user.login,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка получения данных" });
  }
};

// Жесткое удаление пользователя
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { login } = req.body; // Получаем логин из тела запроса

    if (!login) {
      return res.status(400).json({ message: "Логин не предоставлен" });
    }

    const user = await User.findOneAndDelete({ login }); // Найти и удалить пользователя
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.json({ message: "Пользователь успешно удален" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка удаления пользователя" });
  }
};
