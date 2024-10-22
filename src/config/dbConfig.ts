import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGODB_STRING as string
    );
    console.log("Database is connected:", connect.connection.name);
  } catch (err) {
    console.log("Database connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
