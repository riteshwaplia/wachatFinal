// src/pages/LoginPage.jsx
import React, { use, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { CiLogin } from "react-icons/ci";
import { loginValidation } from '../utils/validation'; // ✅ import validation
import { ErrorToast, SuccessToast } from '../utils/Toast'; // ✅ optional toast for better UX
import ForgotPassword from '../components/login/ForgotPassword';
import { useTranslation } from 'react-i18next';
import { Fingerprint, KeyRound } from 'lucide-react';
import { useTenant } from '../context/TenantContext';
import AutoSlider from '../components/features/Slider';
import LogoAnimation from '../components/LogoAnimation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible,setVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState({});
  const { login, authLoading, user } = useAuth(); // Get authLoading from context
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false); // Renamed for clarity
  const [forgotUi, setForgotUi] = useState(false)
  const { t } = useTranslation();
  const { siteConfig } = useTenant();


  const { logoUrl } = siteConfig;
  useEffect(()=>
  {
const interval =setInterval(() => {
  setVisible((prev)=>!prev);
}, 400);
return () => clearInterval(interval);
  },[])
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "user") {
        navigate("/projects");
      } else if (user.role === "super_admin" || user.role === "tanent_admin") {
        navigate("/admin/dashboard");
      }
    }
  }, [user, authLoading, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage({});
    setFormLoading(true); // start loading
    const data = { email, password };
    const validationErrors = loginValidation(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage(validationErrors);
      setFormLoading(false); // stop loading if validation fails
      return;
    }

    if (password.length < 6) {
      ErrorToast("password length must be at least 6");
      setFormLoading(false); // stop loading if password is invalid
      return;
    }

    try {
      const response = await login(email, password);

      if (response?.success) {
        const user = response.user;
        SuccessToast("Logged in Successfully");

        if (user?.role === "super_admin" || user?.role === "tanent_admin") {
          navigate("/admin/dashboard");
        } else if (user?.role === "user") {
          navigate("/projects");
        } else if (user?.role === "super_admin" || user?.role === "tanent_admin") {
          navigate('/admin/add-tenant-admin');
        }
      } else {
        ErrorToast("Please provide valid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again later.";
      ErrorToast(errMsg);
    } finally {
      setFormLoading(false)
    }
  };

  if (authLoading) {
    return (
      // <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      //   <div className="text-center">
      //     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
      //     <p className="mt-4 text-gray-600">{t('verifyingSession')}</p>
      //   </div>
      // </div>
//       <div className='flex items-center justify-center h-screen bg-white'>
// <img src={logo} alt="loading"  className={`w-64 h-64 transition-opacity duration-100 ${visible?'opacity-100':'opacity-0'}`} />
//       </div>
<LogoAnimation/>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center md:p-4">
      <div className='grid grid-cols-1 md:grid-cols-3 w-[95vw] md:w-[80vw] rounded border  h-[80vh]'>
        <div className="col-span-2 hidden md:flex flex-col p-12 gap-y-6 
                bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 
                shadow-xl rounded-l relative overflow-hidden">

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



        <Card title={forgotUi ? t('forgotPassword') : t('loginToYourAccount')} className="w-full lg:rounded-none rounded-xl lg:rounded-r py-12 max-w-md">
          <div className='px-4 flex  justify-center'>
            <div className='w-12 h-12  flex justify-center items-center rounded-full'>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-18 h-auto" />
              ) : (
                <Fingerprint size={20} />
              )}
            </div>

          </div>

          {!forgotUi ? (
            <>
              <form onSubmit={handleSubmit}>
                <InputField
                  id="email"
                  label={t('emailAddress')}
                  type="email"
                  placeholder={t('enterYourEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errorMessage.email}
                  helperText={errorMessage.email}
                />
                <InputField
                  id="password"
                  label={t('password')}
                  type="password"
                  placeholder={t('enterYourPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errorMessage.password}
                  helperText={errorMessage.password}
                />
                <span
                  onClick={() => setForgotUi(true)}
                  className='text-sm flex justify-end text-primary-500 cursor-pointer hover:underline'
                >
                  {t('forgotPassword')}
                </span>

                <Button
                  type="submit"
                  className="w-full btn flex items-center justify-center gap-1 mt-6"
                  loading={formLoading}
                >
                  <div>{formLoading ? t('loggingIn') : t('login')}</div>
                  <div><CiLogin size={18} className='text-white' /></div>
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                {t('dontHaveAccount')}{' '}
                <Link to="/register" className="text-primary-500 hover:underline">
                  {t('registerHere')}
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
