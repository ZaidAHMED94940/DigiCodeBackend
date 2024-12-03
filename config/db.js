const mongoose=require("mongoose");

const db = async () => {
    try {
      // Replace 'your_database_url' with the actual URL of your MongoDB database
      await mongoose.connect(`${process.env.MONGO_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connected successfully!");
    } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1); // Exit the process with failure code if DB connection fails
    }
  };
module.exports = db;