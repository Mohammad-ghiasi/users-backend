const express = require("express");
const userRoute = require("./routes/user");
const addressRoute = require("./routes/address");
const blogRoute = require("./routes/bolg");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitizeHtml = require("sanitize-html");
const dotenv = require("dotenv");
const app = express();
const server = require("http").createServer(app);
server.timeout = 30000;

dotenv.config();

// create express app
app.set("trust proxy", 1);

// use helmet HTTP Headers
app.use(helmet());

//  implementation of a rate limiting (DOS)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// difend (XSS)
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
    origin: process.env.MY_FRONTEND_ORIGIN_USERSTASK, // for production
    // origin: "http://localhost:3000", // for local
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use((err, req, res,) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
  next();
});

// statrt response
app.get("/", (req, res) => {
  res.send(`Hello, Worldss!`);
});

//* Routes
app.use("/users", userRoute);
app.use("/address", addressRoute);
app.use("/blog", blogRoute);

// handleing errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

module.exports = app;
