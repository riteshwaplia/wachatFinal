// to send the image to the metaapi on live chat

const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]; // For file inputs
    if (!file) return;
console.log("file",file)
    // Client-side validation
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert('Only JPEG, PNG, or PDF files are allowed');
        return;
    }

    if (file.size > 25 * 1024 * 1024) {
        alert('File size exceeds 25MB limit');
        return;
    }

     const formData = new FormData();
formData.append("file", file);

// ✅ Properly log what's inside FormData
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}

    try {
        const res = await api.post(
            `/projects/${projectId}/messages/upload-media`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
                }
            }
        );
        return res.data; // { id, mimeType, fileSize }
    } catch (err) {
        console.error('Upload failed:', err.response?.data || err);
        throw err;
    }
};