import React, { useState, useEffect } from "react";
import axios from "axios";

const EditStrainModal = ({ isOpen, onClose, onSubmit, strainData, setStrainData, strains }) => {
    const [variables, setVariables] = useState([]);
    const [selectedVariableId, setSelectedVariableId] = useState("");
    const [charValue, setCharValue] = useState("");
    const [characteristics, setCharacteristics] = useState([]);
    
    
    useEffect(() => {
        if (!isOpen || !strainData?.strain_id) return;
    
        const fetchVariables = async () => {
            try {
                const response = await axios.get("/api/variables");
                setVariables(response.data);
            } catch (error) {
                console.error("Error fetching variables:", error);
            }
        };

        fetchVariables();
    }, [isOpen, strainData]);
    

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStrainData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectStrain = (e) => {
        const strainId = parseInt(e.target.value, 10);
        const selected = strains.find((strain) => strain.strain_id === strainId);
    
        if (!selected) {
            setStrainData({});
            setCharacteristics([]);
            return;
        }
    
        const enrichedStrain = {
            ...selected,
            depositor_name: selected.depositor?.depositor_name || "",
            organization: selected.depositor?.organization || "",
            is_employee: selected.depositor?.is_employee || false,
            characteristics: selected.characteristics?.map((char) => ({
                id: char.variable_id,
                name: char.variable?.variable_name || "Unknown",
                value: char.value
            })) || []
        };
    
        setStrainData(enrichedStrain);
        setCharacteristics(enrichedStrain.characteristics);
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...strainData, characteristics };
        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/5 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Edit Strain Information</h2>
                <form onSubmit={handleSubmit}>
                    {/* Select Strain Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Select Strain</label>
                        <select
                            value={strainData?.strain_id || ""}
                            onChange={handleSelectStrain}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                        >
                            <option value="">Select a strain</option>
                            {strains.map((strain) => (
                                <option key={strain.strain_id} value={strain.strain_id}>
                                    FSPL-{strain.strain_id}: {strain.strain_genus} {strain.strain_species}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Conditionally Render Form Fields */}
                    {strainData && (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Strain Scientific Name */}
                            <div>
                                <label className="block text-sm font-medium">Genus</label>
                                <input
                                    type="text"
                                    name="strain_genus"
                                    value={strainData.strain_genus || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Species</label>
                                <input
                                    type="text"
                                    name="strain_species"
                                    value={strainData.strain_species || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                    required
                                />
                            </div>
                            
                            {/* Strain Status */}
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <select
                                    name="status"
                                    value={strainData.status || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="discarded">Discarded</option>
                                </select>
                            </div>
                            
                            {/* Storage Form */}
                            <div>
                                <label className="block text-sm font-medium">Storage Form</label>
                                <input
                                    type="text"
                                    name="form"
                                    value={strainData.storage_form || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                />
                            </div>

                            {/* Depositor Information */}
                            <div>
                                <label className="block text-sm font-medium">Depositor Name</label>
                                <input
                                    type="text"
                                    name="depositor_name"
                                    value={strainData.depositor_name || ""}
                                    onChange={(e) => setStrainData({ ...strainData, depositor_name: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                />
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={strainData.is_employee || false}
                                        onChange={(e) =>
                                            setStrainData({ ...strainData, is_employee: e.target.checked })
                                        }
                                    />
                                    <label className="text-sm font-medium">Depositor is an employee</label>
                                </div>
                            </div>  
                            <div>
                                <label className="block text-sm font-medium">Organization</label>
                                <input
                                    type="text"
                                    name="organization"
                                    value={strainData.organization || ""}
                                    onChange={(e) => setStrainData({ ...strainData, organization: e.target.value })}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                />
                            </div>

                            {/* Location Information */}
                            <div>
                                <label className="block text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={strainData.location.loc_name || ""}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                />
                            </div>
                            
                            {/* Strain Characteristics */}
                            <div>
                                <label className="block text-sm font-medium">Strain Characteristics</label>

                                {/* Add new characteristic */}
                                <div className="flex space-x-2">
                                    <select
                                        value={selectedVariableId}
                                        onChange={(e) => setSelectedVariableId(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
                                    >
                                        <option value="">Select variable</option>
                                        {variables.map((v) => (
                                            <option key={v.id} value={v.id}>{v.variable_name}</option>
                                        ))}
                                    </select>
                                    
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        value={charValue}
                                        onChange={(e) => setCharValue(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const variable = variables.find(v => v.id === parseInt(selectedVariableId, 10));
                                            if (!variable || !charValue) return;
                                        
                                            const isDuplicate = characteristics.some(c => c.id === variable.id);
                                            if (isDuplicate) return;
                                        
                                            setCharacteristics([
                                                ...characteristics,
                                                { id: variable.id, name: variable.variable_name, value: charValue }
                                            ]);
                                            
                                            setSelectedVariableId("");
                                            setCharValue("");
                                        }}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                                    
                                {/* Existing characteristics list */}
                                <ul className="space-y-1 mt-2">
                                    {characteristics.map((char, index) => (
                                        <li key={`char-${char.id}-${index}`} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                                            <span><strong>{char.name}:</strong> {char.value}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCharacteristics(characteristics.filter((_, i) => i !== index))
                                                }
                                                className="text-red-500 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={
                                () => {
                                    setStrainData(null); // Reset strain data
                                    setSelectedVariableId(""); // Reset selected variable
                                    setCharValue(""); // Reset char value
                                    setCharacteristics([]); // Reset characteristics
                                    onClose(); // Close the modal
                                }
                            }
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
                                !strainData ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={!strainData} // Disable the button if no strain is selected
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStrainModal;