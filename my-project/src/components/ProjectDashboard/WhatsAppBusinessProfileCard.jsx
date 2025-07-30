// // client/src/components/ProjectDetail/WhatsAppBusinessProfileCard.js
// import React, { useState, useEffect } from "react";
// import {
//   FiEdit2,
//   FiExternalLink,
//   FiCheck,
//   FiX,
//   FiUploadCloud,
// } from "react-icons/fi";
// import { FaWhatsapp } from "react-icons/fa";
// import InputField from "../InputField"; // Assuming this is a reusable input component
// import Avatar from "../Avatar"; // Assuming this is a reusable Avatar component
// import { uploadMedaiData } from "../../apis/TemplateApi"; // For media upload

// const WhatsAppBusinessProfileCard = ({
//   project,
//   onUpdateProfile,
//   loadingUpdate,
//   errorUpdate,
// }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [form, setForm] = useState({});
//   const [mediaUploadLoading, setMediaUploadLoading] = useState(false);
//   const [mediaUploadError, setMediaUploadError] = useState(null);

//   // Initialize form state when project prop changes or on first load
//   useEffect(() => {
//     if (project) {
//       setForm({
//         about: project.about || "",
//         address: project.address || "",
//         description: project.description || "",
//         email: project.email || "",
//         websites: project.websites || [],
//         vertical: project.vertical || "",
//         profile_picture_handle: "", // This will hold the 'h' value from Meta after upload
//         profilePictureUrl: project.profilePictureUrl || "", // Current display URL
//       });
//     }
//   }, [project]);

//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleWebsitesChange = (e) => {
//     const value = e.target.value;
//     // Split by comma, trim whitespace, filter out empty strings
//     const websitesArray = value
//       .split(",")
//       .map((w) => w.trim())
//       .filter(Boolean);
//     handleChange("websites", websitesArray);
//   };

//   const handleProfilePictureUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!project?.businessProfileId?._id || !project?._id) {
//       alert(
//         "Project ID or Business Profile ID is missing. Cannot upload profile picture."
//       );
//       return;
//     }

//     setMediaUploadLoading(true);
//     setMediaUploadError(null);

//     try {
//       const uploadResponse = await uploadMedaiData(
//         file,
//         project.businessProfileId._id,
//         project._id
//       );
//       if (uploadResponse.success) {
//         setForm((prev) => ({
//           ...prev,
//           profile_picture_handle: uploadResponse.id,
//         })); // Store the 'h' value
//         // Note: We don't update profilePictureUrl here directly, it will be updated
//         // after the main profile update API call and re-fetch of project data.
//       } else {
//         setMediaUploadError(
//           uploadResponse.message || "Profile picture upload failed."
//         );
//       }
//     } catch (err) {
//       setMediaUploadError(
//         err.message || "Error during profile picture upload."
//       );
//     } finally {
//       setMediaUploadLoading(false);
//     }
//   };

//   const handleSave = () => {
//     // Call the parent's update function with the form data
//     // Only send fields that are part of Meta's API payload
//     const payload = {
//       about: form.about,
//       address: form.address,
//       description: form.description,
//       email: form.email,
//       websites: form.websites,
//       vertical: form.vertical,
//       // Only include profile_picture_handle if a new one was uploaded
//       ...(form.profile_picture_handle && {
//         profile_picture_handle: form.profile_picture_handle,
//       }),
//     };
//     onUpdateProfile(payload);
//     setIsEditing(false); // Assume successful update will re-fetch and close
//   };

//   const handleCancel = () => {
//     // Reset form to original project data
//     setForm({
//       about: project.about || "",
//       address: project.address || "",
//       description: project.description || "",
//       email: project.email || "",
//       websites: project.websites || [],
//       vertical: project.vertical || "",
//       profile_picture_handle: "",
//       profilePictureUrl: project.profilePictureUrl || "",
//     });
//     setIsEditing(false);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-[#111b21]">
//           WhatsApp Business Profile
//         </h2>
//         {isEditing ? (
//           <div className="flex space-x-2">
//             <button
//               onClick={handleSave}
//               className="text-sm text-green-600 flex items-center hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loadingUpdate || mediaUploadLoading}
//             >
//               <FiCheck className="mr-1" /> Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="text-sm text-gray-500 flex items-center hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loadingUpdate || mediaUploadLoading}
//             >
//               <FiX className="mr-1" /> Cancel
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="text-sm text-[#25D366] flex items-center hover:underline"
//           >
//             <FiEdit2 className="mr-1" /> Update
//           </button>
//         )}
//       </div>

