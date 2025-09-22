export const getMetaBusinessId = () => {
    // 1. Retrieve the 'currentProject' string from localStorage
    const currentProjectString = localStorage.getItem('currentProject');
 
    // 2. Check if the string exists. metaBusinessId
    if (!currentProjectString) {
        console.error("No 'currentProject' found in localStorage.");
        return null;
    }
 
    try {
        // 3. Parse the JSON string into a JavaScript object
        const currentProject = JSON.parse(currentProjectString);
 
        // 4. Safely access the nested metaBusinessId property
        const metaBusinessId = currentProject?.businessProfileId?._id;
 
        // 5. Check if the property was found and return it
        if (metaBusinessId) {
            return metaBusinessId;
        } else {
            console.error("metaBusinessId not found within 'currentProject'.");
            return null;
        }
    } catch (e) {
        console.error("Failed to parse 'currentProject' JSON:", e);
        return null;
    }
}
 
 
 