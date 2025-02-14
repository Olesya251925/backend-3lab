import { Router, type Request, type Response } from "express";
import {
  register,
  login,
  getUserByLogin,
  deleteUser,
} from "../controllers/authController";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  await register(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
  await login(req, res);
});

// Новый маршрут для получения данных о пользователе по логину
router.get("/me", async (req: Request, res: Response) => {
  await getUserByLogin(req, res);
});

// Новый маршрут для жесткого удаления пользователя
router.delete("/delete", async (req: Request, res: Response) => {
  await deleteUser(req, res);
});

export default router;
