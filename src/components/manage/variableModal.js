'use client';

import { useState, useEffect } from 'react';

export default function VariableModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        variable_name: '',
        data_type: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                variable_name: initialData.variable_name,
                data_type: initialData.data_type || ''
            });
        } else {
            setFormData({ variable_name: '', data_type: '' });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">
                    {initialData ? 'Edit Variable' : 'Add New Variable'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Variable Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.variable_name}
                            onChange={(e) => setFormData({ ...formData, variable_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Data Type</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.data_type}
                            onChange={(e) => setFormData({ ...formData, data_type: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                        >
                            {initialData ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
