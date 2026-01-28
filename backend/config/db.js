import mongoose from "mongoose";

const conn = async () => {
  try {
    console.log(process.env.MONGODB_URI);
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("connection to database established");
  } catch (err) {
    console.log(err);
    console.log("Cannot connect to database");
  }
};

export default conn;
