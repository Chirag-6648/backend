import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose
      .connect(process.env.DATABASE_URL)
      .then(console.log("Connected to mongodb"));
    console.log("connection name : ", connectionInstance.connection.host);
  } catch (error) {
    console.log("error in connecting to database", error);
  }
};

export default connectDb;
