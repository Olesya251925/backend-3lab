import express from "express";
import asyncHandler from "express-async-handler";
import * as courseController from "../controllers/courseController";

const router = express.Router();

router.get("/", asyncHandler(courseController.getCourses));
router.get("/:id", asyncHandler(courseController.getCourseById));
router.post("/", asyncHandler(courseController.createCourse));
router.put("/:id", asyncHandler(courseController.updateCourse));
router.delete("/:id", asyncHandler(courseController.deleteCourse));

export default router;
