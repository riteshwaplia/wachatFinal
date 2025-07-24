// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { RiMessage3Line } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import { LuMessagesSquare } from "react-icons/lu";
import { loginValidation } from '../utils/validation'; // ✅ import validation
import { ErrorToast, SuccessToast } from '../utils/Toast'; // ✅ optional toast for better UX
import ForgotPassword from '../components/login/ForgotPassword';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [forgotUi, setForgotUi] = useState(false)



  console.log("loading", loading)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage({});

    const data = { email, password };
    const validationErrors = loginValidation(data);

    console.log("validationErrors", validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage(validationErrors);
      return;
    }


    if (password.length < 6) {
      ErrorToast("password  length must be at least 6")
      return
    }
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    try {
      setLoading(true)
      await delay(300);
      // const response = await api.post('/users/login', { email, password })

      const response = await login(email, password)



      console.log("response from login:", response);

      if (response?.success) {
        const user = response.user;

        SuccessToast("Logged in Successfully");
        setLoading(false)
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user?.role === "user") {
          navigate("/projects");
        } else {
          ErrorToast("please provide valid credentials.");
        }

      } else {
        ErrorToast("please provide valid credentials.");

      }
    } catch (error) {
      console.error("Login error:", error);

      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again later.";

      ErrorToast(errMsg);
    } finally {
      setLoading(false);
    }
  };

  console.log("login loading", loading)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center md:p-4">
      <div className='grid grid-cols-1 md:grid-cols-3 w-[95vw] md:w-[80vw] border rounded h-[80vh]'>
        <div className='col-span-2  md:flex bg-primary-500 flex flex-col  p-10 gap-y-3'>
          <h2 className='text-white font-semibold text-4xl'>Welcome Back</h2>
          <h3 className='text-white'>Sign in to access your WhatsApp marketing dashboard</h3>
          <div className='flex items-center flex-grow justify-center'>
            <div className='text-white text-5xl'>SabNode</div>
          </div>
          <div className='mt-auto'>
            <div className='grid grid-cols-6 w-[17vw] gap-8'>
              <div className='col-span-1 w-10 h-10 flex justify-center bg-white/30 items-center backdrop-blur rounded-full'>
                <RiMessage3Line size={20} className='text-white' />
              </div>
              <div className='col-span-5 '>
                <h3 className='text-white'>Whatsapp Marketing</h3>
                <h3 className='text-sm text-white/40'>Engage Tenants</h3>
              </div>
            </div>
          </div>
        </div>

        <Card title={forgotUi ? "Forgot Password" : "Login to Your Account"} className="w-full py-12 max-w-md">
          <div className='px-4 flex justify-center'>
            <div className='w-12 h-12 bg-primary-100 flex justify-center items-center rounded-full'>
              <LuMessagesSquare size={20} />
            </div>
          </div>

          {!forgotUi ? (
            <>
              <form onSubmit={handleSubmit}>
                <InputField
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errorMessage.email}
                  helperText={errorMessage.email}
                />
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errorMessage.password}
                  helperText={errorMessage.password}
                />
                <span
                  onClick={() => setForgotUi(true)}
                  className='text-sm flex justify-end text-primary-500 cursor-pointer hover:underline'
                >
                  Forgot Password
                </span>

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1 mt-6"
                  loading={loading}
                >
                  <div>{loading ? 'Logging In...' : 'Login'}</div>
                  <div><CiLogin size={18} className='text-white' /></div>
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-500 hover:underline">
                  Register here
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Your ForgotPassword Component or custom fields go here */}
              <ForgotPassword onBack={() => setForgotUi(false)} />
            </>
          )}
        </Card>

      </div>
    </div>
  );
};

export default LoginPage;
