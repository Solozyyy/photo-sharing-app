import React from "react";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
import models from "../../modelData/models";
import { getAllUsersService } from "../../services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersService();
      setUsers(res.data);
    } catch (error) {
      console.log("Failed to get all users");
    }
  }

  useEffect(() => {

    fetchUsers();
  }, []);

  console.log(users);

  function handleClickUser(userId) {
    navigate(`users/${userId}`);
  }

  return (
    <div>
      <Typography variant="body1">
        <h3 >List Of Users</h3>
      </Typography>
      <List component="nav">
        {users.map((item) => (
          <>
            <ListItem>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleClickUser(item._id)}
              >{item.first_name}
              </Button>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </div>
  );
}

export default UserList;
