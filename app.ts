import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitizeHtml from "sanitize-html";
import dotenv from "dotenv";
import compression from "compression";

import userRoute from "./routes/user";
import addressRoute from "./routes/address";
import blogRoute from "./routes/blog";

dotenv.config();

const app: Express = express();

// create express app
app.set("trust proxy", 1);

// * Gzip Compression
app.use(
  compression({
    level: 7, // سطح فشرده‌سازی (بین 1 تا 9)
    threshold: 1024, // فقط فایل‌های بزرگ‌تر از 1KB فشرده بشن
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// use helmet HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
    frameguard: { action: "deny" }, // جلوگیری از Clickjacking
    referrerPolicy: { policy: "no-referrer" }, // جلوگیری از ارسال اطلاعات حساس
    crossOriginResourcePolicy: { policy: "same-origin" }, // جلوگیری از سرقت داده‌ها
  })
);

//  implementation of a rate limiting (DOS)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 دقیقه
  max: 500, // 50 درخواست در هر 10 دقیقه برای هر IP
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json({ limit: "1mb" }));

// difend (XSS)
app.use((req: Request, res: Response, next: NextFunction) => {
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
    origin: process.env.MY_FRONTEND_ORIGIN_USERSTASK || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

// statrt response
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Worldss!");
});

//* Routes
app.use("/users", userRoute);
app.use("/address", addressRoute);
app.use("/blog", blogRoute);

// handleing errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});

export default app;
