// src/apis/Order.js
import api from "../utils/api";

export const getOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data.data; // backend sends { success, data: [...] }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

export const getOrderDetails = async (projectId,orderId) => {
  try {
    const response = await api.get(`/projects/${projectId}/orders/${orderId}`);
    return response.data.data; // backend sends { success, data: {...} }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch order details"
    );
  }
};

export const updateOrderAddress = async (projectId,orderId, addressData) => {
  try {
    const response = await api.put(`/projects/${projectId}/orders/${orderId}/address`, addressData);
    return response.data.order;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update address"
    );
  }
};

// export const generatePaymentLink = async (projectId,orderId) => {
//     console.log("projectId, orderId", projectId, orderId);
//   try {
//     const response = await api.post(`/projects/${projectId}/orders/${orderId}/pay`);
//         console.log("url", response.data);

//     return response.data; // { success, url }
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message || "Failed to generate payment link"
//     );
//   }
// };

export const generatePaymentLink = async (projectId, orderId) => {
  const response = await api.post(`/projects/${projectId}/orders/${orderId}/pay`);
  return response.data.data; // { success, url }
};