import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonController";

const router = express.Router();

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

router.get("/", asyncHandler(getLessons as AsyncRequestHandler));
router.get("/:id", asyncHandler(getLessonById as AsyncRequestHandler));
router.post("/", asyncHandler(createLesson as AsyncRequestHandler));
router.put("/:id", asyncHandler(updateLesson as AsyncRequestHandler));
router.delete("/:id", asyncHandler(deleteLesson as AsyncRequestHandler));
export default router;
