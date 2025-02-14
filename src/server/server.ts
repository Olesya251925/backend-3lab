import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "../database/db"; // Убедитесь, что путь правильный
import userRoutes from "../routes/userRoutes"; // Убедитесь, что путь правильный

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Обслуживание статических файлов из директории 'styles' и 'scripts'
app.use("/styles", express.static(path.join(__dirname, "styles"))); // Для стилей
app.use("/scripts", express.static(path.join(__dirname, "scripts"))); // Для скриптов

// Маршруты
app.use("/api/users", userRoutes);

// Отправка HTML-файла
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
