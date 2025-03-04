import { Counter } from "./counter";

export async function getNextCourseId() {
  const updatedCounter = await Counter.findOneAndUpdate(
    {},
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true },
  );
  return updatedCounter.sequenceValue;
}
