import mongoose from "mongoose";

const conn = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}split_db`);
    console.log("connection to database established");
  } catch (err) {
    console.log(err);
  }
};

export default conn;
