import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import slugify from "slugify";
import Course from "../models/course";
import { getNextCourseId } from "../models/utils"; // Импорт функции получения следующего courseId

// Получить все курсы
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      category,
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "asc",
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    // Поиск по названию
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Фильтрация по категории
    if (category) {
      filter.category = category;
    }

    // Получение общего количества курсов с учетом фильтров
    const count = await Course.countDocuments(filter);

    // Пагинация
    const currentPage = Number(page);
    const currentLimit = Number(limit);
    const skip = (currentPage - 1) * currentLimit;

    // Сортировка
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Получение курсов с учетом фильтров, сортировки и пагинации
    const courses = await Course.find(filter)
      .sort(sortOptions)
      .limit(currentLimit)
      .skip(skip);

    // Возвращаем общее количество и курсы
    res.json({
      totalCount: count,
      currentPage,
      totalPages: Math.ceil(count / currentLimit),
      courses,
    });
  } catch (error) {
    console.error("Ошибка при получении курсов:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получить курс по ID
export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await Course.findOne({ courseId: req.params.id });

    if (!course) {
      res.status(404).json({ message: "Курс не найден" });
      return;
    }

    res.json(course);
  },
);

// Создать курс
export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { title, description, price, image, category, level, author } =
        req.body;

      if (!title || !price || !image || !category || !author) {
        res.status(400).json({ message: "Обязательные поля не заполнены" });
        return;
      }

      const slug = slugify(title, { lower: true, strict: true });
      const existingCourse = await Course.findOne({ slug });

      if (existingCourse) {
        res
          .status(400)
          .json({ message: "Курс с таким названием уже существует" });
        return;
      }

      // Получение следующего courseId
      const courseId = await getNextCourseId();

      const newCourse = new Course({
        courseId,
        title,
        slug,
        description,
        price,
        image,
        category,
        level,
        author,
      });

      await newCourse.save();
      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Ошибка при создании курса:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  },
);

// Обновить курс по ID
export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedData = { ...req.body };

    if (updatedData.title) {
      updatedData.slug = slugify(updatedData.title, {
        lower: true,
        strict: true,
      });
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { courseId: req.params.id },
      updatedData,
      { new: true, runValidators: true },
    );

    if (!updatedCourse) {
      res.status(404).json({ message: "Курс не найден" });
      return;
    }

    res.json(updatedCourse);
  },
);

// Удалить курс по ID
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await Course.findOneAndDelete({ courseId: req.params.id });

    if (!course) {
      res.status(404).json({ message: "Курс не найден" });
      return;
    }

    res.json({ message: "Курс успешно удален" });
  },
);
