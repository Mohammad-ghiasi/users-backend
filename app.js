const express = require("express");
const userRoute = require("./routes/user");
const addressRoute = require("./routes/address");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitizeHtml = require("sanitize-html");
const dotenv = require("dotenv");

dotenv.config();

// create express app
const app = express();
app.set("trust proxy", 1);
app.use(express.json());

// use helmet HTTP Headers
app.use(helmet());

//  implementation of a rate limiting (DOS)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use((req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next();
  }

  req.body = JSON.parse(JSON.stringify(req.body), (key, value) =>
    typeof value === "string"
      ? sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
      : value
  );

  next();
});

// Middleware for parsing JSON
app.use(express.json());
// * CORS Policy
app.use(
  cors({
    origin: "https://users-task-nu.vercel.app",
    // origin: "http://localhost:3000",
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

// statrt response
app.get("/", (req, res) => {
  res.send(`Hello, Worldss! ${process.env.MY_MONGO_URI_USERSTASK}`);
});

//* Routes
app.use("/users", userRoute);
app.use("/address", addressRoute);

// handleing errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

module.exports = app;
