import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения Express
const app = express();

// Определение порта
const PORT = process.env.PORT || 3000;

// Подключение к базе данных
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Обработка ошибок
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Что-то пошло не так на сервере!" });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
