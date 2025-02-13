const express = require("express");
const userRoute = require("./routes/user");
const addresRoute = require("./routes/address")
const cors = require("cors");

const app = express();
// Middleware for parsing JSON
app.use(express.json());
// * CORS Policy
app.use(
  cors({
    origin: "https://users-task-nu.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
//http://localhost:3000
//https://users-task-nu.vercel.app
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//* Routes
app.use("/users", userRoute);
app.use("/address", addresRoute);

module.exports = app;
