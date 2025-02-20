const express = require("express");

const {
  generateBlog,
  addBlog,
  getBlog,
  getBlogs,
} = require("../controllers/blogController");
const { setTimeoutMiddleware } = require("../middleware/blogGenerateTimeout");
const router = express.Router();

router.post("/generateblog", setTimeoutMiddleware, generateBlog);
router.post("/addblog", addBlog);
router.get("/blog/:blogId", getBlog);
router.get("/blogs", getBlogs);

module.exports = router;
