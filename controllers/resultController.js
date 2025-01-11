const connectToDatabase = require("../database/database");

exports.saveResult = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("results");
    const result = await collection.insertOne(req.body);
    res.status(201).send({ message: "Data saved successfully!", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to save data", error });
  }
};
