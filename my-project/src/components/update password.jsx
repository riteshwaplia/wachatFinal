import React, { useState } from 'react'
import InputField from './InputField';
import Button from './Button';
export default function UpdatePassword() {
    const [password,setPassword] = useState("123456");
    const[newPassword,setNewPassword] = useState("12345678");
    const [errors,setErrors] = useState({});
const handleSubmit=(e)=>
{
 
    e.preventDefault();
        const newErrors = {};
    if(!password)
    {
     newErrors.password="password must be required";
    }
if(!newPassword)
{
newErrors.newPassword="NewPassword must be required";
}
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
     setErrors({});
const data ={
    password,
    newPassword
}
console.log("passnewpassdata",data);
}
  return (
      <div className='h-screen w-full border p-6' >
  <div className='text-2xl font-bold'>
    Update Password
  </div>
  <InputField error={errors.password} value={password} onChange={(e)=>setPassword(e.target.value)} className='mt-5' label="Password"/>
  <InputField error={errors.newPassword} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className='mt-5' label="Updated Password"/>
<Button onClick={handleSubmit} className='block ml-auto'>Update</Button>
  </div>
  )
}