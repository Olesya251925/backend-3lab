import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; role: string }; // Определите здесь свойства, которые будут в user
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Нет токена, авторизация запрещена" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
      role: string;
    };
    req.user = decoded; // Теперь не используется any
    next();
  } catch (error) {
    console.error(error); // Добавлено для логирования ошибки
    res.status(401).json({ message: "Неверный токен" });
  }
};
