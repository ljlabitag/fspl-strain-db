'use client';

import { useState, useEffect } from "react";

export default function PersonnelModal({ isOpen, onClose, onAdd, mode = "add", personToEdit = null }) {

    useEffect(() => {
        if (isOpen && mode === "edit" && personToEdit) {
            setFormData({
                person_name: personToEdit.person_name || "",
                job_title: personToEdit.job_title || "",
                email_address: personToEdit.email_address || "",
                role: personToEdit.role || "RESEARCH_ASSISTANT"
            });
        }
    }, [isOpen, mode, personToEdit]);    
    
    const [formData, setFormData] = useState({
        person_name: "",
        job_title: "",
        email_address: "",
        role: "RESEARCH_ASSISTANT"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;

            if (mode === "edit" && personToEdit) {
                response = await fetch(`/api/personnel/${personToEdit.person_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetch("/api/personnel", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
            }

            if (response.ok) {
                const result = await response.json();
                onAdd(result);
                onClose();
            }
        } catch (error) {
            console.error("Error adding personnel:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h3 className="text-xl font-bold mb-4">{mode === "edit" ? "Edit Personnel" : "Add New Personnel"}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="person_name"
                        placeholder="Full Name"
                        value={formData.person_name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="text"
                        name="job_title"
                        placeholder="Job Title"
                        value={formData.job_title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    <input
                        type="email"
                        name="email_address"
                        placeholder="Email Address"
                        value={formData.email_address}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                    >
                        <option value="RESEARCH_ASSISTANT">Research Assistant</option>
                        <option value="LAB_HEAD">Lab Head</option>
                    </select>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    person_name: "",
                                    job_title: "",
                                    email_address: "",
                                    role: "RESEARCH_ASSISTANT"
                                });
                                onClose();
                            }}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                        >
                            {mode === "edit" ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
