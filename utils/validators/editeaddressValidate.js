const Joi = require("joi");

const editAddressSchema = Joi.object({
  id: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.empty": "Address Id is required.",
    "string.base": "ID must be a string.",
    "string.empty": "ID is required.",
    "string.pattern.base": "ID must be a valid MongoDB ObjectId.",
  }),
  addressName: Joi.string().trim().min(3).max(50).messages({
    "string.base": "Address Name must be a string.",
    "string.min": "Address Name must be at least 3 characters.",
    "string.max": "Address Name cannot be more than 50 characters.",
  }),
  address: Joi.string().trim().min(5).max(255).messages({
    "string.base": "Address must be a string.",
    "string.min": "Address must be at least 5 characters.",
    "string.max": "Address cannot be more than 255 characters.",
  }),
  lat: Joi.number().min(-90).max(90).messages({
    "number.base": "Latitude must be a valid number.",
    "number.min": "Latitude must be at least -90.",
    "number.max": "Latitude must be at most 90.",
  }),
  lng: Joi.number().min(-180).max(180).messages({
    "number.base": "Longitude must be a valid number.",
    "number.min": "Longitude must be at least -180.",
    "number.max": "Longitude must be at most 180.",
  }),
});

exports.validateEditAddress = (data) => {
  const { error } = editAddressSchema.validate(data, { abortEarly: true });
  if (error) {
    return {
      error: error.details.map((err) => err.message), // لیست خطاها
      isValid: false,
    };
  }
  return { isValid: true }; // داده‌های معتبر
};