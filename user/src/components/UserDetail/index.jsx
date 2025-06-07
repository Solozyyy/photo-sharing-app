import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

import "./styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { editUserByUserId, getPhotosByUserIdService, getUserByIdService, loginService } from "../../services";
import { jwtDecode } from "jwt-decode";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const token = sessionStorage.getItem("accessToken");
  const payload = jwtDecode(token);
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [numberPhoto, setNumberPhoto] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

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

  function handleShowForm() {
    setShowForm(true);

    setUserForm({
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
  }

  const handleFormChange = (field) => (e) => {
    setUserForm({ ...userForm, [field]: e.target.value });
  }

  async function handleSubmitForm() {
    console.log(userForm, "userForm");
    const res = await editUserByUserId(user._id, userForm);

    if (res) alert("Updated successfully");
    else alert("noob");

    setShowForm(false);
    setUserForm({
      first_name: "",
      last_name: "",
      location: "",
      description: "",
      occupation: "",
    });
  }

  useEffect(() => {
    getUser();
  }, [userId, userForm]);

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
          <div>
            {
              (payload._id === userId) &&
              (<Button variant="outlined" onClick={handleShowForm}>Edit User</Button>)
            }
          </div>
          {
            showForm &&
            (
              <>
                <div>
                  <TextField
                    label={user.first_name}
                    value={userForm.first_name}
                    onChange={handleFormChange("first_name")}
                  />
                  <TextField
                    label={user.last_name}
                    value={userForm.last_name}
                    onChange={handleFormChange("last_name")}
                  />
                  <TextField
                    label={user.location}
                    value={userForm.location}
                    onChange={handleFormChange("location")}
                  />
                  <TextField
                    label={user.occupation}
                    value={userForm.occupation}
                    onChange={handleFormChange("occupation")}
                  />
                  <TextField
                    label={user.description}
                    value={userForm.description}
                    onChange={handleFormChange("description")}
                  />
                </div>
                <div>
                  <Button variant="outlined" onClick={handleSubmitForm}>Submit</Button>
                </div>
              </>
            )
          }

        </>
      ) : (
        <p>Loading user...</p>
      )}
    </>
  );
}

export default UserDetail;
