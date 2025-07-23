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