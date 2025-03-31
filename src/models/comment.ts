import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  id: number;
  user: number;
  lesson: number;
  text: string;
}

const CommentSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    user: { type: Number, required: true },
    lesson: { type: Number, required: true },
    text: { type: String, required: true, maxlength: 255 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<IComment>("Comment", CommentSchema);
