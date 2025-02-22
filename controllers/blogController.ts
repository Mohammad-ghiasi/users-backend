import Blog from "../models/blogModel";
import User from "../models/userModel";
import axios from "axios";
import { DecodedToken, verifyToken } from "../utils/AuthToken";
import { validateBlog } from "../utils/validators/createBlogValidate";
import { validateBlogGenerate } from "../utils/validators/blogGeneratoeValidate";
import { promptLanguage } from "../utils/languagemanager/promtLanguage";
import { formatResponse } from "../utils/languagemanager/languageFormater";
import { Request, Response, NextFunction } from "express";

// create conent blog
export const generateBlog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // token validation
    const decodedToken: DecodedToken | null = verifyToken(req);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { isValid, error } = validateBlogGenerate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: error });
    }

    const { category, length, keywords, language } = req.body;

    if (
      !category ||
      !length ||
      !Array.isArray(keywords) ||
      keywords.length === 0
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    const prompt = promptLanguage(req.body);
    if (!prompt) {
      return res.status(400).json({ error: "Prompt generation failed" });
    }

    const response = await axios.post(
      process.env.MY_AI_ORIGIN as string,
      {
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MY_AI_APIKEY}` },
        timeout: 30000,
      }
    );
    const format = formatResponse(
      response.data.choices[0].message.content,
      language
    );

    res.status(200).json({ format });
  } catch (error: any) {
    console.error("❌ Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to generate article" });
  }
};

// careate a new blog on database
export const addBlog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // validate token
    const decodedToken: DecodedToken | null = verifyToken(req);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { userId } = decodedToken;

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
export const getBlog = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
  } catch (error: any) {
    console.error("Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch the blog" });
  }
};

// get all blogs
export const getBlogs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const blogs = await Blog.find().populate(
      "user",
      "firstname lastname email"
    ); // لیست بلاگ‌ها + اطلاعات نویسنده

    res.status(200).json({ blogs }); // مقالات رو برگردون
  } catch (error: any) {
    console.error("Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};
