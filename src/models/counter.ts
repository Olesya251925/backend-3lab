import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document {
  sequenceValue: number;
}

const CounterSchema = new Schema<ICounter>({
  sequenceValue: { type: Number, default: 0 },
});

export const Counter = mongoose.model<ICounter>("Courses", CounterSchema);
