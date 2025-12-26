import mongoose from "mongoose";

const conn = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/split_db");
    console.log("connection to database established");
  } catch (err) {
    console.log(err);
  }
};

export default conn;
