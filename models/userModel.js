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
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MyAddress", // ارتباط با مدل آدرس
      },
    ],
  },
  { timestamps: true }
);

// delete address for deleted user
userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id;
  await mongoose.model("MyAddress").deleteMany({ user: userId });
  next();
});

const User = mongoose.model("MyUsers", userSchema);

module.exports = User;
