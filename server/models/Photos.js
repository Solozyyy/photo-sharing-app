const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    // The text of the comment.
    comment: String,
    // The date and time when the comment was created.
    date_time: { type: Date, default: Date.now },
    // The ID of the user who created the comment.
    user_id: String,
});

/**
 * Define the Mongoose Schema for a Photo.
 */
const photoSchema = new mongoose.Schema({
    // Name of the file containing the photo (in the project6/images directory).
    file_name: { type: String },
    // The date and time when the photo was added to the database.
    date_time: { type: Date, default: Date.now },
    // The ID of the user who created the photo.
    user_id: { type: String },
    // Array of comment objects representing the comments made on this photo.
    comments: [commentSchema],
});

const Photo = mongoose.model.Photos || mongoose.model("Photos", photoSchema);

module.exports = Photo;