//       {loadingUpdate && (
//         <p className="text-blue-500 mb-2">Updating profile...</p>
//       )}
//       {errorUpdate && <p className="text-red-500 mb-2">Error: {errorUpdate}</p>}
//       {mediaUploadLoading && (
//         <p className="text-blue-500 mb-2">Uploading profile picture...</p>
//       )}
//       {mediaUploadError && (
//         <p className="text-red-500 mb-2">Media Error: {mediaUploadError}</p>
//       )}

//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Profile Picture */}
//         <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-[#25D366] relative">
//           {form.profilePictureUrl ? (
//             <img
//               src={form.profilePictureUrl}
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <Avatar
//               className="w-24 h-24"
//               initials={project?.name ? project.name.charAt(0) : ""}
//               alt="Business Profile"
//             />
//           )}
//           {isEditing && (
//             <label
//               htmlFor="profilePictureInput"
//               className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer hover:bg-opacity-70 transition-all"
//             >
//               <FiUploadCloud size={24} />
//               <input
//                 id="profilePictureInput"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleProfilePictureUpload}
//                 disabled={mediaUploadLoading}
//               />
//             </label>
//           )}
//         </div>

//         {/* Business Info */}
//         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#111b21]">
//           {isEditing ? (
//             <>
//               <InputField
//                 label="About"
//                 value={form.about}
//                 onChange={(e) => handleChange("about", e.target.value)}
//                 maxLength={139} // Meta's limit
//               />
//               <div>
//                 <label className="block text-sm font-medium text-[#54656f] mb-1">
//                   Industry (Vertical)
//                 </label>
//                 <select
//                   value={form.vertical}
//                   onChange={(e) => handleChange("vertical", e.target.value)}
//                   className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
//                 >
//                   <option value="">Select an industry</option>
//                   {[
//                     "OTHER",
//                     "AUTO",
//                     "BEAUTY",
//                     "APPAREL",
//                     "EDU",
//                     "ENTERTAIN",
//                     "EVENT_PLAN",
//                     "FINANCE",
//                     "GROCERY",
//                     "GOVT",
//                     "HOTEL",
//                     "HEALTH",
//                     "NONPROFIT",
//                     "PROF_SERVICES",
//                     "RETAIL",
//                     "TRAVEL",
//                     "RESTAURANT",
//                     "ALCOHOL",
//                     "ONLINE_GAMBLING",
//                     "PHYSICAL_GAMBLING",
//                     "OTC_DRUGS",
//                   ].map((value) => (
//                     <option key={value} value={value}>
//                       {value.replace(/_/g, " ")}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <InputField
//                 label="Description"
//                 value={form.description}
//                 onChange={(e) => handleChange("description", e.target.value)}
//               />
//               <InputField
//                 label="Address"
//                 value={form.address}
//                 onChange={(e) => handleChange("address", e.target.value)}
//               />
//               <InputField
//                 label="Email"
//                 value={form.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 type="email"
//               />
//               <InputField
//                 label="Websites (comma-separated)"
//                 value={form.websites?.join(", ")}
//                 onChange={handleWebsitesChange}
//               />
//             </>
//           ) : (
//             <>
//               <div>
//                 <p className="font-medium text-[#54656f]">About</p>
//                 <p>{project?.about || "No about information"}</p>
//               </div>
//               <div>
//                 <p className="font-medium text-[#54656f]">Industry</p>
//                 <p>{project?.vertical || "Not specified"}</p>
//               </div>
//               <div>
//                 <p className="font-medium text-[#54656f]">Description</p>
//                 <p>{project?.description || "No description provided"}</p>
//               </div>
//               <div>
//                 <p className="font-medium text-[#54656f]">Address</p>
//                 <p>{project?.address || "No address provided"}</p>
//               </div>
//               <div>
//                 <p className="font-medium text-[#54656f]">Email</p>
//                 {project?.email ? (
//                   <a
//                     href={`mailto:${project.email}`}
//                     className="text-[#25D366] hover:underline"
//                   >
//                     {project.email}
//                   </a>
//                 ) : (
//                   "No email provided"
//                 )}
//               </div>
//               <div>
//                 <p className="font-medium text-[#54656f]">Websites</p>
//                 {project?.websites?.length > 0 ? (
//                   project.websites.map((url, i) => (
//                     <a
//                       key={i}
//                       href={url}
//                       className="text-[#25D366] hover:underline block"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {url} <FiExternalLink className="inline ml-1" />
//                     </a>
//                   ))
//                 ) : (
//                   <p>No websites provided</p>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* WhatsApp Badge */}
//       <div className="mt-6 pt-4 border-t border-[#e9edef] flex flex-col md:flex-row justify-between items-center gap-4">
//         <div className="flex items-center gap-2">
//           <div className="bg-[#25D366] w-7 h-7 rounded-full flex items-center justify-center">
//             <FaWhatsapp className="text-white text-lg" />
//           </div>
//           <span className="text-sm text-[#54656f]">
//             WhatsApp Business Profile
//           </span>
//         </div>

