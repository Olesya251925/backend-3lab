import { Request, Response } from "express";
import Lesson from "../models/lesson";

// Получить все уроки
export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find().populate("course");
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении уроков" });
  }
};

// Получить урок по ID
export const getLessonById = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course");
    if (!lesson) return res.status(404).json({ error: "Урок не найден" });
    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении урока" });
  }
};

// Создать новый урок
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, content, videoUrl, course, order } = req.body;
    const newLesson = new Lesson({ title, content, videoUrl, course, order });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при создании урока" });
  }
};

// Обновить урок
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedLesson)
      return res.status(404).json({ error: "Урок не найден" });
    res.json(updatedLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при обновлении урока" });
  }
};

// Удалить урок
export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson)
      return res.status(404).json({ error: "Урок не найден" });
    res.json({ message: "Урок удалён" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при удалении урока" });
  }
};
