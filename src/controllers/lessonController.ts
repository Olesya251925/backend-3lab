import { Request, Response } from "express";
import Lesson from "../models/lesson";
import Counter from "../models/counterModel";
import Course from "../models/course";

// Получить все уроки
export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении уроков" });
  }
};

// Получить урок по ID
export const getLessonById = async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(req.params.id);
    const lesson = await Lesson.findOne({ id: lessonId });

    if (!lesson) return res.status(404).json({ error: "Урок не найден" });

    const course = await Course.findOne({ courseId: lesson.courseId });

    res.json({
      ...lesson.toObject(),
      course: course
        ? {
            courseId: course.courseId,
            title: course.title,
            description: course.description,
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении урока" });
  }
};

// Создать новый урок
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, content, videoUrl, courseId, order } = req.body;

    let newId;

    const existingLessons = await Lesson.find();
    const existingIds = existingLessons.map((lesson) => lesson.id);

    const maxId = Math.max(...existingIds, 0);
    const freeId =
      existingIds.find((id) => !existingIds.includes(id)) || maxId + 1;

    if (freeId) {
      newId = freeId;
    } else {
      const counter = await Counter.findOneAndUpdate(
        { _id: "lessonId" },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true },
      );
      newId = counter?.sequenceValue;
    }

    const newLesson = new Lesson({
      id: newId,
      title,
      content,
      videoUrl,
      courseId,
      order,
    });

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
    const updatedLesson = await Lesson.findOneAndUpdate(
      { id: parseInt(req.params.id) },
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
    const deletedLesson = await Lesson.findOneAndDelete({
      id: parseInt(req.params.id),
    });
    if (!deletedLesson)
      return res.status(404).json({ error: "Урок не найден" });

    res.json({ message: "Урок удалён" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при удалении урока" });
  }
};
