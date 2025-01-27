import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log("DATABASE CONNECTED ✅");
  } catch (error) {
    console.log("Database connection error"), error;
  }
};
