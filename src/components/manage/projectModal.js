'use client';

import { useEffect, useState } from 'react';

export default function ProjectModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        project_title: '',
        funding_agency: '',
        fund_code: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                project_title: initialData.project_title,
                funding_agency: initialData.funding_agency || '',
                fund_code: initialData.fund_code || ''
            });
        } else {
            setFormData({ project_title: '', funding_agency: '', fund_code: '' });
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
                    {initialData ? 'Edit Project' : 'Add New Project'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Project Title</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.project_title}
                            onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Funding Agency</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.funding_agency}
                            onChange={(e) => setFormData({ ...formData, funding_agency: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Fund Code</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={formData.fund_code}
                            onChange={(e) => setFormData({ ...formData, fund_code: e.target.value })}
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
