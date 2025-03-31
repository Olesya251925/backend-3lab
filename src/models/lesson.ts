import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  content?: string;
  videoUrl?: string;
  course: mongoose.Types.ObjectId;
  order?: number;
  createdAt: Date;
}

const LessonSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    videoUrl: { type: String },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<ILesson>("Lesson", LessonSchema);
