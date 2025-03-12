import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { validateUser } from "../utils/validators/userValidate";
import { DecodedToken, verifyToken } from "../utils/AuthToken";
import { Request, Response, NextFunction } from "express";

// signup user
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password, job, email, firstname, lastname } = req.body;

    // بررسی وجود کاربر با ایمیل تکراری
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      password: hashedPassword,
      job,
      email,
      firstname,
      lastname,
    };

    const createdNewUser = await UserModel.create(newUser);
    res.status(201).json({ createdNewUser });
  } catch (error) {
    next(error);
  }
};

// login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    // existing email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // existing user
    const user = await UserModel.findOne({ email });
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
      process.env.MY_SECRET_USERSTASK as string,
      { expiresIn: "2d" } // تنظیم زمان انقضای توکن
    );
    const userIdHash = user._id.toString().slice(-6);

    res.cookie("auth_token", token, {
      httpOnly: true, // کوکی فقط در HTTP قابل دسترسی است (جلوگیری از XSS)
      secure: true, // فقط در HTTPS ارسال می‌شود
      sameSite: "none", // اجازه ارسال بین دامنه‌ای
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 روز اعتبار
    });
    // ارسال توکن و اطلاعات کاربر
    return res.status(200).json({
      message: "Login successful",
      token,
      userIdHash,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// send list of users
export const users = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Token validation
    const decodedToken: DecodedToken | null = verifyToken(req);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract page and limit from query parameters (defaults to page 1 and 10 users per page)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await UserModel.find()
      .select("-password -updatedAt")
      .populate("addresses") // اینجا آدرس‌ها رو اضافه کردیم
      .skip(skip)
      .limit(limit);

    // Count total users for pagination metadata
    const totalUsers = await UserModel.countDocuments();

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
export const user = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Token validation
    const decodedToken: DecodedToken | null = verifyToken(req);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.params;

    // find user by id
    const user = await UserModel.findById(userId).populate("addresses");
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
export const updateUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Token validation
    const decodedToken: DecodedToken | null = verifyToken(req);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get userId from request params
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find existing user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Could not find user" });
    }

    const { email: existUserEmail, _id: id } = user;

    // Validate email existence
    const existingEmailUser = await UserModel.findOne({
      email: req.body.email,
      _id: { $ne: id }, // Check if email exists but not for the same user
    });

    if (existingEmailUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Define update object
    const updateUser: any = {
      password: req.body?.password || undefined,
      job: req.body.job || undefined,
      email: req.body.email || undefined,
      firstname: req.body.firstname || undefined,
      lastname: req.body.lastname || undefined,
    };

    // Remove undefined items
    Object.keys(updateUser).forEach((key) => {
      const typedKey = key as keyof typeof updateUser;
      if (updateUser[typedKey] === undefined) {
        delete updateUser[typedKey];
      }
    });

    // If no fields to update, return error
    if (Object.keys(updateUser).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update user in database
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateUser },
      { new: true, runValidators: true } // `new: true` returns the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success message with updated data
    return res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    next(error);
  }
};

// delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // token validation
    const decodedToken: DecodedToken | null = verifyToken(req);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get userId from route parameter
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find and delete the user from the database
    const user = await UserModel.findByIdAndDelete(userId);
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
