const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, editUserByUserId } = require("../controllers/user-controller");
router.get("/", getAllUsers);

router.get("/:userId", getUserById);

router.put("/edit/:userId", editUserByUserId);

module.exports = router;