import { Router } from "express";
import { getProfile, deleteUser } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.delete("/me", authMiddleware, deleteUser);

export default router;
