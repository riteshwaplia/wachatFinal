export const validateRegistrationForm = (formData) => {
    const { username, email, password, confirmPassword } = formData;
    const errors = {};

    if (!username?.trim()) {
        errors.username = "Username is required";
    } else if (username.length < 3) {
        errors.username = "Username must be at least 3 characters";
    }

    if (!email?.trim()) {
        errors.email = "Email is required";
    }
    // else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    //     errors.email = "Enter a valid email address";
    // }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};


// businessProfileValidation.js
export const validateBusinessProfile = (formData) => {
    const errors = {};

    // Business Name
    if (!formData.name.trim()) {
        errors.name = "Business name is required.";
    } else if (formData.name.length > 50) {
        errors.name = "Business name cannot exceed 50 characters.";
    }

    // WABA ID
    if (!formData.wabaId.trim()) {
        errors.wabaId = "WhatsApp Business Account ID is required.";
    } else if (formData.wabaId.length > 60) {
        errors.wabaId = "WABA ID cannot exceed 60 characters.";
    }

    // Meta App ID
    if (!formData.metaAppId.trim()) {
        errors.metaAppId = "WhatsApp Business App ID is required.";
    } else if (formData.metaAppId.length > 60) {
        errors.metaAppId = "Meta App ID cannot exceed 60 characters.";
    }

    // Access Token
    if (!formData.accessToken.trim()) {
        errors.accessToken = "Meta Access Token is required.";
    } else if (formData.accessToken.length < 10) {
        errors.accessToken = "Meta Access Token is too short.";
    }

    return errors;
};


export const loginValidation = (logindata) => {

    const errors = {}
    const { email, password } = logindata;

    if (!email?.trim()) {
        errors.email = 'email is required'
    }
    if (!password?.trim()) {
        errors.password = 'password is required'
    }

    return errors
}