const { MongoClient } = require("mongodb");

//const uri = process.env.DATABASE_URL;
const uri = "mongodb+srv://evillan0315:WD0qQFMYxt6jLBpO@dashboard.ccz9k.mongodb.net/recruitment?retryWrites=true&w=majority&appName=Dashboard&ssl=true";

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

module.exports = connectToDatabase;
