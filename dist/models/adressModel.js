import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MyUsers", // ارتباط با مدل کاربر
        required: true,
    },
    addressName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const Address = mongoose.model("MyAddress", addressSchema);
export default Address;
