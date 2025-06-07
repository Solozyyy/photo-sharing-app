import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import "./styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { addNewCommentService, deleteCommentByIdService, deletePhotoById, getCommentsByPhotoId, getPhotosByUserIdService, getUserByIdService } from "../../services";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {

  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const [deletePhoto, setDeletePhoto] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("accessToken")) || "";
  const payload = jwtDecode(token);
  const [comment, setComment] = useState("");
  const [commentMap, setCommentMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const navigate = useNavigate();
  const [deleteComment, setDeleteComment] = useState(false);

  async function getPhotosAndComments() {
    const res = await getPhotosByUserIdService(userId);
    const photoList = res.data;
    console.log("List of photos:", photoList);

    const tempCommentMap = {};
    const tempUserMap = {};
    for (const photo of photoList) {
      const commentRes = await getCommentsByPhotoId(photo._id);
      console.log("🔥 Comment response for", photo._id, commentRes.data);
      const comments = commentRes.data || [];
      tempCommentMap[photo._id] = comments;
      for (const cmt of comments) {
        const uid = cmt.user_id;
        if (!uid) {
          console.warn("⚠️ Comment has no user_id:", cmt);
          continue;
        }
        const userRes = await getUserByIdService(uid);
        tempUserMap[uid] = userRes?.data;
      }
    }

    setPhotos(photoList);
    setCommentMap(tempCommentMap);
    setUserMap(tempUserMap);
    // console.log("✅ FINAL commentMap:", tempMap);
  }

  async function getUser() {
    const res = await getUserByIdService(userId);
    setUser(res.data);
  }

  async function handleDeletePhoto(photoId) {
    const res = await deletePhotoById(photoId);
    if (res) setDeletePhoto(true);
  }

  async function handleSubmitComment(photoId, userId, comment) {
    if (comment === "") {
      alert("Comment cannot empty, please type something");
      return;
    }
    const res = await addNewCommentService(photoId, userId, comment);
    if (res) {
      alert("Comment added successfully");
      setComment("");
      // Load lại comment sau khi post
      const commentRes = await getCommentsByPhotoId(photoId);
      const newComments = commentRes.data;

      // Tạo một bản sao userMap hiện tại
      const updatedUserMap = { ...userMap };

      // ⚠️ Load user cho mỗi comment nếu chưa có
      for (const cmt of newComments) {
        const uid = cmt.user_id;
        if (uid && !updatedUserMap[uid]) {
          try {
            const userRes = await getUserByIdService(uid);
            updatedUserMap[uid] = userRes.data;
          } catch (err) {
            console.error("❌ Failed to load user for comment:", uid, err);
          }
        }
      }

      // ✅ Cập nhật userMap trước
      setUserMap(updatedUserMap);
      setCommentMap((prev) => ({
        ...prev,
        [photoId]: newComments,
      }));

    }
  }

  function handleCommentChange(e) {
    setComment(e.target.value);
  }

  function handleForwardUser(userId) {
    navigate(`/users/${userId}`);
  }

  async function handleDeleteComment(photoId, commentId) {
    const res = await deleteCommentByIdService(photoId, commentId);
    if (res) setDeleteComment(true);
  }

  //console.log(comment, "Comment");

  useEffect(() => {
    getUser();
  }, [userId]);

  useEffect(() => {
    getPhotosAndComments();
    setDeletePhoto(false);
    setDeleteComment(false);
  }, [userId, deletePhoto, deleteComment]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Photos of {user.first_name}
      </Typography>

      {photos.length === 0 ? (
        <Typography>No photo uploaded yet.</Typography>
      ) : (
        photos.map((item, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              marginBottom: 2,
              padding: 1,
              borderRadius: 2,
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            <Box display="flex" alignItems="flex-start">
              <img
                src={`http://localhost:5000/images/${item.file_name}`}
                alt={`photo-${index}`}
                style={{
                  width: "75%",
                  height: "auto",
                  display: "block",
                  borderRadius: "8px",
                  margin: "9px",
                }}
              />
              {item.user_id === String(payload._id) ?
                (<Button
                  onClick={() => handleDeletePhoto(item._id)}
                  color="error"
                  variant="contained"
                  style={{ margin: "9px" }}
                >
                  Delete photo
                </Button>)
                :
                null
              }
            </Box>
            <input
              style={{
                margin: "9px",
                height: "60px",
                width: "74%",
                resize: "none",
              }}
              type="textarea"
              placeholder="Comment..."
              onChange={handleCommentChange}
            />
            <Button
              style={{ margin: "9px" }}
              variant="contained"
              color="success"
              alignItems="flex-start"
              onClick={() => handleSubmitComment(item._id, payload._id, comment)}
            >
              Post comment
            </Button>
            <Box>
              <Typography sx={{ fontWeight: "bold" }} style={{ margin: "9px" }}>
                Total Comment: ({commentMap[item._id]?.length || 0})
              </Typography>
              {commentMap[item._id]?.map((cmt, idx) => {
                // console.log("Render comment for photo", item._id, cmt);
                const user = userMap[cmt.user_id];
                return (
                  <Box
                    key={idx}
                    sx={{
                      margin: "10px 0",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9"
                    }}>
                    {/* <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {user ? `${user.first_name} ${user.last_name}` : cmt.user_id}
                    
                    </Typography> */}
                    <p>Uploaded at{" "}
                      {new Date(cmt.date_time).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour12: false,
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })} by
                      <Button
                        onClick={() => handleForwardUser(user._id)}
                      >{user.first_name} {user.last_name}</Button>
                    </p>

                    <Typography variant="body1" sx={{ marginBottom: "5px", whiteSpace: "pre-wrap" }}>
                      {cmt.comment}
                    </Typography>
                    <p>
                      {payload._id === cmt.user_id &&
                        (< Button variant="outlined" color="error" onClick={() => handleDeleteComment(item._id, cmt._id)}>
                          Delete Comment
                        </Button>)
                      }
                    </p>
                  </Box>

                );
              })}
            </Box>

          </Paper>
        ))
      )
      }
    </Box >
  );
}

export default UserPhotos;
