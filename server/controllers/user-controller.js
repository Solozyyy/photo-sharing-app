const Users = require("../models/Users");

const getAllUsers = async (req, res) => {

    try {
        const listUsers = await Users.find({});
        res.status(200).json({
            success: true,
            message: "All users",
            data: listUsers,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }

}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        const userDetails = await Users.findById(userId);

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Cannot load user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Get user successfully",
            data: userDetails,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

module.exports = { getAllUsers, getUserById };