//         {/* This button might be for external contact, not for profile update */}
//         <button className="bg-[#25D366] text-white px-4 py-2 rounded-md hover:bg-[#128C7E] transition-all text-sm">
//           Contact Business
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WhatsAppBusinessProfileCard;
// client/src/components/ProjectDetail/WhatsAppBusinessProfileCard.js
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiExternalLink, FiCheck, FiX, FiUploadCloud } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import InputField from '../InputField'; // Assuming this is a reusable input component
import Avatar from '../Avatar'; // Assuming this is a reusable Avatar component
import { uploadMedaiData } from '../../apis/TemplateApi'; // For media upload

const WhatsAppBusinessProfileCard = ({ project, onUpdateProfile, loadingUpdate, errorUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [mediaUploadLoading, setMediaUploadLoading] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState(null);

  // Initialize form state when project prop changes or on first load
  useEffect(() => {
    if (project) {
      setForm({
        about: project.about || '',
        address: project.address || '',
        description: project.description || '',
        email: project.email || '',
        websites: project.websites || [],
        vertical: project.vertical || '',
        profile_picture_handle: '', // This will hold the 'h' value from Meta after upload
        profilePictureUrl: project.profilePictureUrl || '', // Current display URL
      });
    }
  }, [project]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleWebsitesChange = (e) => {
    const value = e.target.value;
    // Split by comma, trim whitespace, filter out empty strings
    const websitesArray = value.split(',').map((w) => w.trim()).filter(Boolean);
    handleChange('websites', websitesArray);
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // NEW: Client-side validation for JPG
    if (!file.type.startsWith('image/jpeg')) {
      setMediaUploadError("Only JPG images are supported for WhatsApp Business Profile pictures. Please upload a .jpg or .jpeg file.");
      e.target.value = ''; // Clear the input field
      return;
    }

    if (!project?.businessProfileId?._id || !project?._id) {
      setMediaUploadError("Project ID or Business Profile ID is missing. Cannot upload profile picture.");
      return;
    }

    setMediaUploadLoading(true);
    setMediaUploadError(null);

    try {
      const uploadResponse = await uploadMedaiData(file, project.businessProfileId._id, project._id);
      if (uploadResponse.success) {
        setForm((prev) => ({ ...prev, profile_picture_handle: uploadResponse.id })); // Store the 'h' value
        // Note: We don't update profilePictureUrl here directly, it will be updated
        // after the main profile update API call and re-fetch of project data.
      } else {
        setMediaUploadError(uploadResponse.message || "Profile picture upload failed.");
      }
    } catch (err) {
      setMediaUploadError(err.message || "Error during profile picture upload.");
    } finally {
      setMediaUploadLoading(false);
    }
  };


  const handleSave = () => {
    // Call the parent's update function with the form data
    // Only send fields that are part of Meta's API payload
    const payload = {
      about: form.about,
      address: form.address,
      description: form.description,
      email: form.email,
      websites: form.websites,
      vertical: form.vertical,
      // Only include profile_picture_handle if a new one was uploaded
      ...(form.profile_picture_handle && { profile_picture_handle: form.profile_picture_handle })
    };
    onUpdateProfile(payload);
    setIsEditing(false); // Assume successful update will re-fetch and close
  };

  const handleCancel = () => {
    // Reset form to original project data
    setForm({
      about: project.about || '',
      address: project.address || '',
      description: project.description || '',
      email: project.email || '',
      websites: project.websites || [],
      vertical: project.vertical || '',
      profile_picture_handle: '', // Clear any pending handle
      profilePictureUrl: project.profilePictureUrl || '', // Revert to original URL
    });
    setIsEditing(false);
    setMediaUploadError(null); // Clear any media upload errors
  };

  return (
    <div className=" rounded-2xl shadow-md p-6 border border-gray-200 bg-teal-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#111b21]">WhatsApp Business Profile</h2>
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="text-sm text-green-600 flex items-center hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingUpdate || mediaUploadLoading}
            >
              <FiCheck className="mr-1" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="text-sm text-gray-500 flex items-center hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingUpdate || mediaUploadLoading}
            >
              <FiX className="mr-1" /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-[#25D366] flex items-center hover:underline"
          >
            <FiEdit2 className="mr-1" /> Update
          </button>
        )}
      </div>

      {loadingUpdate && <p className="text-blue-500 mb-2">Updating profile...</p>}
      {errorUpdate && <p className="text-red-500 mb-2">Error: {errorUpdate}</p>}
      {mediaUploadLoading && <p className="text-blue-500 mb-2">Uploading profile picture...</p>}
      {mediaUploadError && <p className="text-red-500 mb-2">Media Error: {mediaUploadError}</p>}


      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-[#25D366] relative">
          {form.profilePictureUrl ? (
            <img src={form.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Avatar className='w-24 h-24' initials={project?.name ? project.name.charAt(0) : ''} alt="Business Profile" />
          )}
          {isEditing && (
            <label htmlFor="profilePictureInput" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer hover:bg-opacity-70 transition-all">
              <FiUploadCloud size={24} />
              <input
                id="profilePictureInput"
                type="file"
                accept="image/jpeg" // NEW: Only accept JPG images
                className="hidden"
                onChange={handleProfilePictureUpload}
                disabled={mediaUploadLoading}
              />
            </label>
          )}
        </div>

        {/* Business Info */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#111b21]">
          {isEditing ? (
            <>
              <InputField
                label="About"
                value={form.about}
                onChange={(e) => handleChange('about', e.target.value)}
                maxLength={139} // Meta's limit
              />
              <div>
                <label className="block text-sm font-medium text-[#54656f] mb-1">
                  Industry (Vertical)
                </label>
                <select
                  value={form.vertical}
                  onChange={(e) => handleChange("vertical", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                >
                  <option value="">Select an industry</option>
                  {[
                    "OTHER",
                    "AUTO",
                    "BEAUTY",
                    "APPAREL",
                    "EDU",
                    "ENTERTAIN",
                    "EVENT_PLAN",
                    "FINANCE",
                    "GROCERY",
                    "GOVT",
                    "HOTEL",
                    "HEALTH",
                    "NONPROFIT",
                    "PROF_SERVICES",
                    "RETAIL",
                    "TRAVEL",
                    "RESTAURANT",
                    "ALCOHOL",
                    "ONLINE_GAMBLING",
                    "PHYSICAL_GAMBLING",
                    "OTC_DRUGS",
                  ].map((value) => (
                    <option key={value} value={value}>
                      {value.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                label="Description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
              <InputField
                label="Address"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
              <InputField
                label="Email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                type="email"
              />
              <InputField
                label="Websites (comma-separated)"
                value={form.websites?.join(', ')}
                onChange={handleWebsitesChange}
              />
            </>
          ) : (
            <>
              <div>
                <p className="font-medium text-[#54656f]">About</p>
                <p>{project?.about || 'No about information'}</p>
              </div>
              <div>
                <p className="font-medium text-[#54656f]">Industry</p>
                <p>{project?.vertical || 'Not specified'}</p>
              </div>
              <div>
                <p className="font-medium text-[#54656f]">Description</p>
                <p>{project?.description || 'No description provided'}</p>
              </div>
              <div>
                <p className="font-medium text-[#54656f]">Address</p>
                <p>{project?.address || 'No address provided'}</p>
              </div>
              <div>
                <p className="font-medium text-[#54656f]">Email</p>
                {project?.email ? (
                  <a href={`mailto:${project.email}`} className="text-[#25D366] hover:underline">
                    {project.email}
                  </a>
                ) : (
                  'No email provided'
                )}
              </div>
              <div>
                <p className="font-medium text-[#54656f]">Websites</p>
                {project?.websites?.length > 0 ? (
                  project.websites.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      className="text-[#25D366] hover:underline block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url} <FiExternalLink className="inline ml-1" />
                    </a>
                  ))
                ) : (
                  <p>No websites provided</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* WhatsApp Badge */}
      {/* <div className="mt-6 pt-4 border-t border-[#e9edef] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#25D366] w-7 h-7 rounded-full flex items-center justify-center">
            <FaWhatsapp className="text-white text-lg" />
          </div>
          <span className="text-sm text-[#54656f]">
            WhatsApp Business Profile
          </span>
        </div>

        <button className="bg-[#25D366] text-white px-4 py-2 rounded-md hover:bg-[#128C7E] transition-all text-sm">
          Contact Business
        </button>
      </div> */}
    </div>
  );
};

export default WhatsAppBusinessProfileCard;
