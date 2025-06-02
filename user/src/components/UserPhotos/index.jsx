import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import "./styles.css";
import { useParams } from "react-router-dom";
import { addNewCommentService, deletePhotoById, getCommentsByPhotoId, getPhotosByUserIdService, getUserByIdService } from "../../services";

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
      setCommentMap((prev) => ({
        ...prev,
        [photoId]: newComments,
      }));
      for (const cmt of newComments) {
        const uid = cmt.user_id;
        if (uid && !userMap[uid]) {
          try {
            const userRes = await getUserByIdService(uid);
            setUserMap((prev) => ({
              ...prev,
              [uid]: userRes.data,
            }));
          } catch (err) {
            console.error("❌ Failed to load user for comment:", uid, err);
          }
        }
      }
    }
  }

  function handleCommentChange(e) {
    setComment(e.target.value);
  }

  //console.log(comment, "Comment");

  useEffect(() => {
    getUser();
  }, [userId]);

  useEffect(() => {
    getPhotosAndComments();
    setDeletePhoto(false);
  }, [userId, deletePhoto]);

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
                  <Box key={idx} sx={{ marginLeft: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {user ? `${user.first_name} ${user.last_name}` : cmt.user_id}
                    </Typography>
                    <Typography>{cmt.comment}</Typography>
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
