import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/AuthToken.js";
// signup user
export const signup = async (req, res, next) => {
    try {
        // const { error, isValid } = validateUser(req.body);
        // if (!isValid) {
        //   return res.status(400).json({ errors: error });
        // }
        const { password, job, email, firstname, lastname } = req.body;
        // existing user
        const existUser = await UserModel.findOne({ email });
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
        const createdNewUser = await UserModel.create(newUser);
        return res.status(201).json({ createdNewUser });
    }
    catch (error) {
        next(error);
        console.log(error);
    }
};
// login user
export const login = async (req, res, next) => {
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
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.MY_SECRET_USERSTASK, 
        //   process.env.MY_SECRET,
        { expiresIn: "2d" });
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
    }
    catch (error) {
        next(error);
        console.log(error);
    }
};
// send list of users
export const users = async (req, res, next) => {
    try {
        // Token validation
        verifyToken(req, res);
        // Extract page and limit from query parameters (defaults to page 1 and 10 users per page)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Calculate skip for pagination
        const skip = (page - 1) * limit;
        // Fetch users with pagination
        const users = await UserModel.find()
            .select("-password -addresses -updatedAt")
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
    }
    catch (error) {
        next(error);
        console.error(error);
    }
};
// send single user
export const user = async (req, res, next) => {
    try {
        // Token validation
        verifyToken(req, res);
        const { userId } = req.params;
        // find user by id
        const user = await UserModel.findById(userId).populate("addresses");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Return user
        return res.status(200).json({ user });
    }
    catch (error) {
        next(error);
        console.error(error);
    }
};
// update users
export const updateUsers = async (req, res, next) => {
    try {
        // token validation
        verifyToken(req, res);
        // get userId from query
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // existing user
        const { email: existUerEmail, _id: id } = await UserModel.findById(userId);
        if (!existUerEmail) {
            return res.status(400).json({ message: "Culd not find user" });
        }
        // validate email exist
        const validateEmai = await UserModel.find({
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
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: updateUser }, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // return success message with updated data
        return res
            .status(200)
            .json({ message: "User updated successfully", updatedUser });
    }
    catch (error) {
        next(error);
        console.error(error);
    }
};
// delete user
export const deleteUser = async (req, res, next) => {
    try {
        // token validation
        verifyToken(req, res);
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
    }
    catch (error) {
        next(error);
        console.error(error);
    }
};
