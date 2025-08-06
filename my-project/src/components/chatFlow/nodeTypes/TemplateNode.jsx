import React, { useState, useEffect, useCallback } from 'react';
import BaseNode from './BaseNode';
import axios from 'axios';
import { getAllTemplates } from '../../../apis/TemplateApi';
import CustomPaginationSelect from '../../CustomPaginationSelect';

const TemplateNode = ({ data, id }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ✅ Replace with your actual token retrieval logic

    // ✅ Fetch templates from API on mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                // /api/templates/plain
                const response = await getAllTemplates()
                console.log("getAllTemplates", response)
                setTemplates(response || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load templates');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // ✅ Handle template selection
    const handleChange = useCallback(
        (e) => {
            const selectedId = e.target.value;
            const selectedTemplate = templates.find((t) => t._id === selectedId);

            data.onChange?.(id, {
                ...data,
                selectedTemplateId: selectedId,
                selectedTemplateName: selectedTemplate ? selectedTemplate.name : '',
                selectedTemplateLanguage: selectedTemplate ? selectedTemplate.language : '',
                //passs here image id 

            });

            console.log("selectedTemplate", selectedTemplate.name)
        },
        [data, id, templates]
    );

    // ✅ Body with select
    const body = (
        <>
            <button
                style={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}
                onClick={() => data.onDelete?.(id)}
                className="text-red-600 hover:text-red-800 primary-100 hover:primary-200 rounded-full w-4 h-4 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity duration-200"
                title="Delete Node"
            >
                &#x2715;
            </button>

            {loading && (
                <p className="text-text text-sm">Loading templates...</p>
            )}
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* <CustomPaginationSelect
                options={templates}
                labelKey="name"
                value={data?.selectedTemplateId || ''}
                pageSize={20}
                onChange={handleChange}


            /> */}

            {!loading && !error && (
                <select
                    className="nodrag bg-secondary-50 w-full px-2 py-1 border border-gray-300 rounded"
                    value={data?.selectedTemplateId || ''}
                    onChange={handleChange}
                >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                        <option key={template._id} value={template._id}>
                            {template.name}
                        </option>
                    ))}
                </select>
            )}
        </>
    );

    return (
        <BaseNode
            title="WhatsApp Template"
            body={body}
            footer="Sends selected template to user"
        />

    );
};

export default TemplateNode;
