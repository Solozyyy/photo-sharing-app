const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../images"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniquename = `photo-${Date.now()}${ext}`;
        cb(null, uniquename);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;