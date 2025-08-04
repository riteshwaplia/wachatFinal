import React, { useState } from 'react'
import InputField from './InputField';
import Button from './Button';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { MdOutlineUpdate } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { useAuth } from '../context/AuthContext';
import { ErrorToast, SuccessToast } from '../utils/Toast';

export default function UpdatePassword() {
  const [oldpassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!oldpassword) newErrors.oldpassword = "Old password is required";

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least 8 characters, including 1 uppercase,lowercase,number, and special character";
    }


    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.match = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.put(`/users/reset-password`, {
        oldPassword: oldpassword,
        newPassword,
      });

      const { success, message, errors } = response.data;

      if (success) {
        SuccessToast(message || "Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        logout(); // ✅ If you want user to log in again
      } else {
        // Handle validation or server errors
        if (errors && Array.isArray(errors)) {
          errors.forEach((err) => ErrorToast(err)); // Show all errors
        } else {
          ErrorToast(message || "Failed to update password");
        }
      }

    } catch (error) {
      console.error("Reset password error:", error);

      const serverMessage = error.response?.data?.message;
      const serverErrors = error.response?.data?.errors;

      if (serverErrors && Array.isArray(serverErrors)) {
        serverErrors.forEach((err) => toast.error(err));
      } else if (serverMessage) {
        toast.error(serverMessage);
      } else {
        toast.error("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen w-full dark:border-dark-border border p-6' >
      <div className='text-2xl font-bold  dark:text-dark-text-primary'>
        Reset Password
      </div>
      <InputField placeholder="Enter old password here..." type='password' error={errors.oldpassword} value={oldpassword} onChange={(e) => {
        setOldPassword(e.target.value)
        setErrors(prev => ({ ...prev, oldpassword: '' }));
      }} className='mt-5' label="Old Password">
        <TbLockPassword />
      </InputField>
      <InputField placeholder="Enter new password here..." type='password' helperText={errors.newPassword} error={errors.newPassword} value={newPassword} onChange={(e) => {
        setNewPassword(e.target.value)
        setErrors(prev => ({ ...prev, newPassword: '' }));
        setErrors(prev => ({ ...prev, match: '' }));
      }} className='mt-5' label="New Password">
        <TbLockPassword />
      </InputField>
      <InputField placeholder="Repeat new password here..." type='password' helperText={errors.confirmPassword} error={errors.confirmPassword} value={confirmPassword} onChange={(e) => {
        setConfirmPassword(e.target.value)
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
        setErrors(prev => ({ ...prev, match: '' }));
      }} className='mt-5' label="Repeat  New Password">
        <TbLockPassword />
      </InputField>
      <div className="mt-4 p-4  dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg shadow-sm">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
          Tip: Use a strong password with
        </p>
        <ul className="text-sm text-gray-600dark:border-dark-border   dark:text-dark-text-primary space-y-1 pl-1">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✔</span> At least 8 characters
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">✔</span> Uppercase & lowercase letters
          </li>
          <li className="flex items-center gap-2">
            <span className="text-yellow-500">✔</span> Numbers
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-500">✔</span> Special characters
            <span className="font-mono text-gray-500 dark:text-gray-300">Exaple@123</span>
          </li>
        </ul>
      </div>


      {/* {
        errors.match && <p className='text-red-500 text-sm'>{errors.match}</p>
      } */}
      <Button loading={loading} onClick={handleSubmit} className='block ml-auto mt-10 flex items-center gap-2'>
        {!loading && <div className='flex items-center gap-1'>Reset Password <MdOutlineUpdate /></div>}
      </Button>
    </div>
  )
}
