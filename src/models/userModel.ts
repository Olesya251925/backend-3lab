import mongoose, { type Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: "student" | "teacher";
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["student", "teacher"] },
  },
  {
    collection: "users",
  },
);

export default mongoose.model<IUser>("User", userSchema);
