// // src/pages/RegisterPage.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Will use later for proper routing
// import Card from '../components/Card';
// import InputField from '../components/InputField';
// import Button from '../components/Button';
// import Alert from '../components/Alert';
// import { useAuth } from '../context/AuthContext';

// const RegisterPage = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const { register, loading } = useAuth(); // Get register function and loading state from AuthContext
//   const navigate = useNavigate(); // For programmatic navigation

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage(''); // Clear previous errors

//     if (password !== confirmPassword) {
//       setErrorMessage('Passwords do not match.');
//       return;
//     }

//     if (password.length < 6) { // Basic client-side validation
//       setErrorMessage('Password must be at least 6 characters long.');
//       return;
//     }

//     const response = await register(username, email, password);
//     if (response.success) {
//       alert('Registration successful! Redirecting to dashboard...'); // Use alert for now
//       navigate('/projects'); // Redirect to a dashboard or home page
//     } else {
//       setErrorMessage(response.error || 'Registration failed.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <Card title="Register Account" className="w-full max-w-md">
//         {errorMessage && <Alert type="error" message={errorMessage} className="mb-4" />}
//         <form onSubmit={handleSubmit}>
//           <InputField
//             id="username"
//             label="Username"
//             type="text"
//             placeholder="Enter your username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
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
//           <InputField
//             id="confirmPassword"
//             label="Confirm Password"
//             type="password"
//             placeholder="Confirm your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <Button type="submit" className="w-full mt-6" disabled={loading}>
//             {loading ? 'Registering...' : 'Register'}
//           </Button>
//         </form>
//         <p className="text-center text-sm text-gray-600 mt-4">
//           Already have an account?{' '}
//           <a href="/login" className="text-primary-500 hover:underline">
//             Login here
//           </a>
//         </p>
//       </Card>
//     </div>
//   );
// };

// export default RegisterPage;


// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { validateRegistrationForm } from '../utils/validation';
import { ErrorToast, SuccessToast } from '../utils/Toast';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setError] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const { register, loading } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username,
      email,
      password,
      confirmPassword
    };

    const err = validateRegistrationForm(formData);

    if (Object.keys(err).length > 0) {
      setError(err);
      return;
    }

    try {
      const response = await register(username, email, password);
      console.log("response", response)

      if (response.success) {
        SuccessToast('Registration successful! Redirecting to dashboard...');
        navigate('/projects');
      } else {
        // Server responded with success: false
        ErrorToast(response.error || 'Registration failed.');
      }
    } catch (error) {
      // Server threw an exception or network error
      if (error.response?.data?.error) {
        ErrorToast(error.response.data.error); // Detailed backend error message`
      } else if (error.message) {
        ErrorToast(error.message); // Network or unexpected errors
      } else {
        ErrorToast('Something went wrong. Please try again.');
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card title="Register Account" className="w-full max-w-md">
        {errorMessage && <Alert type="error" message={errorMessage} className="mb-4" />}
        <form >
          <InputField
            id="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setError(prev => ({ ...prev, username: '' }));
            }}
            error={errors.username}
            helperText={errors.username}
          />

          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setError(prev => ({ ...prev, email: '' }));
            }}
            error={errors.email}
            helperText={errors.email}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setError(prev => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            helperText={errors.password}
          />

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setError(prev => ({ ...prev, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <Button onClick={handleSubmit} type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-primary-500 hover:underline">
            Login here
          </a>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
