const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Signup = async (req, res) => {
    try {
        const {
            login_name,
            password,
            first_name,
            last_name,
            location,
            description,
            occupation
        } = req.body;

        const existingUser = await Users.findOne({ login_name });

        if (existingUser) {
            console.log("User is already existed");

            return res.status(400).json({
                success: false,
                message: "User name is already existed",
            });
        }

        const newUser = new Users({
            login_name,
            password,
            first_name,
            last_name,
            location,
            description,
            occupation
        });

        await newUser.save();

        res.status(200).json({
            success: true,
            message: "Tao user thanh cong voi role user",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            role: "role",
        });
    }
};

const Login = async (req, res) => {
    try {

        const { login_name, password } = req.body;
        const checkUser = await Users.findOne({ login_name });
        if (!checkUser || checkUser.password !== password) {
            return res.status(400).json({
                success: false,
                message: "Sai user name hoac mat khau, check lai",
            });
        }

        const accessToken = jwt.sign({
            _id: checkUser._id,
            role: checkUser.role,
            first_name: checkUser.first_name,
            last_name: checkUser.last_name,
            location: checkUser.location,
            description: checkUser.description,
            occupation: checkUser.occupation,
        }, process.env.JWT_SECRET, { expiresIn: "120m" });

        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                accessToken,
                user: {
                    _id: checkUser._id,
                    role: checkUser.role,
                    first_name: checkUser.first_name,
                    last_name: checkUser.last_name,
                    location: checkUser.location,
                    description: checkUser.description,
                    occupation: checkUser.occupation,
                },
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = { Signup, Login };