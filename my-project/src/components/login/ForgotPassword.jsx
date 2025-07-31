import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import InputField from '../InputField';
import { ErrorToast, SuccessToast } from '../../utils/Toast';
import api from '../../utils/api';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword({ onBack }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()
    const validateEmail = () => {
        if (!email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return 'Invalid email format';
        return '';
    };

    const validateInputs = () => {
        const newErrors = {};



        if (password.length < 6) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSendOtp = async () => {
        // 
        const emailErr = validateEmail();
        if (emailErr) {
            setErrors({ email: emailErr });
            return;
        }

        try {
            setLoading(true)
            await api.post(`/users/forgot-password`, { email });
            SuccessToast('OTP sent successfully to your email');
            setErrors({});
            setStep(2); // Move directly to password reset + OTP entry
        } catch (error) {
            ErrorToast(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false)

        }
    };

    const handleResetPassword = async () => {
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            const payload = {
                email,
                otp,
                newPassword: password,
            };

            const response = await api.post("/users/update-password-with-otp", payload);

            if (response?.data?.success) {
                onBack()
                SuccessToast("Password reset successfully!");
                // Redirect to login or reset state
            } else {
                ErrorToast(response?.data?.message || "Something went wrong.");
            }
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "An error occurred. Please try again later.";
            ErrorToast(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full py-8 max-w-md space-y-6">
            {step === 1 && (
                <>
                    <InputField
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        error={errors.email}
                        helperText={errors.email}
                    />
                    <Button
                        loading={loading}
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                        {loading ? 'sending...' : 'Send Otp'}

                    </Button>
                </>
            )}

            {step === 2 && (
                <>
                    <InputField
                        id="otp"
                        label="Enter OTP"
                        type="text"
                        placeholder="6-digit OTP"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            setErrors((prev) => ({ ...prev, otp: '' }));
                        }}
                        error={errors.otp}
                        helperText={errors.otp}
                    />

                    <InputField
                        id="password"
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, password: '' }));
                        }}
                        error={errors.password}
                        helperText={errors.password}
                    />

                    {/* Strength Indicator */}
                    <div className="flex space-x-2">
                        <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-primary-500' : 'bg-primary-200'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${password.length >= 12 ? 'bg-primary-500' : 'bg-primary-200'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-primary-500' : 'bg-primary-200'}`}></div>
                    </div>

                    <InputField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }}
                        error={errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />

                    <Button
                        type="button"
                        onClick={handleResetPassword}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        loading={loading}
                    >
                        {loading ? 'saving...' : 'change Password'}
                    </Button>
                </>
            )}

            {/* Back button */}
            <div className="mt-8 text-center">
                <button
                    type="button"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-900 transition-colors"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to log in
                </button>
            </div>
        </div>
    );
}
