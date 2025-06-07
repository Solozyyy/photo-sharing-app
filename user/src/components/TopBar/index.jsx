import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import "./styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import { getUserByIdService, uploadPhotoService } from "../../services";


/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {

  const fileInputRef = useRef();
  const navigate = useNavigate();
  const token = JSON.parse(sessionStorage.getItem("accessToken")) || "";
  const payload = jwtDecode(token);

  function handleLogOut() {
    sessionStorage.removeItem("accessToken");
    navigate("/auth");
  }

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    try {
      const res = await uploadPhotoService(file, payload._id);
      if (res.success) {
        alert("Uploaded successfully");
      } else {
        alert("Fail to upload photo");
      }
    } catch (error) {
      console.log(error);
      alert("Error occured when upload photo");
    }

  }

  const handleUploadClick = () => {
    fileInputRef.current.click();
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="h5" color="inherit">
            {`Hi, ${payload.last_name}`}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUploadFile}
          />
          <Button variant="contained" color="success" onClick={handleUploadClick}>
            Upload Photo
          </Button>
          <Button variant="contained" color="error" onClick={handleLogOut}>Log Out</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
