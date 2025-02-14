const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

//* Database Connection
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MY_MONGO_URI_USERSTASK);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.log(`Error Connection To MongoDB: ${err}`);
    process.exit(1);
  }
};

//* Start app
const startServer = () => {
  const port = process.env.MY_PORT_USERSTASK || 3400;
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
};

const run = async () => {
  await connectToDB();
  startServer();
};

run();
