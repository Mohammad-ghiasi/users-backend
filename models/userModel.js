const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // اعتبارسنجی ایمیل
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


const userModel = mongoose.model("MyUsers", userSchema);


module.exports = userModel;
