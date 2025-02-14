import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/backendWeb";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const db = mongoose.connection;

    if (!db.collections["users"]) {
      await db.createCollection("users");
    }

    console.log("MongoDB подключен");
  } catch (error) {
    console.error("Ошибка подключения к MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
