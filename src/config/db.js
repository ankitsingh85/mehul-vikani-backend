const mongoose = require("mongoose");
const env = require("./env");

module.exports = async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri, { dbName: env.dbName });
    console.log(`MongoDB connected (db: ${env.dbName})`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
