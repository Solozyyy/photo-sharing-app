import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";

import "./styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { getPhotosByUserIdService, getUserByIdService } from "../../services";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [numberPhoto, setNumberPhoto] = useState("");

  async function getUser() {
    const res = await getUserByIdService(userId);
    setUser(res.data);
  }

  async function getPhotos() {
    const res = await getPhotosByUserIdService(userId);
    setNumberPhoto(res.data.length);
  }

  function handleShowPhoto() {
    navigate(`/photos/${userId}`);
  }

  useEffect(() => {
    getUser();
  }, [userId]);

  useEffect(() => {
    getPhotos();
  }, [numberPhoto, userId]);

  return (
    <>
      {user ? (
        <>
          <h2>Profile of {user.first_name} {user.last_name}</h2>
          <h3>First Name: {user.first_name}</h3>
          <h3>Last Name: {user.last_name}</h3>
          <h3>Location: {user.location}</h3>
          <h3>Occupation: {user.occupation}</h3>
          <h3>Description: {user.description}</h3>
          <h3>Number Of Photos: {numberPhoto}</h3>
          <Button variant="contained" onClick={handleShowPhoto}>Show photos</Button>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </>
  );
}

export default UserDetail;
