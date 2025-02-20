const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const axios = require("axios");
const { verifyToken } = require("../utils/AuthToken");
const { validateBlog } = require("../utils/validators/createBlogValidate");
const {
  validateBlogGenerate,
} = require("../utils/validators/blogGeneratoeValidate");
const { promptLanguage } = require("../utils/languagemanager/promtLanguage");
const { formatResponse } = require("../utils/languagemanager/languageFormater");

// create conent blog
exports.generateBlog = async (req, res) => {
  try {
    const { userId } = verifyToken(req, res);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { isValid, error } = validateBlogGenerate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: error });
    }

    const { category, length, keywords, language } = req.body;

    if (!category || !length || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    const prompt = promptLanguage(req.body);
    if (!prompt) {
      return res.status(400).json({ error: "Prompt generation failed" });
    }

    const response = await axios.post(
      process.env.MY_AI_ORIGIN,
      {
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MY_AI_APIKEY}` },
      }
    );
    const format = formatResponse(response.data.choices[0].message.content, language);
    

   

    res.status(200).json({ format });
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to generate article" });
  }
};


// careate a new blog on database
exports.addBlog = async (req, res) => {
  try {
    const { userId } = verifyToken(req, res);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" }); // حتما return بنویس
    }

    const { isValid, error } = validateBlog(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: error }); // حتما return بنویس
    }

    const newBlog = await Blog.create({
      ...req.body,
      user: userId,
    });

    return res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog }); // return اضافه شد
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to create blog" }); // return اضافه شد
  }
};

// get all blog
exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params; // گرفتن ID از پارامترهای URL

    const blog = await Blog.findById(id).populate(
      "user",
      "firstname lastname email"
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ blog }); // ارسال مقاله پیدا شده
  } catch (error) {
    console.error("Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch the blog" });
  }
};

// get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate(
      "user",
      "firstname lastname email"
    ); // لیست بلاگ‌ها + اطلاعات نویسنده

    res.status(200).json({ blogs }); // مقالات رو برگردون
  } catch (error) {
    console.error("Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};
