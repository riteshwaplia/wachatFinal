import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import CustomSelect from '../components/CustomSelect';
import { MobileNumber } from '../components/MobileNumber';
import { INDIAN_STATE } from "../components/constants/IndinState";
import { countries } from '../components/constants/Countries';
import { INDUSTRY_TYPES } from '../components/constants/industryTypes';
import { currencyOptions } from '../components/constants/currency';
import { timeZoneOptions } from '../components/constants/timeZone';
import { FaCamera } from 'react-icons/fa';
import { IoMdPersonAdd } from "react-icons/io";
import { useEffect } from 'react';
import api from '../utils/api';
import axios from 'axios';
import { resolvePath, useParams } from 'react-router-dom';
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts[0]?.[0]?.toUpperCase() + (parts[1]?.[0]?.toUpperCase() || '');
};
export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [data, setData] = useState({});
  console.log("data", data);
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: '',
    password: '12345',
    company: 'waplia',
    country: 'India',
    state: 'rajasthan',
    companySize: 'large',
    industry: 'it',
    currency: '$9000',
    timezone: 'day',
  });

  const [tab, setTab] = useState("perDetails");
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        console.log("res", res.data._id)
        setUserId(res?.data?._id)
        setUser({
          name: res.data.username || '',
          email: res.data.email || '',
          mobile: res.data.mobile || '',
          password: '12345',
          company: res.data.company || '',
          country: res.data.country || 'India',
          state: res.data.state || '',
          companySize: res.data.companySize || '',
          industry: res.data.industry || '',
          currency: res.data.currency || '',
          timezone: res.data.timezone || '',
        });
        console.log("res", res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [data])
  console.log("user", user)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  console.log("userId", userId)

  const handleChange = (key, value) => {
    console.log("use>>>r", key, value)
    setUser((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    const newErrors = {};
    if (!user.name) newErrors.name = 'Name is required';
    if (!user.mobile) newErrors.phonenumber = 'Mobile is required';
    if (!user.password) newErrors.password = 'Password is required';
    // if (!user.companySize) newErrors.companySize = 'Company size is required';
    if (!user.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    console.log("erros", newErrors)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("clicked")


    try {
      const payload = {
        email: user.email,
        username: user.name, // or use a separate `username` field if you have it
        firstName: user.firstName || '', // if present
        lastName: user.lastName || '', // if present
        mobileNumber: user.mobile,
        profilePicture: user.profilePicture || '', // optional
        gender: user.gender || '',
        dob: user.dob || ''
      };
      console.log("useridddd", userId)
      const response = await api.put(`/user/update-self/${userId}`, payload);

      if (response?.data?.success) {
        console.log('User updated successfully:', response.data);
        // Optionally show success toast or redirect
      } else {
        console.error('Update failed:', response.data?.message);
        // Optionally show error toast
      }
    } catch (error) {
      console.error('API error:', error);
      // Optionally show error toast
    }
  };


  const industryOptions = INDUSTRY_TYPES.map((i) => ({ value: i, label: i }));
  const countryOptions = countries.map((c) => ({ value: c.name, label: c.name }));
  const indianStateOptions = Object.entries(INDIAN_STATE).map(([key, val]) => ({ value: key, label: val }));
  const companySize = [
    { id: 1, name: '1 to 10 employees', value: 10 },
    { id: 2, name: '11 to 50 employees', value: 50 },
    { id: 3, name: '51 to 100 employees', value: 100 },
    { id: 4, name: '101 to 200 employees', value: 200 },
    { id: 5, name: '201 to 500 employees', value: 500 },
    { id: 6, name: '501 to 1,000 employees', value: 1000 },
    { id: 7, name: '1,001 to 5,000 employees', value: 5000 },
    { id: 8, name: '5,001 to 10,000 employees', value: 10000 },
    { id: 9, name: '10,001 to 50,000 employees', value: 50000 },
  ];
  const compnayoptions = companySize.map((c) => ({ value: c.value, label: c.name }));

  const handlePhoneChange = (number) => {
    if (errors.phonenumber) {
      setErrors(prev => ({ ...prev, phonenumber: '' }));
    }
    setUser(prev => ({ ...prev, mobile: number }));
  };

  return (
    <div className="text-gray-800  dark:text-gray-100">



      {
        tab === "perDetails" &&
        <div className=" flex-grow md:p-4 p-4 overflow-hidden md:p-6 lg:p-8 transition-all  duration-300 w-[100vw] md:w-auto">
          <div className="flex flex-col gap-8">
            <div className="flex relative flex-col md:flex-row items-center gap-6">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-40 h-40 rounded-full border-4 border-primary-500 object-cover" />
              ) : (
                <div className="w-40 h-40 rounded-full bg-accent-500 text-white text-5xl font-bold flex items-center justify-center">
                  {getInitials(user.name)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-heading text-primary-600">{user.name}</h2>
                <p className="text-gray-500">User Profile</p>
              </div>
              {isEditable && (
                <label htmlFor="profile-upload" className="cursor-pointer absolute  top-[80px] left-[198px]  md:left-[140px] md:top-[100px] p-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <FaCamera size={20} className="text-gray-700 dark:text-white" />
                  <input type="file" id="profile-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 text-black md:grid-cols-2 gap-3 md:gap-6">
              <InputField label="Name" error={errors.name} value={user.name} onChange={(e) => handleChange('name', e.target.value)} type="text" placeholder="Name" disabled={!isEditable} />
              <InputField disable={true} label="Email" error={errors.email} value={user.email} onChange={(e) => handleChange('email', e.target.value)} type="email" placeholder="Email" />
              {/* <MobileNumber error={errors.phonenumber} label="Mobile Number" value={user.mobile ||  } onChange={handlePhoneChange} country="in" placeholder="Mobile Number" /> */}
              <MobileNumber
                disabled={!isEditable}
                error={errors.phonenumber}
                label="Mobile Number"
                value={user.mobile || ''}
                onChange={handlePhoneChange}
                country="in"
                autoFocus={false}
              />


              <InputField label="Password" error={errors.password} value={user.password} onChange={(e) => handleChange('password', e.target.value)} type="password" placeholder="Password" disabled={!isEditable} />

              {isEditable ? (
                <CustomSelect label="Company Size" options={compnayoptions} value={compnayoptions.find((o) => o.value === user.companySize)} onChange={(opt) => handleChange('companySize', opt?.value)} placeholder="-- Company Size --" />
              ) : (
                <InputField label="Company Size" value={user.companySize} disabled />
              )}

              {isEditable ? (
                <CustomSelect label="Country" options={countryOptions} value={countryOptions.find((o) => o.value === user.country)} onChange={(opt) => handleChange('country', opt?.value)} placeholder="-- Country --" />
              ) : (
                <InputField label="Country" value={user.country} disabled />
              )}

              {isEditable && user.country.toLowerCase() === 'india' ? (
                <CustomSelect label="State" options={indianStateOptions} value={indianStateOptions.find((o) => o.value === user.state)} onChange={(opt) => handleChange('state', opt?.value)} placeholder="-- State --" />
              ) : (
                <InputField label="State" value={user.state} disabled />
              )}

              {isEditable ? (
                <CustomSelect label="Industry" options={industryOptions} value={industryOptions.find((o) => o.value === user.industry)} onChange={(opt) => handleChange('industry', opt?.value)} placeholder="-- Industry --" />
              ) : (
                <InputField label="Industry" value={user.industry} disabled />
              )}

              {isEditable ? (
                <CustomSelect label="Currency" options={currencyOptions} value={currencyOptions.find((o) => o.value === user.currency)} onChange={(opt) => handleChange('currency', opt?.value)} placeholder="-- Currency --" />
              ) : (
                <InputField label="Currency" value={user.currency} disabled />
              )}

              {isEditable ? (
                <CustomSelect label="Time Zone" options={timeZoneOptions} value={timeZoneOptions.find((o) => o.value === user.timezone)} onChange={(opt) => handleChange('timezone', opt?.value)} placeholder="-- Timezone --" />
              ) : (
                <InputField label="Time Zone" value={user.timezone} disabled />
              )}

              <div className="col-span-full flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsEditable(!isEditable)}>{isEditable ? 'Cancel' : 'Edit'}</Button>
                {isEditable && <Button type="submit">Save</Button>}
              </div>
            </form>
          </div>
        </div>
      }


      {
        tab === "BusiDetails" &&
        <div className='h-screen w-full border' > Hyy</div>
      }
    </div>



  );
}