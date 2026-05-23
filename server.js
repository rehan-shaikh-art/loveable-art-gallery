const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    cardHolderName: String,
    cardLast4: String,
    billingAddress: String,
});

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        default: "",
    },

    walletDetails: walletSchema,

    role: {
        type: String,
        enum: ["buyer", "artist", "admin"],
        default: "buyer",
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema);