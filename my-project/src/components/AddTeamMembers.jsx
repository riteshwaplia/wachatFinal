import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import InputField from '../components/InputField';
// import TeamMember from './TeamMember';
import Button from '../components/Button';
// import { iconsName } from '../../constants/icon';
import { MobileNumber } from '../components/MobileNumber';
import TeamPermissions from '../pages/TeamPermissions';
 
export default function AddTeamMember({closePanel}) {
    const navigate = useNavigate();
    const handleClose = () => navigate(-1);
 
    const [teamMem, setTeamMem] = useState({
        firstname: "",
        lastname: "",
        phonenumber: "",
        username: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const handleChange = (key, value) => {
        setTeamMem((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: "" }));
        }
 
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        // Basic validation
        if (!teamMem.firstname) newErrors.firstname = 'firstname is required';
        if (!teamMem.lastname) newErrors.lastname = 'lastname is required';
        if (!teamMem.phonenumber) newErrors.phonenumber = 'Mobile is required';
        if (!teamMem.username) newErrors.username = 'username is required';
        if (!teamMem.password) newErrors.password = 'password is required';
        if (!teamMem.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teamMem.email)) {
            newErrors.email = 'Enter a valid email address';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return
        }
 
        console.log(teamMem);
    }
    const handlePhoneChange = (number, code) => {
        setTeamMem(prev => ({
            ...prev,
            phonenumber: number,
            countryCode: code?.countryCode?.toLowerCase() || '',
        }));
        //         if(errors[key])
        //    {
        //     setErrors((prev)=>({...prev,[key]:""}));
        //    }
    };
    return (
        <div>
            {/* Background Overlay */}
            
 
            {/* Modal Box */}
            <div
                className='relative z-60 shadow-lg p-5 w-full  bg-bg rounded-2xl'
              
            >
 
                <div className='text-primary text-lg mb-4'>Add New User</div>
                <div className='space-y-3'>
                    <InputField error={errors.firstname} type='text' value={teamMem.firstname} onChange={(e) => handleChange("firstname", e.target.value)} placeholder="first name" label="first name" />
                    <InputField error={errors.lastname} type='text' value={teamMem.lastname} onChange={(e) => handleChange("lastname", e.target.value)} placeholder="last name" label="last name" />
                    <MobileNumber country="in" error={errors.phonenumber} value={teamMem.phonenumber} label="phone number" onChange={(number, code) => handlePhoneChange(number, code)} />
                    <InputField type='text' error={errors.username} value={teamMem.username} label="username" onChange={(e) => handleChange("username", e.target.value)} />
                    <InputField teye="email" error={errors.email} value={teamMem.email} label="email" onChange={(e) => handleChange("email", e.target.value)} />
                    <InputField type='password' error={errors.password} value={teamMem.password} label="password" onChange={(e) => handleChange("password", e.target.value)} />
                </div>
                <div className='my-4 space-y-3'>
                    <div className='text-primary'>Permissions</div>
<TeamPermissions/>
 
                </div>
 
                <div className='gap-4 flex mt-4'>
 
                    <Button  onClick={handleSubmit}>Submit</Button>
                    <Button    onClick={() => navigate("/team/members")}>Close</Button>
                </div>
         </div>
        </div>
    );
}