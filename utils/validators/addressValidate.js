import Joi from "joi";


const addressSchema = Joi.object({
  addressName: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "Address Name must be a string.",
    "string.empty": "Address Name is required.",
    "string.min": "Address Name must be at least 3 characters.",
    "string.max": "Address Name cannot be more than 50 characters.",
    "any.required": "Address Name is required.",
  }),
  address: Joi.string().trim().min(5).max(255).required().messages({
    "string.base": "Address must be a string.",
    "string.empty": "Address is required.",
    "string.min": "Address must be at least 5 characters.",
    "string.max": "Address cannot be more than 255 characters.",
    "any.required": "Address is required.",
  }),
  lat: Joi.number().min(-90).max(90).required().messages({
    "number.base": "Latitude must be a valid number.",
    "number.min": "Latitude must be at least -90.",
    "number.max": "Latitude must be at most 90.",
    "any.required": "Latitude is required.",
  }),
  lng: Joi.number().min(-180).max(180).required().messages({
    "number.base": "Longitude must be a valid number.",
    "number.min": "Longitude must be at least -180.",
    "number.max": "Longitude must be at most 180.",
    "any.required": "Longitude is required.",
  }),
});

export const validateAddress = (data) => {
  const { error } = addressSchema.validate(data, { abortEarly: false });
  if (error) {
    return {
      error: error.details.map((err) => err.message), // لیست خطاها
      isValid: false,
    };
  }
  return { isValid: true }; // داده‌های معتبر
};
