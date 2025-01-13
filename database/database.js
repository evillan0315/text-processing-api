/* const { MongoClient } = require("mongodb");

const uri = process.env.DATABASE_URL;
let dbInstance;

async function connectToDatabase() {
  if (dbInstance) return dbInstance;

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    dbInstance = client.db();
    return dbInstance;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

module.exports = connectToDatabase; */
// Updated database to mongoose instead of native connection to MOngoDB
const mongoose = require("mongoose");

const connectToDatabase = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));
};

module.exports = connectToDatabase;
