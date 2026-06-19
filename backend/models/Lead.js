const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        businessName: {
            type: String,
            required: [true, "Business name is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
        aiScore: {
            type: String,
            enum: ["Hot", "Warm", "Cold",null],
            default: null,
        },
        aiReason: {
            type: String,
            default: null,
        },
        emailDraft: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);