import Joi from "joi";

// اینترفیس برای تایپ داده‌های ورودی
interface BlogMeta {
  category: string;
  length: number;
  keywords: string[];
  language: "fa" | "en";
}

// تعریف `Joi` اسکیمای اعتبارسنجی
const blogMetaSchema = Joi.object<BlogMeta>({
  category: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Category is required.",
    "string.min": "Category must be at least 2 characters.",
    "string.max": "Category cannot be more than 50 characters.",
  }),
  length: Joi.number().min(30).max(1000).required().messages({
    "number.base": "Length must be a number.",
    "number.min": "Length must be at least 30 words.",
    "number.max": "Length cannot be more than 1000 words.",
  }),
  keywords: Joi.array()
    .items(Joi.string().trim().min(2).max(30))
    .min(1)
    .required()
    .messages({
      "array.base": "Keywords must be an array of strings.",
      "array.min": "At least one keyword is required.",
      "string.min": "Each keyword must be at least 2 characters.",
      "string.max": "Each keyword cannot be more than 30 characters.",
    }),
  language: Joi.string().valid("fa", "en").required().messages({
    "any.only": "Language must be either 'fa' (Persian) or 'en' (English).",
    "string.empty": "Language is required.",
  }),
});

// تابع اعتبارسنجی با تایپ مشخص
export const validateBlogGenerate = (data: BlogMeta) => {
  const { error } = blogMetaSchema.validate(data, { abortEarly: true });

  if (error) {
    return {
      error: error.details.map((err) => err.message), // لیست خطاها
      isValid: false,
    };
  }
  return { isValid: true }; // داده‌های معتبر
};
