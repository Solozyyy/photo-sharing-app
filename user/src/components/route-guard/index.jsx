import React from "react";
import { Navigate } from "react-router-dom";

function RouteGuard({ children }) {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}

export default RouteGuard;