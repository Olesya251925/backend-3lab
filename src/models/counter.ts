import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document {
  sequenceValue: number;
}

const CounterSchema = new Schema<ICounter>({
  sequenceValue: { type: Number, default: 1 },
});

export const Counter = mongoose.model<ICounter>("Counter", CounterSchema);
