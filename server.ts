import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerDocs from "./swagger";

dotenv.config();

//* Database Connection
const connectToDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MY_MONGO_URI_USERSTASK;
    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`Error Connection To MongoDB: ${err}`);
    process.exit(1);
  }
};

//* Start app
const startServer = (): void => {
  swaggerDocs(app);
  const port = process.env.MY_PORT_USERSTASK
    ? parseInt(process.env.MY_PORT_USERSTASK, 10)
    : 3400;

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
};

//* Run the server
const run = async (): Promise<void> => {
  await connectToDB();
  startServer();
};

run();
