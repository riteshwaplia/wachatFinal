import React, { useState } from 'react'
import InputField from './InputField';
import Button from './Button';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MdOutlineUpdate } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
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
    if (!oldpassword) {
      newErrors.oldpassword = "password must be required";

    }
    if (!newPassword) {
      newErrors.newPassword = "NewPassword must be required";

    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "ConfirmPassword must be required";

    }
    if (newPassword !== confirmPassword) {
      newErrors.match = "Passwords do not match";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const response = await api.put(`/users/reset-password`, { "oldPassword": oldpassword, newPassword });
      console.log("response", response);
      if (response.data.status === 200) {
        toast.success("password updated");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        logout();

      }

    } catch (error) {
      console.error("Error fetching bulk send jobs:", error);
    }
    finally {
      setLoading(false);
    }

  }
  return (
    <div className='h-screen w-full border p-6' >
      <div className='text-2xl font-bold '>
        Reset Password
      </div>
      <InputField placeholder="Enter old password here..." type='password' error={errors.oldpassword} value={oldpassword} onChange={(e) => {
        setOldPassword(e.target.value)
        setErrors(prev => ({ ...prev, oldpassword: '' }));
      }} className='mt-5' label="Old Password">
        <TbLockPassword />
      </InputField>
      <InputField placeholder="Enter new password here..." type='password' error={errors.newPassword} value={newPassword} onChange={(e) => {
        setNewPassword(e.target.value)
        setErrors(prev => ({ ...prev, newPassword: '' }));
        setErrors(prev => ({ ...prev, match: '' }));
      }} className='mt-5' label="New Password">
        <TbLockPassword />
      </InputField>
      <InputField placeholder="Repeat new password here..." type='password' error={errors.confirmPassword} value={confirmPassword} onChange={(e) => {
        setConfirmPassword(e.target.value)
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
        setErrors(prev => ({ ...prev, match: '' }));
      }} className='mt-5' label="Repeat  New Password">
        <TbLockPassword />
      </InputField>
      {
        errors.match && <p className='text-red-500 text-sm'>{errors.match}</p>
      }
      <Button loading={loading} onClick={handleSubmit} className='block ml-auto mt-10 flex items-center gap-2'>
        {!loading && <div className='flex items-center gap-1'>Reset Password <MdOutlineUpdate /></div>}
      </Button>
    </div>
  )
}