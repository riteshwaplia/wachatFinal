//localhost:3000/api/template/

import axios from "axios";
import api from "../utils/api";

export const createTemplateApi = async (data) => {
  const id = data.id;
  try {
    const res = await api.post(`project/${id}/template`, data);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Failed to create template");
    }
  } catch (error) {
    return error;
  }
};

export const uploadMedaiData = async (file, businessProfileId, projectId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projectId", projectId);
  
  if (businessProfileId) {
    formData.append("businessProfileId", businessProfileId);
  }

  try {
    // Corrected the endpoint path to match the backend's /api/whatsapp/upload-media
    const response = await api.post("/templates/upload-media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data, // This contains { id: hValue, mimeType, fileSize }
        id: response.data.data.id, // Extract the 'h' value from 'id'
        message: "Media uploaded successfully"
      };
    } else {
      throw new Error(response.data.message || "Media upload failed");
    }
  } catch (error) {
    console.error("Media upload error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Media upload failed",
      error: error.response?.data || error
    };
  }
};

