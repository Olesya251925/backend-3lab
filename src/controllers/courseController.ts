import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import slugify from "slugify";
import Course from "../models/course";
import { getNextCourseId } from "../models/utils";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import moment from "moment-timezone";
import Tag from "../models/tagModel";

// Получить все курсы
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      category,
      page = "1",
      limit = "3",
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
      const {
        title,
        description,
        price,
        image,
        category,
        level,
        author,
        tags,
        isFavorite,
      } = req.body;

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

      const courseId = await getNextCourseId();

      if (!fs.existsSync(image)) {
        res.status(400).json({ message: "Файл изображения не найден" });
        return;
      }

      const imageName = `${moment().tz("Asia/Kemerovo").format("YYYY-MM-DDTHH-mm-ss")}.png`;
      const uploadDir = path.join(__dirname, "..", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const imagePath = path.join(uploadDir, imageName);

      const watermarkPath = path.join(
        __dirname,
        "..",
        "assets",
        "watermark.png",
      );

      const resizedWatermarkBuffer = await sharp(watermarkPath)
        .resize({ width: 100 })
        .toBuffer();

      await sharp(image)
        .resize(800)
        .composite([{ input: resizedWatermarkBuffer, gravity: "southeast" }])
        .toFile(imagePath);

      const newCourse = new Course({
        courseId,
        title,
        slug,
        description,
        price,
        image: `/uploads/${imageName}`,
        category,
        level,
        author,
        tags: tags || [],
        isFavorited: isFavorite !== undefined ? isFavorite : false,
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
    try {
      const course = await Course.findOneAndDelete({ courseId: req.params.id });

      if (!course) {
        res.status(404).json({ message: "Курс не найден" });
        return;
      }

      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(course.image),
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({ message: "Курс успешно удален" });
    } catch (error) {
      console.error("Ошибка при удалении курса:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  },
);

// Добавить курс в избранное
export const addToFavorites = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    console.log(`Запрос на добавление курса в избранное с ID: ${id}`);

    const course = await Course.findOne({ courseId: id });
    if (!course) {
      console.log("Курс не найден");
      res.status(404).json({ message: "Курс не найден" });
      return;
    }

    course.isFavorited = true;
    await course.save();

    console.log("Курс добавлен в избранное:", course);
    res.json({ message: "Курс добавлен в избранное", course });
  },
);

// Удалить курс из избранного
export const removeFromFavorites = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    console.log(`Запрос на удаление курса из избранного с ID: ${id}`);

    const course = await Course.findOne({ courseId: id });
    if (!course) {
      console.log("Курс не найден");
      res.status(404).json({ message: "Курс не найден" });
      return;
    }

    course.isFavorited = false;
    await course.save();

    console.log("Курс удален из избранного:", course);
    res.json({ message: "Курс удален из избранного", course });
  },
);

export const getCourseWithTags = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const course = await Course.findOne({ courseId: id });

    if (!course) {
      res.status(404).json({ message: "Курс не найден" });
      return;
    }

    const tags = await Tag.find({ tagId: { $in: course.tags } });

    console.log("Полученные теги:");
    tags.forEach((tag) => {
      console.log(`TagId: ${tag.tagId}, Name: ${tag.name}`);
    });

    const courseWithTags = { ...course.toObject(), tags };

    res.json(courseWithTags);
  },
);
