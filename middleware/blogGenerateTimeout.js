export const setTimeoutMiddleware = (req, res, next) => {
  res.setTimeout(30000, () => {
    // 20 ثانیه فقط برای این روت
    console.error("⏳ Request timed out");
    if (!res.headersSent) {
      res.status(504).json({ error: "Request timed out" });
    }
  });
  next();
};
