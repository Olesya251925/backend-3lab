import { Counter } from "./counter"; // Импорт модели счетчика

export async function getNextCourseId() {
  const updatedCounter = await Counter.findOneAndUpdate(
    {},
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }, // Создает документ, если его нет
  );
  return updatedCounter.sequenceValue;
}
