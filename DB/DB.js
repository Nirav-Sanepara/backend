const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MongoDB connection
    await mongoose.connect(process.env.DBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("connected to mongoDB");
  } catch (error) {
    console.error("Error", error.message);
  }
};

module.exports = connectDB; 