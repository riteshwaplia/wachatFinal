// client/src/apis/FlowApi.js
import api from '../utils/api'; // Assuming your configured axios instance

const BASE_URL = '/projects'; // Will be prefixed with /api/projects/:projectId

export const createFlowApi = async (projectId, flowData) => {
  try {
    const response = await api.post(`${BASE_URL}/${projectId}/flows`, flowData);
    return response.data;
  } catch (error) {
    console.error("Error creating flow:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getFlowsApi = async (projectId) => {
  try {
    const response = await api.get(`${BASE_URL}/${projectId}/flows`);
    return response.data;
  } catch (error) {
    console.error("Error fetching flows:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getFlowByIdApi = async (projectId, flowId) => {
  try {
    const response = await api.get(`${BASE_URL}/${projectId}/flows/${flowId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flow ${flowId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateFlowApi = async (projectId, flowId, updateData) => {
  try {
    const response = await api.put(`${BASE_URL}/${projectId}/flows/${flowId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating flow ${flowId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteFlowApi = async (projectId, flowId) => {
  try {
    const response = await api.delete(`${BASE_URL}/${projectId}/flows/${flowId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting flow ${flowId}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
