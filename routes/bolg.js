const express = require("express");

const {
  generateBlog,
  addBlog,
  getBlog,
  getBlogs,
} = require("../controllers/blogController");
const router = express.Router();

router.post("/generateblog", generateBlog);
router.post("/addblog", addBlog);
router.get("/blog/:blogId", getBlog);
router.get("/blogs", getBlogs);

module.exports = router;
