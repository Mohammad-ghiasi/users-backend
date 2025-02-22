import UserModel from "../models/userModel.js";
import AddressModel from "../models/adressModel.js";
import { verifyToken } from "../utils/AuthToken.js";
import { validateAddress } from "../utils/validators/addressValidate.js";
import { validateEditAddress } from "../utils/validators/editeaddressValidate.js";
// get all address
export const alladdress = async (req, res, next) => {
    try {
        // validating token
        verifyToken(req, res);
        // find all address
        const allAddress = await AddressModel.find();
        return res
            .status(200)
            .json({ message: "Address added successfully", allAddress });
    }
    catch (error) {
        console.error("Error in newAddress:", error);
        next(error);
    }
};
// create new address
export const newaddress = async (req, res, next) => {
    try {
        // validating token
        const { userId } = verifyToken(req, res);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // valdidating requset body
        const { error } = validateAddress(req.body);
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                error,
            });
        }
        const { addressName, address, lat, lng } = req.body;
        // create new address
        const newAddress = await AddressModel.create({
            user: userId,
            addressName,
            address,
            lat,
            lng,
        });
        // add creates addres to user
        await UserModel.findByIdAndUpdate(userId, {
            $push: { addresses: newAddress._id },
        });
        return res
            .status(201)
            .json({ message: "Address added successfully", newAddress });
    }
    catch (error) {
        console.error("Error in newAddress:", error);
        next(error);
    }
};
// edite address
export const editaddress = async (req, res, next) => {
    try {
        // Validate token
        const { userId } = verifyToken(req, res);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Validate request body
        const { error } = validateEditAddress(req.body);
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                errors: error,
            });
        }
        const { id, addressName, address, lat, lng } = req.body;
        // Check if address exists
        const existAddress = await AddressModel.findOne({ _id: id, user: userId });
        if (!existAddress) {
            return res.status(404).json({ message: "Address not found!" });
        }
        // Prepare update object
        const updateAddress = { addressName, address, lat, lng };
        // Remove undefined or null values
        Object.keys(updateAddress).forEach((key) => {
            if (updateAddress[key] === undefined || updateAddress[key] === null) {
                delete updateAddress[key];
            }
        });
        // If no fields to update, return an error
        if (Object.keys(updateAddress).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }
        // Update address in database
        const updatedAddress = await AddressModel.findByIdAndUpdate(id, { $set: updateAddress }, { new: true, runValidators: true });
        return res
            .status(200)
            .json({ message: "Address updated successfully", updatedAddress });
    }
    catch (error) {
        console.error("Error in editAddress:", error);
        next(error);
    }
};
//delte address
export const deleteAddress = async (req, res, next) => {
    try {
        const { userId } = verifyToken(req, res);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { addressId } = req.params;
        if (!addressId) {
            return res.status(400).json({ message: "invalid address id" });
        }
        const address = await AddressModel.findOne({
            _id: addressId,
            user: userId,
        });
        if (!address) {
            return res.status(404).json({ message: "Address not found!" });
        }
        // حذف آدرس
        await AddressModel.findByIdAndDelete(addressId);
        // حذف آدرس از لیست آدرس‌های کاربر
        await UserModel.findByIdAndUpdate(userId, {
            $pull: { addresses: addressId },
        });
        return res.status(200).json({ message: "Address deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteAddress:", error);
        next(error);
    }
};
