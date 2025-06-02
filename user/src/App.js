import './App.css';

import React from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import AuthPage from './pages/auth-page';
import RouteGuard from './components/route-guard';


const MainLayout = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TopBar />
    </Grid>
    <div className="main-topbar-buffer" />
    <Grid item sm={3}>
      <Paper className="main-grid-item" sx={{ height: "auto", minHeight: "100%", boxSizing: "border-box" }}>
        <UserList />
      </Paper>
    </Grid>
    <Grid item sm={9}>
      <Paper className="main-grid-item" sx={{ height: "auto", minHeight: "100%", boxSizing: "border-box" }}>
        <Routes>
          <Route path="users" element={<UserList />} />
          <Route path="users/:userId" element={<UserDetail />} />
          <Route path="photos/:userId" element={<UserPhotos />} />
        </Routes>
      </Paper>
    </Grid>
  </Grid>
);

const App = (props) => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected route */}
      <Route
        path="/*"
        element={
          <RouteGuard>
            <MainLayout />
          </RouteGuard>
        }
      />
    </Routes>
  );
};
export default App;
