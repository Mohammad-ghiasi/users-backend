const UserModle = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/AuthToken");
const crypto = require("crypto");
const { validateUser } = require("../utils/validators/userValidate");

// signup user
exports.signup = async (req, res, next) => {
  try {
    const { isValid, error } = validateUser(req.body);
    if (!isValid) {
      return res.status(400).json({ errors: error });
    }
    const { password, job, email, firstname, lastname } = req.body;

    // existing user
    const existUser = await UserModle.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      password: hashedPassword,
      job,
      email,
      firstname,
      lastname,
    };
    const createdNewUser = await UserModle.create(newUser);
    return res.status(201).json({ createdNewUser });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // existing email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // existing user
    const user = await UserModle.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // checking users password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.MY_SECRET_USERSTASK,
      //   process.env.MY_SECRET,
      { expiresIn: "2d" } // تنظیم زمان انقضای توکن
    );
    const userIdHash = user._id.toString().slice(-6);

    // ارسال توکن و اطلاعات کاربر
    return res.status(200).json({
      message: "Login successful",
      token,
      userIdHash,
      // user: {
      //   id: user._id,
      //   email: user.email,
      //   firstname: user.firstname,
      //   lastname: user.lastname,
      // },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// send list of users
exports.users = async (req, res, next) => {
  try {
    // Token validation
    verifyToken(req, res);

    // Extract page and limit from query parameters (defaults to page 1 and 10 users per page)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await UserModle.find()
      .select("-password -addresses -updatedAt")
      .skip(skip)
      .limit(limit);

    // Count total users for pagination metadata
    const totalUsers = await UserModle.countDocuments();

    // Return users with pagination metadata
    return res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        pageSize: users.length,
      },
    });
  } catch (error) {
    next(error);
    console.error(error);
  }
};

// send single user
exports.user = async (req, res, next) => {
  try {
    // Token validation
    verifyToken(req, res);

    const { userId } = req.params;

    // find user by id
    const user = await UserModle.findById(userId).populate("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
    console.error(error);
  }
};

// update users
exports.updateUsers = async (req, res, next) => {
  try {
    // token validation
    verifyToken(req, res);
    // get userId from query
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // existing user
    const { email: existUerEmail, _id: id } = await UserModle.findById(userId);
    if (!existUerEmail) {
      return res.status(400).json({ message: "Culd not find user" });
    }
    // validate email exist
    const validateEmai = await UserModle.find({
      email: req.body.email,
      _id: { $ne: id },
    });
    if (validateEmai.length > 0) {
      return res.status(400).json({ message: "Email alredy exist" });
    }

    const updateUser = {
      password: req.body.password || null,
      job: req.body.job || null,
      email: req.body.email || null,
      firstname: req.body.firstname || null,
      lastname: req.body.lastname || null,
    };
    // remove null items
    Object.keys(updateUser).forEach((key) => {
      if (updateUser[key] === null) {
        delete updateUser[key];
      }
    });
    // if all itemes will null return error
    if (Object.keys(updateUser).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    // update user in database
    const updatedUser = await UserModle.findByIdAndUpdate(
      userId,
      { $set: updateUser },
      { new: true, runValidators: true } // `new: true` برای بازگشت کاربر به‌روزرسانی‌شده
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // return success message with updated data
    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    next(error);
    console.error(error);
  }
};

// delete user
exports.deleteUser = async (req, res, next) => {
  try {
    // token validation
    verifyToken(req, res);

    // Get userId from route parameter
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find and delete the user from the database
    const user = await UserModle.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: `User with ID ${userId} deleted successfully` });
  } catch (error) {
    next(error);
    console.error(error);
  }
};
