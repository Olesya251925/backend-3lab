import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface ICourse extends Document {
  courseId: number;
  title: string;
  slug: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  published: boolean;
  author: string;
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  courseId: { type: Number, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
    required: true,
  },
  published: { type: Boolean, default: false },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

CourseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model<ICourse>("Course", CourseSchema);
