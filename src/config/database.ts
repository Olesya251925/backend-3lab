import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Переменная MONGO_URI не задана в .env файле");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB подключен");
  } catch (error) {
    console.error("Ошибка подключения к MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
