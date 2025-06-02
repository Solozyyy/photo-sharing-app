const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    login_name: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: { type: String },
    occupation: { type: String },
    role: { type: String, default: "user" },
});

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);
