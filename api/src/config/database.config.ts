const mongoose = require("mongoose");

const connectDb = () => {
  return mongoose.connect(String(process.env.MONGO_DB));
};

export default connectDb;
