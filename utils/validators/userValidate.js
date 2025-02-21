import Joi from "joi";

const userSchema = Joi.object({
  firstname: Joi.string().trim().min(2).max(30).required().messages({
    "string.empty": "Firstname is required.",
    "string.min": "Firstname must be at least 2 characters.",
    "string.max": "Firstname cannot be more than 30 characters.",
  }),
  lastname: Joi.string().trim().min(2).max(30).required().messages({
    "string.empty": "Lastname is required.",
    "string.min": "Lastname must be at least 2 characters.",
    "string.max": "Lastname cannot be more than 30 characters.",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  job: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Job is required.",
    "string.min": "Job must be at least 3 characters.",
    "string.max": "Job cannot be more than 50 characters.",
  }),
  password: Joi.string().trim().min(8).max(100).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
    "string.max": "Password cannot be more than 100 characters.",
  }),
});

// Validation function that returns an error message if validation fails
export const validateUser = (data) => {
  const { error } = userSchema.validate(data, { abortEarly: true });
  if (error) {
    return {
      error: error.details[0].message, // Get the first error message
      isValid: false,
    };
  }
  return { isValid: true };
};
