const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const axios = require("axios");
const { verifyToken } = require("../utils/AuthToken");
const { validateBlog } = require("../utils/validators/createBlogValidate");
const { validateBlogGenerate } = require("../utils/validators/blogGeneratoeValidate");

// create conent blog
exports.generateBlog = async (req, res) => {
  try {
    const { userId } = verifyToken(req, res);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { isValid, error } = validateBlogGenerate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: error }); // حتما return بنویس
    }

    const { category, length, keywords } = req.body;

    if (
      !category ||
      !length ||
      !Array.isArray(keywords) ||
      keywords.length === 0
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // ⬇️ پرامپت ساختاریافته
    const prompt = `Write a well-structured ${length}-word article about **${category}** in a clear and professional format.
        The article should include the following sections:

        **Title:** Provide a compelling and relevant title for the article.

        **Introduction:**
        - Write a concise introduction that briefly explains the topic and its significance.

        **Main Body:**
        - Present the key aspects of the topic in a well-organized manner.
        - Use paragraphs to structure the information logically.
        - Provide relevant examples or arguments if necessary.

        **Conclusion:**
        - Summarize the key points discussed in the article.
        - End with a strong and engaging closing statement.

        Ensure the article includes these keywords: ${keywords.join(", ")}.
        The content should be professional, readable, and engaging.`;

    const response = await axios.post(
      process.env.MY_AI_ORIGIN,
      {
        model: "mistral-medium",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MY_AI_APIKEY}` },
      }
    );

    // استخراج متن مقاله از پاسخ API
    const article = response.data.choices[0].message.content;

    const formattedResponse = {
      title:
        response.data.choices[0].message.content.match(
          /(?<=\*\*Title:\*\*\s)(.*)/
        )?.[0] || "",
      introduction:
        response.data.choices[0].message.content.match(
          /(?<=\*\*Introduction:\*\*\s)([\s\S]*?)(?=\*\*Main Body:\*\*)/
        )?.[0] || "",
      main_body:
        response.data.choices[0].message.content.match(
          /(?<=\*\*Main Body:\*\*\s)([\s\S]*?)(?=\*\*Conclusion:\*\*)/
        )?.[0] || "",
      conclusion:
        response.data.choices[0].message.content.match(
          /(?<=\*\*Conclusion:\*\*\s)([\s\S]*)/
        )?.[0] || "",
    };

    const exampleresponse = {
      formattedResponse: {
        title:
          "The Power of Artificial Intelligence: Exploring Neural Networks and Language Models",
        introduction:
          "Artificial Intelligence (AI) has become an increasingly prominent force in modern society, reshaping industries and transforming the way we live, work, and communicate. Among its most influential components are neural networks and language models, which enable machines to learn, understand, and respond to human language in remarkable ways.\n\n",
        main_body:
          '\n*Neural Networks*\nNeural networks, inspired by the human brain\'s structure, are a fundamental aspect of AI, facilitating یادگیری ماشین (machine learning). They consist of interconnected nodes or "neurons" that process information and make decisions based on their inputs. By analyzing large datasets and identifying patterns, these networks can learn to recognize images, sounds, and other complex data, driving advancements in fields like computer vision, speech recognition, and natural language processing.\n\n*Language Models*\nLanguage models, a specific application of neural networks, focus on understanding and generating human language. These مدل‌های زبانی (language models) learn to predict the likelihood of a word or phrase based on its context, enabling them to generate coherent and contextually appropriate responses. They power various AI applications, including virtual assistants, chatbots, and translation services, making human-machine interactions more natural and intuitive.\n\n',
        conclusion:
          "The rapid advancements in AI, particularly in neural networks and language models, have unlocked new possibilities for human-machine collaboration. As these technologies continue to evolve, they will undoubtedly reshape the way we interact with the world, driving innovation and growth across industries. By harnessing the power of شبکه عصبی (neural networks) and مدل‌های زبانی (language models), we can unlock unprecedented opportunities and create a more connected, intelligent, and efficient future.",
      },
    };

    res.status(200).json({ formattedResponse });
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to generate article" });
    next(error);
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
