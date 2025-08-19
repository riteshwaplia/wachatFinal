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


// businessProfileValidation.js
export const validateWhatsAppBusinessProfile = (formData) => {
    const errors = {};

    // Regex rules
    const aboutRegex = /^[A-Za-z0-9_\s]+$/;        // letters, numbers, underscore, spaces
    const descriptionRegex = /^[A-Za-z0-9\s]+$/;   // letters, numbers, spaces only
    const addressRegex = /^[A-Za-z0-9\s,]+$/;      // letters, numbers, spaces, commas
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/;

    // About (optional)
    if (formData.about?.trim()) {
        if (!aboutRegex.test(formData.about)) {
            errors.about = "About can only contain letters, numbers, spaces, and underscores (_).";
        } else if (formData.about.length > 139) {
            errors.about = "About cannot exceed 139 characters.";
        }
    }

    // Description (optional)
    if (formData.description?.trim()) {
        if (!descriptionRegex.test(formData.description)) {
            errors.description = "Description can only contain letters, numbers, and spaces.";
        } else if (formData.description.length > 500) {
            errors.description = "Description cannot exceed 500 characters.";
        }
    }

    // Address (optional)
    if (formData.address?.trim()) {
        if (!addressRegex.test(formData.address)) {
            errors.address = "Address can only contain letters, numbers, spaces, and commas.";
        } else if (formData.address.length > 200) {
            errors.address = "Address cannot exceed 200 characters.";
        }
    }

    // Email (optional)
    if (formData.email?.trim()) {
        if (!emailRegex.test(formData.email)) {
            errors.email = "Invalid email address.";
        }
    }

    // Websites (optional)
    if (formData.websites && formData.websites.length > 0) {
        const invalidUrls = formData.websites.filter((url) => !urlRegex.test(url));
        if (invalidUrls.length > 0) {
            errors.websites = `Invalid website URL(s): ${invalidUrls.join(", ")}`;
        } else if (formData.websites.length > 5) {
            errors.websites = "You can add a maximum of 5 websites.";
        }
    }

    // Vertical (optional)
    if (formData.vertical?.trim()) {
        const validIndustries = [
            "OTHER", "AUTO", "BEAUTY", "APPAREL", "EDU", "ENTERTAIN", "EVENT_PLAN",
            "FINANCE", "GROCERY", "GOVT", "HOTEL", "HEALTH", "NONPROFIT", "PROF_SERVICES",
            "RETAIL", "TRAVEL", "RESTAURANT", "ALCOHOL", "ONLINE_GAMBLING",
            "PHYSICAL_GAMBLING", "OTC_DRUGS"
        ];
        if (!validIndustries.includes(formData.vertical)) {
            errors.vertical = "Invalid industry selected.";
        }
    }

    return errors;
};






// <!-- Meta Pixel Code -->
// <script>
// !function(f,b,e,v,n,t,s)
// {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
// n.callMethod.apply(n,arguments):n.queue.push(arguments)};
// if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
// n.queue=[];t=b.createElement(e);t.async=!0;
// t.src=v;s=b.getElementsByTagName(e)[0];
// s.parentNode.insertBefore(t,s)}(window, document,'script',
// 'https://connect.facebook.net/en_US/fbevents.js');
// fbq('init', '770050692187887');
// fbq('track', 'PageView');
// </script>
// <noscript><img height="1" width="1" style="display:none"
// src="https://www.facebook.com/tr?id=770050692187887&ev=PageView&noscript=1"
// /></noscript>
// <!-- End Meta Pixel Code -->