import React, { useState, useEffect } from 'react';
import CustomSelect from '../CustomSelect';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { IoMdSend } from "react-icons/io";
import Button from "../Button";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import CusLoadMoreSelect from '../CustomPaginationSelect';




export default function GroupWiseBroadcasting() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { id: projectId } = useParams();
    const [headerExamples, setHeaderExamples] = useState([]);
    const [bodyExamples, setBodyExamples] = useState([]);
    const [project, setProject] = useState(null);
    const [businessProfileId, setBusinessProfileId] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState(null);
    const [finalselectedGroups, setFinalSelectedGroups] = useState([]);
    console.log("selectedgroups", selectedGroups);
    const [selectedFields, setSelectedFields] = useState([]);
    const fieldValues = selectedFields.map(field => field.value);
    console.log("selectefields", fieldValues);
    const [templates, setTemplates] = useState([]);
    const [groupOptions, setGroupOptions] = useState([]);
    const [message, setMessage] = useState("");
    const [singleMessageTemplateName, setSingleMessageTemplateName] = useState("");
    const [fields, setFields] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilterdContacts] = useState([]);
    const [templateVariables, setTemplateVariables] = useState([]);
    const [loading, setloading] = useState(false);
    const [headerField, setHeaderField] = useState(null);
    const [bulkTemplateComponents, setBulkTemplateComponents] = useState("");
    const [bulkTemplateLanguage, setBulkTemplateLanguage] = useState("en_US");
    const [previewText, setPreviewText] = useState({
        header: "",
        body: "",
    });
    // const [selectedname,setSelectedname] = useState();
    const newSelectedFields = headerField ? [headerField, ...fieldValues] : [...fieldValues];
    const [isLoading, setIsLoading] = useState({ uploading: false });
    const [imageId, setImageId] = useState("");
    const isDark = localStorage.getItem('theme');
    console.log("dark", isDark)

    console.log("newSelectedFields???????????", newSelectedFields);
    console.log("fieldvalues", fieldValues)
    console.log("filteredcontacts", filteredContacts);
    console.log("contacts--------->>>>>>>", contacts);
    const selectedTemplate = templates.find(tpl => tpl.name === singleMessageTemplateName);
    console.log("selctedtemplate--------->>>>>>>>", selectedTemplate);
    useEffect(() => {
        const storedProject = localStorage.getItem("currentProject");
        if (storedProject) {
            const parsedProject = JSON.parse(storedProject);
            setProject(parsedProject);
            setBusinessProfileId(parsedProject?.businessProfileId?._id || null);
        }
    }, []);

    console.log("templates", templates)


    // useEffect(() => {
    //   if (selectedTemplate) {
    //     // 🔍 Extract variables from template BODY
    //     const bodyComponent = selectedTemplate.components?.find(comp => comp.type === "BODY");
    //     if (bodyComponent?.text) {
    //       const matches = [...bodyComponent.text.matchAll(/{{(.*?)}}/g)].map(m => m[1]);
    //       setTemplateVariables(matches);
    //     } else {
    //       setTemplateVariables([]);
    //     }
    //   } else {
    //     setTemplateVariables([]);
    //   }
    // }, [selectedTemplate]); // 👈 Runs only when selectedTemplate changes

    useEffect(() => {
        if (!selectedTemplate) return;

        const headerComponent = selectedTemplate.components.find(c => c.type === "HEADER");
        const bodyComponent = selectedTemplate.components.find(c => c.type === "BODY");

        const headerExamples = headerComponent?.example?.header_text || [];
        const bodyExamples = bodyComponent?.example?.body_text?.[0] || [];
        setHeaderExamples(headerExamples);
        setBodyExamples(bodyExamples);
        let headerPreview = headerComponent?.text || "";
        let bodyPreview = bodyComponent?.text || "";

        // Replace {{1}}, {{2}}, etc. with example values
        headerExamples.forEach((val, i) => {
            const regex = new RegExp(`{{${i + 1}}}`, "g");
            headerPreview = headerPreview.replace(regex, val);
        });

        bodyExamples.forEach((val, i) => {
            const regex = new RegExp(`{{${i + 1}}}`, "g");
            bodyPreview = bodyPreview.replace(regex, val);
        });

        setPreviewText({
            header: headerPreview,
            body: bodyPreview,
        });
    }, [selectedTemplate]);



    console.log("templatevariabless----------->>>>>>>>", templateVariables);
    console.log("privew text", previewText);

    // ✅ Define config inside the component after getting the token
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // ✅ Fetch groups
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groupRes = await api.get(`/projects/${projectId}/contacts/groupList`, config);
                setGroups(groupRes.data.data || []);
            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };

        if (projectId) {
            fetchGroups();
        }
    }, [projectId, token]);
    useEffect(() => {
        const fetchContacts = async () => {
            try {

                const contactRes = await api.get(`/projects/${projectId}/contacts/contactList`, { ...config });
                setContacts(contactRes.data.data || []);
            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };

        if (projectId) {
            fetchContacts();
        }
    }, [projectId, token]);

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const fieldRes = await api.get(`/projects/${projectId}/contacts/fields`, config);
                setFields(fieldRes.data.data || []);

            } catch (err) {
                console.error("Error fetching groups:", err);
            }
        };

        if (projectId) {
            fetchFields();
        }
    }, [projectId, token]);
    //fetch filteredcontacts groupsvise

    useEffect(() => {
        if (selectedGroups && selectedGroups.value) {
            const filtered = contacts.filter(contact =>
                contact.groupIds?.some(group => group._id === selectedGroups.value)
            );
            setFilterdContacts(filtered);
        } else {
            setFilterdContacts([]); // or set to contacts if you want to show all by default
        }
    }, [selectedGroups, contacts]);
    // ✅ Fetch templates
    useEffect(() => {
        const fetchTemplatesAndContacts = async () => {
            try {
                const templatesRes = await api.get("templates/allapprovedtemplates", {
                    ...config,
                    params: {
                        businessProfileId: businessProfileId,
                    },
                });
                setTemplates(templatesRes.data.data || []);
                setMessage('');
            } catch (error) {
                console.error("Error fetching templates:", error.response?.data?.message || error.message);
                setMessage(`Error: ${error.response?.data?.message || "Failed to fetch templates."}`);
            }
        };

        if (businessProfileId) {
            fetchTemplatesAndContacts();
        }
    }, [businessProfileId, token, projectId,]);


    useEffect(() => {
        if (groups && groups.length > 0) {
            const options = groups.map(group => ({
                value: group._id,
                label: group.title,
            }));
            setGroupOptions(options);
        }
    }, [groups]);

    console.log("grop********************", groupOptions);
    console.log("selectedTemplate", selectedTemplate)

    const FieldOptions = fields.map(field => ({
        value: field.label,
        label: field.label
    }
    ))
    const finalFieldOptions = FieldOptions.filter((item) => item.value !== headerField);
    console.log("finalFieldOptions+++++++++++++>>>>>>", finalFieldOptions);
    const sendgroupbroadcast = async () => {
        setloading(true);
        if (!selectedGroups) {
            toast.error("please select groups");
            setloading(false);
            return;
        }
        if (!selectedTemplate) {
            toast.error("Please select a template.");
            setloading(false);
            return;
        }


        const headerExamples = selectedTemplate?.components.find(c => c.type === "HEADER")?.example?.header_text || [];
        const bodyExamples = selectedTemplate?.components.find(c => c.type === "BODY")?.example?.body_text?.[0] || [];

        const expectedFields = [...headerExamples, ...bodyExamples];

        if (newSelectedFields.length !== expectedFields.length) {
            toast.error(`⚠️ Please select exactly ${expectedFields.length} fields.`);
            setloading(false);
            return;
        }

        try {
            const response = await api.post(
                `/projects/${projectId}/messages/bulk-send-group`,
                {
                    templateName: singleMessageTemplateName,
                    groupId: selectedGroups.value,
                    contactfields: newSelectedFields,
                    imageId: imageId || "",
                },
                config
            );

            const { totalSent = 0, totalFailed = 0 } = response.data.data;

            if (totalSent > 0 && totalFailed === 0) {
                toast.success(`✅ All ${totalSent} messages sent successfully!`);
                navigate(`/project/${projectId}/broadcasting`);
            } else if (totalSent > 0 && totalFailed > 0) {
                navigate(`/project/${projectId}/broadcasting`);
                toast.success(`⚠️ ${totalSent} messages sent, but ${totalFailed} failed.`);
            } else if (totalSent === 0 && totalFailed > 0) {
                navigate(`/project/${projectId}/broadcasting`);
                toast.error("❌ All messages failed to send.");
            } else {
                toast("ℹ️ No messages were sent.");
            }

            // ✅ Reset states in all cases
            setSingleMessageTemplateName([]);
            setSelectedGroups(null);
            setGroupOptions([]);
            setGroups(null);
            setSelectedFields([]);
            setPreviewText({ header: "", body: "" });
        } catch (error) {
            console.error("Error sending bulk messages:", error);
            toast.error("❌ Failed to send messages.");
            navigate(`/project/${projectId}/broadcasting`);
            setSingleMessageTemplateName([]);
            groupOptions.label = "";
            setSelectedGroups([]);
            setSelectedFields([]);
            setPreviewText({ header: "", body: "" });

        } finally {
            setloading(false);
        }
    };




    useEffect(() => {
        if (singleMessageTemplateName && templates.length) {
            const selectedTpl = templates.find(tpl => tpl.name === singleMessageTemplateName);
            if (selectedTpl) {
                setBulkTemplateComponents(JSON.stringify(selectedTpl.components || [], null, 2));
                setBulkTemplateLanguage(selectedTpl.language || "en_US");
            } else {
                setBulkTemplateComponents("");
                setBulkTemplateLanguage("en_US");
            }
        }
    }, [singleMessageTemplateName, templates]);

    const renderHeaderImageUpload = () => {
        try {
            const parsed = JSON.parse(bulkTemplateComponents);
            const header = parsed.find(c => c.type === "HEADER" && c.format === "IMAGE");

            if (!header) return null;

            return (
                <div className="mt-4">
                    <label className="block font-medium text-gray-700 mb-1">
                        Upload Header Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            setIsLoading(prev => ({ ...prev, uploading: true }));

                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("type", "image");

                            try {
                                const res = await api.post(
                                    `/projects/${projectId}/messages/upload-media`,
                                    formData,
                                    {
                                        headers: {
                                            "Content-Type": "multipart/form-data",
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );

                                setImageId(res.data?.id || res.data?.data.id || "");
                                const mediaHandle = res.data?.id || res.data?.data.id;
                                if (!mediaHandle) {
                                    alert("Upload succeeded but media handle missing");
                                    return;
                                }

                                // Update the HEADER example with new handle
                                const updatedComponents = parsed.map((comp) => {
                                    if (comp.type === "HEADER" && comp.format === "IMAGE") {
                                        return {
                                            ...comp,
                                            example: {
                                                header_handle: [mediaHandle],
                                            },
                                        };
                                    }
                                    return comp;
                                });

                                setBulkTemplateComponents(JSON.stringify(updatedComponents, null, 2));
                                toast.success("Image uploaded successfully");
                            } catch (error) {
                                toast.error("Image upload failed");
                                console.error("Upload error:", error);
                            } finally {
                                setIsLoading(prev => ({ ...prev, uploading: false }));
                            }
                        }}
                        className="block w-full border dark:bg-dark-surface rounded-md p-2 dark:text-dark-text-primary  bg-white"
                        disabled={isLoading.uploading}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Required for templates with image headers
                    </p>
                </div>
            );
        } catch (e) {
            return null;
        }
    };
    console.log("tttt", groupOptions)
    console.log('sfdsf', singleMessageTemplateName); // gives "68919019f6d083c0310c432e"


    return (
        <div className='p-4'>
            <div className='text-primary-500 text-2xl mb-4 font-semibold hover:underline'>Send Templates Groupvise</div>
            <CustomSelect label="Select group name"
                options={groupOptions}
                onChange={(opt) => setSelectedGroups(opt)}
                placeholder='Select Groupname'

            />
            {/* <CusLoadMoreSelect
                options={groupOptions}
                labelKey="label"
                isDark={isDark}
                value={selectedGroups}
                // valueKey="_id"
                pageSize={10}
                onChange={(opt) => setSelectedGroups(opt)}

                placeholder='Select Groupname'

            /> */}




            {filteredContacts.length > 0 && (
                <div className="mt-6">


                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mobile Number</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Designation</th>
                                    {/* Add more fields if needed */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredContacts.map(contact => (
                                    <tr key={contact._id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-sm text-gray-800">{contact.name || 'N/A'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{contact.mobileNumber}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{contact.email || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{contact.customFields?.designation || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}

            <label className='mt-3 block  dark:text-dark-text-primary' htmlFor="">Template name</label>
            {/* <select
                className="mt-1 block  mb-5 w-full dark:bg-dark-surface dark:text-dark-text-primary border border-gray-300 rounded-md shadow-sm p-2"
                required
                value={singleMessageTemplateName}
                onChange={(e) => setSingleMessageTemplateName(e.target.value)}
            >
                <option value="">Select a Template</option>
                {templates.map((tpl) => (
                    <option key={tpl._id} value={tpl.name}>
                        {tpl.name} ({tpl.language}) - {tpl.metaStatus}
                    </option>
                ))}
            </select> */}

            <CusLoadMoreSelect
                options={templates}
                labelKey="name"
                // valueKey='_id'
                isDark={isDark}
                pageSize={10}
                value={singleMessageTemplateName}
                onChange={(val) => setSingleMessageTemplateName(val.label)}
                placeholder="Select a Template"
            />


            {renderHeaderImageUpload()}
            {headerExamples.length > 0 && (
                <CustomSelect options={FieldOptions} label="Select field for header" placeholder='Select fields' onChange={(e) => setHeaderField(e.value)} />

            )}

            <div className='mt-3'>
                {bodyExamples.length > 0 && (
                    <CustomSelect isMulti options={finalFieldOptions} label="Select fields for body" placeholder='Select fields' onChange={(opt) => setSelectedFields(opt)} />

                )}
            </div>
            {message && (
                <p className="text-red-500 mt-2">{message}</p>
            )}

            {previewText && (previewText.header || previewText.body) && (
                <div className="mt-6 w-full mx-auto bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-primary-500 mb-4"> Template Preview</h2>

                    <label className="block mb-2 text-sm font-medium text-gray-700">Message Content</label>
                    <textarea
                        value={`${previewText.header}\n\n${previewText.body}`}
                        readOnly
                        rows={8}
                        className="w-full p-4 text-gray-800 font-mono bg-gray-50 border border-gray-300 rounded-xl focus:outline-none resize-none overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        style={{ maxHeight: '180px' }}
                    />

                    <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-600 mb-2">Buttons</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedTemplate?.components
                                .find(c => c.type === "BUTTONS")
                                ?.buttons.map((btn, idx) => (
                                    <Button
                                        key={idx}
                                        className="shadow hover:bg-primary-700 transition"
                                    >
                                        {btn.text}
                                    </Button>
                                ))}
                        </div>
                    </div>
                </div>
            )}
            <div className='w-full flex justify-end'>

                <Button loading={loading} onClick={sendgroupbroadcast} className='flex items-center gap-2 mt-5'>Send
                    <IoMdSend />
                </Button>

            </div>
        </div>

    );
}
