import Joi from "joi";


const blogSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100).required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 5 characters.",
    "string.max": "Title cannot be more than 100 characters.",
  }),
  introduction: Joi.string().trim().min(10).required().messages({
    "string.base": "Introduction must be a string.",
    "string.empty": "Introduction is required.",
    "string.min": "Introduction must be at least 10 characters.",
  }),
  main_body: Joi.string().trim().min(50).required().messages({
    "string.base": "Main body must be a string.",
    "string.empty": "Main body is required.",
    "string.min": "Main body must be at least 50 characters.",
  }),
  conclusion: Joi.string().trim().min(10).required().messages({
    "string.base": "Conclusion must be a string.",
    "string.empty": "Conclusion is required.",
    "string.min": "Conclusion must be at least 10 characters.",
  }),
});

export const validateBlog = (data) => {
  const { error } = blogSchema.validate(data, { abortEarly: true });
  if (error) {
    return {
      error: error.details.map((err) => err.message), // لیست خطاها
      isValid: false,
    };
  }
  return { isValid: true }; // داده‌های معتبر
};
