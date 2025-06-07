const express = require("express");
const Photo = require("../models/Photos");

const {
    uploadPhoto,
    getPhotosByUserId,
    deletePhotoById,
    addCommentToPhoto,
    getCommentsByPhotoId,
    deleteCommentById
} = require("../controllers/photo-controller");

const upload = require("../middleware/upload");
const router = express.Router();

router.post("/new/:userId", upload.single("photo"), uploadPhoto);

router.get("/get-comments", getCommentsByPhotoId);

router.get("/:userId", getPhotosByUserId);

router.delete("/delete", deletePhotoById);

router.post("/add-comment", addCommentToPhoto);

router.delete("/delete-comment", deleteCommentById);

module.exports = router;
