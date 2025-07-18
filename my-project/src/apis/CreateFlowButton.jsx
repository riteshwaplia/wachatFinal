
import React from 'react';
import axios from 'axios';

const CreateFlowButton = () => {
  const handleCreateFlow = async () => {
    try {
    const response = await axios.post(
      'http://localhost:5001/api/projects/686f67e969f9a36c9276c41b/flows', // Replace with actual projectId
      {
        name: "Welcome Flow",
        triggerKeyword: "hello",
        description: "Greets the user and collects basic info",
        status: "active",
        nodes: [
          {
            id: "1",
            type: "start",
            data: {
              label: "Start Node",
              message: "Hi there! 👋 Welcome to our service.",
            },
            position: { x: 100, y: 50 }
          },
          {
            id: "2",
            type: "message",
            data: {
              label: "Ask Name",
              message: "What's your name?"
            },
            position: { x: 300, y: 50 }
          },
          {
            id: "3",
            type: "end",
            data: {
              label: "End Node",
              message: "Thanks for sharing!"
            },
            position: { x: 500, y: 50 }
          }
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2", type: "default" },
          { id: "e2-3", source: "2", target: "3", type: "default" }
        ]
      },
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmY2N2E4NjlmOWEzNmM5Mjc2YzM4YyIsImlhdCI6MTc1MjU1NTA1OCwiZXhwIjoxNzU1MTQ3MDU4fQ.6co4uLig0xnLjrmKwVBRCj2gWX_Lm40kVSuzOzk4afk`, // replace with actual token
          'Content-Type': 'application/json'
        }
      }
    );


      console.log("✅ Flow created:", response.data);
      alert("Flow created successfully!");
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert("Failed to create flow.");
    }
  };

  return (
    <>
    
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Project Dashboard</h1>
        <button
      onClick={handleCreateFlow}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      Test Create Flow
    </button>
    </>
  );
};

export default CreateFlowButton;
