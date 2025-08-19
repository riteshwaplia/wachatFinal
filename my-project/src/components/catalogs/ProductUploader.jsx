import React, { useState } from "react";
import axios from "axios";
import Button from "../Button";

const ProductUploader = ({ selectedCatalogs }) => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        url: "",
        image_url: "",
        availability: "in stock",
        brand: "",
        retailer_id: "",
        currency: "USD",
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const allowedTextPattern = /^[a-zA-Z0-9 _]*$/;

    const validateField = (name, value) => {
        let error = "";
        if (!value && ["name", "price", "image", "brand", "retailer_id"].includes(name)) {
            error = "This field is required";
        } else if (["name", "brand", "retailer_id"].includes(name) && !allowedTextPattern.test(value)) {
            error = "Only letters, numbers, spaces, and underscores allowed";
        } else if (name === "price" && value <= 0) {
            error = "Price must be greater than zero";
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProduct((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, image: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(product).forEach((key) => {
            const error = validateField(key, product[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpload = async () => {
        if (!selectedCatalogs) {
            alert("Please select at least one catalog");
            return;
        }
        if (!validateForm()) return;

        const formData = new FormData();
        Object.keys(product).forEach((key) => {
            if (key === "image" && product.image) {
                formData.append("image", product.image);
            } else {
                formData.append(key, product[key]);
            }
        });
        formData.append("catalogIds", JSON.stringify(selectedCatalogs));

        setLoading(true);
        try {
            await axios.post("/api/products/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Product uploaded successfully");
            setProduct({
                name: "",
                description: "",
                price: "",
                url: "",
                image_url: "",
                availability: "in stock",
                brand: "",
                retailer_id: "",
                currency: "USD",
                image: null,
            });
            setPreview(null);
        } catch (err) {
            console.error(err);
            alert("Failed to upload product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-white shadow-md w-[85vw]  overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
            <div className=" ">
                <div className="flex gap-4 w-max p-4 bg-white shadow rounded-lg">
                    {/* All your fields */}
                    {/* Name */}
                    <div className="flex flex-col min-w-[200px]">
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name *"
                            value={product.name}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col min-w-[250px]">
                        <textarea
                            name="description"
                            placeholder="Product Description"
                            value={product.description}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col min-w-[150px]">
                        <input
                            type="number"
                            name="price"
                            placeholder="Price *"
                            value={product.price}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                    </div>

                    {/* Currency */}
                    <div className="flex flex-col min-w-[120px]">
                        <select
                            name="currency"
                            value={product.currency}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        >
                            <option value="USD">USD</option>
                            <option value="INR">INR</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>

                    {/* URL */}
                    <div className="flex flex-col min-w-[250px]">
                        <input
                            type="url"
                            name="url"
                            placeholder="Product URL"
                            value={product.url}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                    </div>

                    {/* Image URL */}
                    <div className="flex flex-col min-w-[250px]">
                        <input
                            type="url"
                            name="image_url"
                            placeholder="Image URL"
                            value={product.image_url}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col min-w-[150px]">
                        <select
                            name="availability"
                            value={product.availability}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        >
                            <option value="in stock">In Stock</option>
                            <option value="out of stock">Out of Stock</option>
                            <option value="preorder">Preorder</option>
                        </select>
                    </div>

                    {/* Brand */}
                    <div className="flex flex-col min-w-[200px]">
                        <input
                            type="text"
                            name="brand"
                            placeholder="Brand *"
                            value={product.brand}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
                    </div>

                    {/* Retailer ID */}
                    <div className="flex flex-col min-w-[200px]">
                        <input
                            type="text"
                            name="retailer_id"
                            placeholder="Retailer ID *"
                            value={product.retailer_id}
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        {errors.retailer_id && <p className="text-red-500 text-sm">{errors.retailer_id}</p>}
                    </div>
                    <div
                        className="flex flex-col min-w-[100px]">

                        <Button
                            onClick={handleUpload}
                            disabled={loading}
                            className="px-2 py-2 bg-gray-500 text-white rounded  disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add"}
                        </Button>

                    </div>

                    {/* Image Upload */}
                    {/* <div className="flex flex-col min-w-[200px]">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                        {preview && <img src={preview} alt="Preview" className="w-32 mt-2 rounded" />}
                    </div> */}
                </div>
            </div>

            {/* <div className="mt-4">
                    <Button
                        onClick={handleUpload}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Upload Product"}
                    </Button>
                </div> */}
        </div>

    );
};

export default ProductUploader;
