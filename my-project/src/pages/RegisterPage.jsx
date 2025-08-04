// src/pages/RegisterPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { RiMessage3Line } from "react-icons/ri";
import { MdArrowForward } from "react-icons/md";
import { validateRegistrationForm } from '../utils/validation';
import { ErrorToast, SuccessToast } from '../utils/Toast';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import { useTenant } from '../context/TenantContext';
import { Fingerprint, KeyRound } from 'lucide-react';
import AutoSlider from '../components/features/Slider';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false)
  const { siteConfig } = useTenant();


  const { logoUrl } = siteConfig;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    let processedValue = value;

    if (id === 'username') {
      // Allow only letters, numbers, @, and _
      processedValue = value.replace(/[^a-zA-Z0-9@_]/g, '');
    }

    setForm((prev) => ({ ...prev, [id]: processedValue }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };


  const handleOtpChange = (e) => {
    const value = e.target.value// remove non-digit characters
    setOtp(value);
  };


  console.log("otp state test", otpSent)

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("OTP status before submit:", otpSent);

    // Validate form fields
    const err = validateRegistrationForm(form);
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setLoading(true);

    try {
      const { username, email, password } = form;

      const response = await api.post('/users/register', { username, email, password });
      const resData = response.data;

      if (resData?.success) {
        // ✅ Set OTP state
        setOtpSent(true);

        // ✅ Show server message
        SuccessToast(resData.message || 'OTP sent to your email. Please verify.');

        // ✅ Optionally store token in localStorage if needed for next step
        if (resData.data?.token) {
          localStorage.setItem('authToken', resData.data.token);
        }

        // ✅ Log or store user data
        console.log("User registered:", resData.data);

      } else {
        // ❌ API returned success=false
        ErrorToast(resData?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      const errorData = error.response?.data;
      let message = 'Something went wrong';

      if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
        message = errorData.errors[0];
      } else if (errorData?.message) {
        message = errorData.message;
      } else {
        message = error.message;
      }

      console.error("Registration error:", message);
      ErrorToast(message);
    } finally {
      setLoading(false);
    }
  };


  const handleOtpVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      ErrorToast('OTP is required');
      return;
    }

    setLoading(true);

    try {
      const { data: response } = await api.post('/users/verifyOtp', {
        email: form.email,
        otp: otp.trim(),
      }, { timeout: 3000 });

      if (response?.success) {
        SuccessToast(response.message || 'OTP verified successfully');
        navigate("/login");
      } else {
        ErrorToast(response?.message || 'Invalid OTP');
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'OTP verification failed';
      ErrorToast(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleReSendOtp = async () => {
    const email = form.email?.trim();

    // ✅ Validate email before calling API
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    try {
      setResendLoading(true);

      // ✅ Call API
      const response = await api.post(`/users/resend-otp`, { email, type: 'register' });
      const resData = response.data;

      if (resData?.success) {
        // ✅ Show success toast with backend message
        SuccessToast(resData.message || 'OTP resent successfully to your email');

        // ✅ Clear form errors
        setErrors({});

        // ✅ Move to OTP step (if using stepper flow)
        // setStep(2);
      } else {
        // ❌ Backend responded with success=false
        ErrorToast(resData?.message || 'Failed to resend OTP. Please try again.');
      }

    } catch (error) {
      // ✅ Handle network or unexpected errors
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        'Something went wrong while resending OTP.';
      ErrorToast(message);
    } finally {
      setResendLoading(false);
    }
  };





  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 w-[95vw] md:w-[80vw] border rounded h-[80vh] overflow-hidden">
        {/* Left Side (Hidden on Mobile) */}
        <div className="col-span-2 hidden md:flex flex-col p-12 gap-y-6 
                bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 
                shadow-xl  relative overflow-hidden">

          {/* Animated Background Elements for Modern Look */}
          <div className="absolute inset-0">
            <div className="absolute w-40 h-40 bg-white/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
            <div className="absolute w-56 h-56 bg-white/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse delay-200"></div>
          </div>

          {/* Top Welcome Text */}
          <div className="relative z-10">
            <h2 className="text-white font-extrabold text-5xl leading-tight drop-shadow-lg">
              {t('welcomeBack')}
            </h2>
            <h3 className="text-white text-lg mt-2 opacity-90">
              {t('signInToDashboard')}
            </h3>
          </div>

          {/* Center Brand Logo / Fallback Text */}
          <div className="flex flex-grow items-center justify-center relative z-10">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="max-h-28 w-auto object-contain"  // ensures proper scaling
              />
            ) : (
              <div className="text-white text-5xl font-bold"></div>
            )}
          </div>

          {/* AutoSlider at the Bottom */}
          <div className="mt-auto relative z-10">
            <AutoSlider />
          </div>
        </div>



        {/* Right Side (Form) */}
        <Card title={t('registerAccount')} className="w-full max-w-md py-6 lg:rounded-none rounded-xl lg:rounded-r">
          <div className='px-4 flex  justify-center'>
            <div className='w-12 h-12  flex justify-center items-center rounded-full'>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-18 h-auto" />
              ) : (
                <Fingerprint size={20} />
              )}
            </div>

          </div>
          {!otpSent ? (
            <form onSubmit={handleSubmit}>
              <InputField
                id="username"
                label={t('username')}
                type="text"
                placeholder={t('enterYourUsername')}
                value={(form.username)}
                onChange={handleInputChange}
                error={errors.username}
                helperText={errors.username}


              />
              <InputField
                id="email"
                label={t('emailAddress')}
                type="email"
                placeholder={t('enterYourEmail')}
                value={form.email}
                onChange={handleInputChange}
                error={errors.email}
                helperText={errors.email}

              />
              <InputField
                id="password"
                label={t('password')}
                type="password"
                placeholder={t('enterYourPassword')}
                value={form.password}
                onChange={handleInputChange}
                error={errors.password}
                helperText={errors.password}


              />
              <InputField
                id="confirmPassword"
                label={t('confirmPassword')}
                type="password"
                placeholder={t('confirmYourPassword')}
                value={form.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <Button type='submit' loading={loading} className="w-full btn mt-6" >
                <div className="flex  justify-center items-center gap-2">
                  {t('register')}
                  <MdArrowForward />
                </div>
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerify} >
              <div className="m-4">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  {t('otpVerification')}
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder={t('enterOtp')}
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <div className='flex justify-end items-start mb-2'>
                  <button
                    disabled={resendLoading}
                    // type="button"
                    onClick={handleReSendOtp}
                    className="w-auto text-primary-600 mt-3 dark:text-primary-400 text-xs hover:underline font-medium hover:cursor-pointer disabled:text-gray-400 transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              <Button type='submit' loading={loading} className="w-full btn mt-6" >
                <div className="flex  justify-center items-center gap-2">
                  {t('verify')}
                  <MdArrowForward />
                </div>
              </Button>
            </form>


          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-primary-500 hover:underline">
              {t('loginHere')}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
