import { Request, Response } from "express";
import User from "../models/User";

// Расширяем интерфейс Request для добавления user
interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка получения данных" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Пользователь удален" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка удаления" });
  }
};
