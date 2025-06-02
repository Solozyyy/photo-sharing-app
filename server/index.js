const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const AuthRouter = require("./routes/auth");
const PhotoRouter = require("./routes/PhotoRouter");
// const CommentRouter = require("./routes/CommentRouter");
const path = require("path");

const app = express();

dbConnect();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/photos", PhotoRouter);
// Cho phép truy cập ảnh tĩnh qua /images
app.use("/images", express.static(path.join(__dirname, "images")));


app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});

