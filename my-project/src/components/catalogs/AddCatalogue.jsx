import React, { useEffect, useState } from "react";
import { ErrorToast, SuccessToast } from "../../utils/Toast";
import api from "../../utils/api";
import InputField from "../InputField";
import Button from "../Button";
import { cataLogValidation } from "../../utils/validation";
import { getMetaBusinessId } from "../../utils/custom";
import { createCatalog, getCatalog } from "../../features/catalog/catalogSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";

const AddCatalogue = ({ onClose }) => {
    const [formData, setFormData] = useState({ name: "", accessToken: "" });
    const [metaBusinessId, setMetaBusinessId] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [create, setCreate] = useState(true);

    const dispatch = useDispatch();
    const { catalogs = [] } = useSelector((state) => state.catalog);

    useEffect(() => {
        dispatch(getCatalog({ page: 1, pageSize: 10 }));
    }, [dispatch]);

    const getMetaId = () => getMetaBusinessId() || null;

    useEffect(() => {
        const fetchMetaBusinessId = async () => {
            try {
                const response = await api.get('/users/business-profiles');
                setMetaBusinessId(getMetaId(response.data.data));
            } catch (error) {
                console.error("Error fetching Meta Business ID:", error);
            }
        };
        fetchMetaBusinessId();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        let cleanValue = value;
        let errorMsg = "";

        if (name === "name") {
            cleanValue = value.replace(/[^a-zA-Z0-9 _]/g, "");
            if (value !== cleanValue) ErrorToast("Special characters are not allowed");
        }

        if (name === "accessToken" && /\s/.test(value)) {
            cleanValue = value.replace(/\s/g, "");
            ErrorToast("No spaces allowed in Access Token");
        }

        setFormData(prev => ({ ...prev, [name]: cleanValue }));
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErr = cataLogValidation(formData);
        if (Object.keys(validationErr).length) {
            setErrors(validationErr);
            return;
        }

        const payload = { formData, metaId: metaBusinessId };
        try {
            setLoading(true);
            await dispatch(createCatalog(payload)).unwrap();
            dispatch(getCatalog({ page: 1, pageSize: 10 }));
            SuccessToast("Catalog created successfully!");
            onClose(); // CLOSE modal after successful submission
        } catch (err) {
            ErrorToast("Error creating catalog");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Add Catalogue">
            <div className="space-y-6 p-2 px-6">
                {create && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Create Catalog</h2>
                        <form onSubmit={handleSubmit}>
                            <InputField
                                label="Catalogue Name"
                                name="name"
                                value={formData.name}
                                type="text"
                                onChange={handleFormChange}
                                placeholder="Enter Catalogue Name"
                                maxlength={60}
                                error={errors.name}
                            />
                            {/* <InputField
                                label="System User Token"
                                name="accessToken"
                                value={formData.accessToken}
                                type="password"
                                onChange={handleFormChange}
                                placeholder="Enter Access Token"
                                maxlength={255}
                                error={errors.accessToken}
                            /> */}
                            <div className="flex gap-3 mt-4">
                                <Button
                                    loading={isLoading}
                                    disabled={isLoading}
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Add
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default AddCatalogue;
