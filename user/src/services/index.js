import React from "react";
import axiosInstance from "../api/axiosInstance";

export async function signupService(formData) {
    console.log(formData, "formData");

    const { data } = await axiosInstance.post("/api/auth/signup", formData);

    return data;

}

export async function loginService(formData) {
    console.log("🔐 Token trong sessionStorage:", sessionStorage.getItem("accessToken"));
    const { data } = await axiosInstance.post("/api/auth/login", formData);

    return data;
}

export async function uploadPhotoService(file, userId) {
    const formData = new FormData();
    formData.append("photo", file);
    const { data } = await axiosInstance.post(`/api/photos/new/${userId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};

export async function getAllUsersService() {
    const { data } = await axiosInstance.get("/api/user");

    return data;
}

export async function getUserByIdService(userId) {
    console.log("getUserByIdService ID:", userId);  // ✅ Phải là chuỗi ID thực
    const { data } = await axiosInstance.get(`/api/user/${userId}`);

    return data;
}

export async function getPhotosByUserIdService(userId) {
    const { data } = await axiosInstance.get(`/api/photos/${userId}`);

    return data;
}

export async function deletePhotoById(photoId) {
    const { data } = await axiosInstance.delete("/api/photos/delete", { data: { photoId } });

    return data;
}

export async function addNewCommentService(photoId, userId, comment) {
    const { data } = await axiosInstance.post("/api/photos/add-comment", { photoId, userId, comment });

    return data;
}

export async function getCommentsByPhotoId(photoId) {
    console.log("📤 Fetching comments for photoId:", photoId);
    const { data } = await axiosInstance.get("/api/photos/get-comments", { params: { photoId } });
    console.log("📥 Response from backend:", data);
    return data;
}

export async function deleteCommentByIdService(photoId, commentId) {
    console.log("delete comment", commentId);

    const { data } = await axiosInstance.delete("/api/photos/delete-comment", { data: { photoId, commentId } });

    return data;
}