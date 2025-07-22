// // src/pages/LoginPage.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Will use later for proper routing
// import Card from '../components/Card';
// import InputField from '../components/InputField';
// import Button from '../components/Button';
// import Alert from '../components/Alert';
// import { useAuth } from '../context/AuthContext';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const { login, loading } = useAuth(); // Get login function and loading state from AuthContext
//   const navigate = useNavigate(); // For programmatic navigation

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage(''); // Clear previous errors

//     const response = await login(email, password);
//     console.log("response from login:", response); 
//     if (response.success) {
//       if(response.user && (response.user.role === 'super_admin' || response.user.role === 'tenant_admin') ) {
//         navigate('/admin/dashboard'); // Redirect to admin dashboard if user is an admin
//       }else if(response.user && response.user.role === 'user') {navigate('/projects'); }// Redirect to user dashboard if user is a regular users}
//     } else {
//       setErrorMessage(response.error || 'Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <Card title="Login to Your Account" className="w-full max-w-md">
//         {errorMessage && <Alert type="error" message={errorMessage} className="mb-4" />}
//         <form onSubmit={handleSubmit}>
//           <InputField
//             id="email"
//             label="Email Address"
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <InputField
//             id="password"
//             label="Password"
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <Button type="submit" className="w-full mt-6" disabled={loading}>
//             {loading ? 'Logging In...' : 'Login'}
//           </Button>
//         </form>
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Don't have an account?{' '}
//           <a href="/register" className="text-primary-500 hover:underline">
//             Register here
//           </a>
//         </p>
//       </Card>
//     </div>
//   );
// };

// export default LoginPage;




// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { loginValidation } from '../utils/validation';
import { ErrorToast, SuccessToast } from '../utils/Toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage({});

  const data = { email, password };
  const validationErrors = loginValidation(data);

  if (Object.keys(validationErrors).length > 0) {
    setErrorMessage(validationErrors);
    return;
  }

  if (password.length < 6) {
    ErrorToast("Password must be at least 6 characters.");
    return;
  }

  try {
    const response = await login(email, password);
    console.log("Login response:", response);

    if (response?.success && response.user) {
      const { role } = response.user;

      SuccessToast("Logged in Successfully");

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "user") {
        navigate("/projects");
      } else {
        ErrorToast("Unknown user role. Please contact support.");
      }

    } else {
      const errMsg = response?.error || "Login failed. Please check your credentials.";
      ErrorToast(errMsg);
    }
  } catch (error) {
    console.error("Login error:", error);
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again later.";
    ErrorToast(errMsg);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card title="Login to Your Account" className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage.email) {
                setErrorMessage((prev) => ({ ...prev, email: "" }));
              }
            }}
            error={errorMessage.email}
            helperText={errorMessage.email}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage.password) {
                setErrorMessage((prev) => ({ ...prev, password: "" }));
              }
            }}
            error={errorMessage.password}
            helperText={errorMessage.password}
          />

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Logging In...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:underline">
            Register here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
