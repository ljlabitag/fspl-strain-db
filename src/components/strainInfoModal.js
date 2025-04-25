'use client';

import React, { useEffect, useState } from 'react';

const StrainInfoModal = ({ isOpen, onClose, strain }) => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        if (!isOpen) setShowExportMenu(false);
    }, [isOpen]);

    if (!isOpen || !strain) return null;

    const handleExportCSV = () => {
        if (!strain) return;

        const now = new Date();
        const exportDate = now.toLocaleDateString();
        const exportTime = now.toLocaleTimeString();

    
        let csv = 'Field,Value\n';
        csv += `Export Date,${exportDate}\n`;
        csv += `Export Time,${exportTime}\n`;
        csv += `Accession Number,FSPL-${strain.strain_id}\n`;
        csv += `Scientific Name,"${strain.strain_genus} ${strain.strain_species}"\n`;
        csv += `Status,${strain.status || 'N/A'}\n`;
        csv += `Storage Form,${strain.storage_form || 'N/A'}\n`;
        csv += `Source,${strain.strain_source || 'N/A'}\n`;
        csv += `Depositor,${strain.depositor?.depositor_name || 'N/A'}\n`;
        csv += `Organization,${strain.depositor?.organization || 'N/A'}\n`;
        csv += `Location,${strain.location?.loc_name || 'N/A'}\n`;
    
        // Add a blank line and header for characteristics
        csv += '\nStrain Characteristics\n';
        csv += 'Variable,Value\n';
    
        if (strain.characteristics && strain.characteristics.length > 0) {
            strain.characteristics.forEach((char) => {
                csv += `${char.variable?.variable_name || 'Unknown'},${char.value || 'N/A'}\n`;
            });
        } else {
            csv += 'None,N/A\n';
        }
    
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${strain.strain_genus}_${strain.strain_species}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        setShowExportMenu(false);
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white max-w-lg w-full rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh] relative">
                <div className="flex justify-between items-center mb-4">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-black text-xl font-bold"
                    >
                        ×
                    </button>

                    {/* Export Dropdown */}
                    <div className="relative inline-block text-left">
                        <button
                            type="button"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Export ▼
                        </button>
                        {showExportMenu && (
                            <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={handleExportCSV}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Export as CSV
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content to Export */}
                <div id="strain-info-content">
                    <h2 className="text-xl font-semibold text-blue-800 mb-4">
                        Strain Details
                    </h2>

                    <div className="space-y-2 text-sm">
                        <p><strong>Scientific Name:</strong> <em>{strain.strain_genus} {strain.strain_species}</em></p>
                        <p><strong>Status:</strong> {strain.status || 'N/A'}</p>
                        <p><strong>Storage Form:</strong> {strain.storage_form || 'N/A'}</p>
                        <p><strong>Source:</strong> {strain.strain_source || 'N/A'}</p>
                        <p><strong>Depositor:</strong> {strain.depositor?.depositor_name || 'N/A'}</p>
                        <p><strong>Organization:</strong> {strain.depositor?.organization || 'N/A'}</p>
                        <p><strong>Storage Location:</strong> {strain.location?.loc_name || 'N/A'}</p>
                    </div>

                    {strain.characteristics && strain.characteristics.length > 0 && (
                        <div className="pt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Strain Characteristics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {strain.characteristics.map((char, index) => (
                                    <div key={index} className="bg-gray-100 rounded p-2">
                                        <p className="font-medium text-gray-800">
                                            {char.variable?.variable_name}
                                        </p>
                                        <p className="text-gray-700">{char.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StrainInfoModal;
