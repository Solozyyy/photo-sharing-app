const { Login, Signup } = require("../controllers/auth-controller");
const express = require("express");

const router = express.Router();

const authMid = require("../middleware/auth-middleware");

router.post("/login", Login);

router.post("/signup", Signup);

router.get("/check-auth", authMid, (req, res) => {

    const user = req.user;

    res.status(200).json({
        success: true,
        message: "Authenticated user!",
        data: {
            user,
        },
    });
});

module.exports = router;