import { Router } from "express";
import authRouter from "../routes/authRoutes";
import userRouter from "../routes/userRoutes";
import courseRouter from "../routes/courseRoutes";
import lessonRouter from "../routes/lessonRoutes";
import tagRouter from "../routes/tagRoutes";
import commentRouter from "../routes/commentRoutes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/courses", courseRouter);
apiRouter.use("/lessons", lessonRouter);
apiRouter.use("/tags", tagRouter);
apiRouter.use("/comments", commentRouter);

export default apiRouter;
