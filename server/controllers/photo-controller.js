const Photo = require("../models/Photos");
const fs = require("fs");
const path = require("path");

const uploadPhoto = async (req, res) => {
    const userId = req.params.userId;
    const file = req.file;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
    }

    try {

        const newPhoto = new Photo({
            file_name: file.filename,
            user_id: userId,
            comments: [],
        });

        await newPhoto.save();

        res.status(200).json({
            success: true,
            message: "Photo uploaded successfully",
            data: newPhoto,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const getPhotosByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const photosList = await Photo.find({ user_id: userId }).sort({ date_time: -1 });
        res.status(200).json({
            success: true,
            message: "photo lists",
            data: photosList,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server error",
        });
    }
}

const deletePhotoById = async (req, res) => {
    try {
        const { photoId } = req.body;
        const photo = await Photo.findById(photoId);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Cannot find this photo",
            })
        }

        const deletePhoto = await Photo.findByIdAndDelete(photoId);

        const imagePath = path.join(__dirname, "../images", photo.file_name);

        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log("Failed to delete");
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete file in images"
                });
            }
        });

        res.status(200).json({
            success: true,
            message: "Photo and image delete successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const addCommentToPhoto = async (req, res) => {
    try {

        const { photoId, comment, userId } = req.body;

        const photo = await Photo.findById(photoId);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Cannot find photo",
            });
        }

        photo.comments.push({
            comment,
            date_time: new Date(),
            user_id: userId,
        });

        await photo.save();
        console.log("add comment ok");

        res.status(200).json({
            success: true,
            message: "Add comment successfully",
            photo,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const getCommentsByPhotoId = async (req, res) => {
    try {
        const { photoId } = req.query;
        const photo = await Photo.findById(photoId);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Photo not found",
            });
        }

        const commentList = [...photo.comments].sort(
            (a, b) => new Date(b.date_time) - new Date(a.date_time)
        );
        console.log("✅ Returning comment list:", commentList);

        res.status(200).json({
            success: true,
            message: "Get comments successfully",
            data: commentList,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

const deleteCommentById = async (req, res) => {
    try {
        const { photoId, commentId } = req.body;

        const photo = await Photo.findById(photoId);

        if (!photo) {
            return res.status(401).json({
                success: false,
                message: "Photo not found",
            });
        }

        photo.comments = photo.comments.filter(
            (cmt) => cmt._id.toString() !== commentId
        );

        await photo.save();

        res.status(200).json({
            success: true,
            message: "deleted comment successfully"
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

module.exports = {
    uploadPhoto,
    getPhotosByUserId,
    deletePhotoById,
    addCommentToPhoto,
    getCommentsByPhotoId,
    deleteCommentById
};