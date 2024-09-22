import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Successfully Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
