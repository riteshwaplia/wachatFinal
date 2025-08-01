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
import { KeyRound } from 'lucide-react';

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

      // If response is structured like: { success: true, message: "...", data: {...} }
      if (response.data?.success) {
        setOtpSent(true);  // Set state to show OTP input
        SuccessToast('OTP sent to your email. Please verify.');
        console.log("User registered:", response.data.data); // Optional
      } else {
        console.log("respnseonse", response.data?.message)
        ErrorToast(response.data?.message || 'Registration failed.');
      }
    } catch (error) {
      const errorData = error.response?.data;
      let message = 'Something went wrong';

      if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
        message = errorData.errors[0]; // or join all: errorData.errors.join(', ')
      } else if (errorData?.message) {
        message = errorData.message;
      } else {
        message = error.message;
      }

      console.log("errr", message);
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





  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 w-[95vw] md:w-[80vw] border rounded h-[80vh] overflow-hidden">
        {/* Left Side (Hidden on Mobile) */}
        <div className="col-span-2 hidden md:flex bg-primary-500 flex-col p-10 gap-y-3">
          <h2 className="text-white font-semibold text-4xl">{t('welcomeBack')}</h2>
          <h3 className="text-white">{t('signInToDashboard')}</h3>
          <div className="flex items-center flex-grow justify-center">
            <div className="text-white text-5xl font-bold">SabNode</div>
          </div>
          <div className="mt-auto">
            <div className="grid grid-cols-6 w-[17vw] gap-8">
              <div className="col-span-1 w-10 h-10 flex justify-center bg-white/30 items-center backdrop-blur rounded-full">
                <RiMessage3Line size={20} className="text-white" />
              </div>
              <div className="col-span-5">
                <h3 className="text-white">{t('whatsappMarketing')}</h3>
                <h3 className="text-sm text-white/40">{t('engageTenants')}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <Card title={t('registerAccount')} className="w-full max-w-md py-6">
          <div className='px-4 flex  justify-center'>
            <div className='w-12 h-12  flex justify-center items-center rounded-full'>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-18 h-auto" />
              ) : (
                <KeyRound size={20} />
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
