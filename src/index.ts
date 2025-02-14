import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import connectDB from "./database/db";
import { config } from "dotenv";

// Загружаем переменные окружения из .env файла
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к базе данных
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static(path.join(__dirname, "../src/views")));
app.use(express.static(path.join(__dirname, "../src/styles")));
app.use(express.static(path.join(__dirname, "../src/scripts")));

// Маршруты API
app.use("/api/users", userRoutes);

// Маршрут для корневого пути
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/views/login.html"));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
