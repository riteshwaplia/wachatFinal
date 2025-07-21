import api from "../utils/api";

        // `/projects/${projectId}/messages/bulk-messages`,



export const sendgroupbroadcast = async () => {
    const projectId = "687de6995c9bd2f5f9441e98"
  try {
        const response = await api.get(`/projects/${projectId}/messages/bulk-send-group`,{templateName :"ritesh",groupId:"687dfd7e0810c60733e17767"});
        console.log("response", response);
 
  } catch (error) {
    console.error("Error fetching bulk send jobs:", error);
  }
};



// 687dfd7e0810c60733e17767

