import React, { useState } from "react";

import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState(null);

  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file first.");

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://192.168.1.114:5500/api/template/upload-media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse(res.data);
    } catch (err) {
      console.error(err);

      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Media</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={handleChange}
          accept="image/*,application/pdf"
        />
        <button type="submit">Upload</button>
      </form>

      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}

export default FileUpload;