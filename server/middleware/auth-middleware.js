const jwt = require("jsonwebtoken");

const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey);
}

const authMid = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader, "authHeader");

    if (!authHeader) {
        return res.status(404).json({
            success: false,
            message: "user is not authenticated",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyToken(token, "JWT_SECRET");

        req.user = payload;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error occured",
        });
    }
}

module.exports = authMid;