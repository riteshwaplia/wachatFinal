// import React, { useState } from 'react';
// import Button from '../components/Button';
// import InputField from '../components/InputField';
// import { IoBusiness } from "react-icons/io5";

// export default function UserSetting() {
//     const [tab, settab] = useState("brodcast");
//     const [brodId, setBrodId] = useState("");
//     const [bordErr, setbrodErr] = useState("");
//     const [errors, setErrors] = useState({});
//     const [inpdata, setinpData] = useState({
//         "businessId": "",
//         "accessToken": "",
//         "appId": ""
//     });




//     const handleChange = (key, value) => {
//         setinpData((prev) => ({ ...prev, [key]: value }));
//         if (errors[key]) {
//             setErrors((prev) => ({ ...prev, [key]: '' }));
//         }



//     }

//     const handleSubmit = (e) => {
//         const newErrors = {};
//         e.preventDefault();
//         if (!inpdata.businessId) {
//             newErrors.businessId = "Whatsapp business Account Id is required";
//         }
//         if (!inpdata.accessToken) {
//             newErrors.accessToken = "Meta Access Token is required";
//         }
//         if (!inpdata.appId) {
//             newErrors.appId = "App Id is required";
//         }


//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             return;
//         }
//         console.log("dataaaaa", inpdata);
//     }
//     console.log("broddata",brodId);
// }

//   return (
//     <div>
//         <div className='text-3xl font-bold  mb-10'>Settings</div>
//         <div className=' border-gray px-3  border-b'>
//           <div className='flex text-[14px] md:text-[16px]  border-b border-gray-200 gap-6 ml-2'>
//               <button  onClick={()=>settab("business")} className={` ${tab=="business" && "whitespace-nowrap py-4  px-1 border-b-2 font-medium text-sm flex items-center space-x-1 lg:space-x-2 border-primary-500 text-primary-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-500"} cursor-pointer text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-400 `}>Update Business profile

//               </button>
//                               <button  onClick={()=>settab("brodcast")} className={` ${tab=="brodcast" && "whitespace-nowrap py-4  px-1 border-b-2 font-medium text-sm flex items-center space-x-1 lg:space-x-2 border-primary-500 text-primary-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-500"} cursor-pointer text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-400 `}>Update Brodcast Detail</button>

//           </div>
//         </div>
//         <div className='md:grid md:grid-cols-6 gap-2'>
// {/* <div className='border text-center flex justify-center items-center flex-col rounded p-4 space-y-4 md:space-y-10 border col-span-1'>
//     <Button className={`${tab=="business" && "bg-primary-600 hover:bg-primary-600"}`} onClick={()=>settab("business")}>Update Business </Button>
//     <Button className={`${tab=="brodcast" && "bg-primary-600 hover:bg-primary-600"}`} onClick={()=>settab("brodcast")}>Update Brodcasts </Button>
// </div> */}
//                 <div className=' mt-3 md:mt-auto rounded p-4  col-span-6'>
//                     {
//                         tab === "business" ?
//                             <div >
//                                 <div className='text-2xl  font-semibold'>Business Name</div>
//                                 <InputField error={errors.businessId} onChange={(e) => handleChange("businessId", e.target.value)} label="whatsapp business access id" className='mt-4' />
//                                 <InputField error={errors.accessToken} onChange={(e) => handleChange("accessToken", e.target.value)} label="meta access token" />
//                                 <InputField error={errors.appId} onChange={(e) => handleChange("appId", e.target.value)} label="app id"></InputField>
//                                 <Button onClick={handleSubmit} className='block ml-auto'>Submit</Button>
//                             </div> :
//                             <div className='py-6'>
//                                 <InputField error={bordErr} onChange={(e) => (setBrodId(e.target.value),
//                                     setbrodErr(""))} placeholder="ex." label="current id" />
//                                 <Button onClick={BrodSubmitHandler} className='ml-auto block'>Update</Button>
//                             </div>

//                     }
//                 </div>

//             </div>
//         </div>
//     )
// }

import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { IoBusiness } from "react-icons/io5";
import api from '../utils/api';
import { ErrorToast, SuccessToast } from '../utils/Toast';

export default function UserSetting() {
    const [tab, settab] = useState("business");
    const [brodId, setBrodId] = useState("");
    const [bordErr, setbrodErr] = useState("");
    const [errors, setErrors] = useState({});
    const [inpdata, setinpData] = useState({
        "businessId": "",
        "accessToken": "",
        "appId": ""
    });
    const [batchSize, setbatchSize] = useState(null)
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        fetchBatchSize();
    }, [])

    const fetchBatchSize = async () => {
        try {
            const res = await api.get(`/users/batch-size`);
            console.log("res", res?.data?.data?.batch_size)
            if (res?.data?.success) {
                setbatchSize(res?.data?.data?.batch_size)
            }
        } catch (error) {
            const msg = error.response.data.message;
            ErrorToast(msg || "server err")

        }
    }

    const updateBatchSize = async () => {
        const payload = {
            batch_size: batchSize
        }
        try {
            setLoading(true)
            const res = await api.put(`/users/batch-size`, payload);
            console.log("res", res)
            if (res?.data?.success) {
                SuccessToast(res.data.message)
                fetchBatchSize();
            }
        } catch (error) {
            const msg = error.response.data.message;
            ErrorToast(msg || "server err")

        } finally {
            setLoading(false)
        }

    }






    const handleChange = (key, value) => {
        setinpData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: '' }));
        }
    }


    const BrodSubmitHandler = (e) => {
        // /batch-size
        const res = api.put(`/users/batch-size`)
        e.preventDefault();
        if (!brodId) {
            setbrodErr("enter the current id");
        }
        console.log("broddata", brodId);
    }


    const handleSubmit = (e) => {
        const newErrors = {};
        e.preventDefault();
        if (!inpdata.businessId) {
            newErrors.businessId = "Whatsapp business Account Id is required";
        }
        if (!inpdata.accessToken) {
            newErrors.accessToken = "Meta Access Token is required";
        }
        if (!inpdata.appId) {
            newErrors.appId = "App Id is required";
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        console.log("dataaaaa", inpdata);
    }
    return (
        <div>
            <div className='text-3xl font-bold  mb-10'>Settings</div>
            <div className=' border-gray px-3  border-b'>
                <div className='flex text-[14px] md:text-[16px]  border-b border-gray-200 gap-6 ml-2'>

                    <button className={` ${tab == "business" && "whitespace-nowrap py-4  px-1 border-b-2 font-medium text-sm flex items-center space-x-1 lg:space-x-2 border-primary-500 text-primary-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-500"} cursor-pointer text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-400 `}>Update Brodcast Detail</button>

                </div>
            </div>
            <div className='md:grid md:grid-cols-6 gap-2'>
                <div className=' mt-3 md:mt-auto rounded p-4  col-span-6'>
                    {
                        tab === "business" ?
                            <div className='py-6'>
                                <InputField value={batchSize} onChange={(e) => (setbatchSize(e.target.value))}
                                    placeholder="ex." label="BroadCaste R/s" />
                                <Button loading={loading} onClick={() => updateBatchSize()} className='ml-auto block'>Update</Button>
                            </div> : ""



                    }
                </div>

            </div>
        </div>
    )
}



