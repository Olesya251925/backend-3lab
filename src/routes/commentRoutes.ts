import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  getCommentsByLessonId,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = express.Router();

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

router.get(
  "/:lessonId",
  asyncHandler(getCommentsByLessonId as AsyncRequestHandler),
);

router.post("/", asyncHandler(createComment as AsyncRequestHandler));

router.put("/:id", asyncHandler(updateComment as AsyncRequestHandler));

router.delete("/:id", asyncHandler(deleteComment as AsyncRequestHandler));

export default router;
