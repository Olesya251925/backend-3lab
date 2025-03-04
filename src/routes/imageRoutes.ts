import express, { Request, Response } from "express";
import upload from "../upload";

const router = express.Router();

interface CustomRequest extends Request {
  file?: Express.Multer.File;
}

const uploadImageHandler = (req: CustomRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: "Изображение не загружено" });
    return;
  }

  res.json({ imagePath: req.file.path });
};

router.post("/upload", upload.single("image"), uploadImageHandler);

export default router;
