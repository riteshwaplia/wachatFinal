import api from "../utils/api";

        // `/projects/${projectId}/messages/bulk-messages`,



// export const sendgroupbroadcast = async (templateName,groupId) => {
//     const projectId = "687de6995c9bd2f5f9441e98"
//   try {
//         const response = await api.get(`/projects/${projectId}/messages/bulk-send-group`,{templateName :"ritesh",groupId:"687dfd7e0810c60733e17767"});
//         console.log("response", response);
 
//   } catch (error) {
//     console.error("Error fetching bulk send jobs:", error);
//   }
// };


export const sendgroupbroadcast = async () => {
    const projectId = "687de6995c9bd2f5f9441e98"
  try {
        const response = await api.put(`/users/reset-password`,{"oldPassword" :"yogesh12","newPassword":"123456"});
        console.log("response", response);
 
  } catch (error) {
    console.error("Error fetching bulk send jobs:", error);
  }
};

// 687dfd7e0810c60733e17767

// /reset-password
 
// {
//   "oldPassword": "currentPassword123",
//   "newPassword": "newSecurePassword456"
// }