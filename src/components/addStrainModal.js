import React, { useState, useEffect } from "react";
import axios from "axios";

const AddStrainModal = ({ isOpen, onClose, onSubmit, strainData, setStrainData }) => {
    const [currentStep, setCurrentStep] = useState(1); // Track the current step
	const [variables, setVariables] = useState([]); // State to hold the selected variables
	const [selectedVariableId, setSelectedVariableId] = useState(""); // State to hold the selected variable ID
	const [charValue, setCharValue] = useState(""); // State to hold the characteristic value
	const [characteristics, setCharacteristics] = useState([]); // State to hold the characteristics

	useEffect(() => {
		const fetchVariables = async () => {
			try {
				const response = await axios.get("/api/variables");
				setVariables(response.data);
			} catch (error) {
				console.error("Error fetching variables:", error);
			}
		};
	
		if (isOpen) {
			fetchVariables();
		}
	}, [isOpen]);
	

    if (!isOpen) return null;

	const resetForm = () => {
		setStrainData({
			strain_genus: "",
			strain_species: "",
			status: "",
			storage_form: "",
			location: "",
			strain_source: "",
			depositor_name: "",
			organization: ""
		});
		setVariables([]);
		setSelectedVariableId("");
		setCharValue("");
		setCharacteristics([]);
		setCurrentStep(1);
	};	

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStrainData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleAddCharacteristic = (e) => {
        const selectedCharacteristic = e.target.value;
        if (selectedCharacteristic && !characteristics.some((c) => c.id === parseInt(selectedCharacteristic, 10))) {
            const characteristic = variables.find((c) => c.id === parseInt(selectedCharacteristic, 10));
            setCharacteristics((prev) => [...prev, { ...characteristic, value: "" }]);
        }
    };

    const handleCharacteristicValueChange = (id, value) => {
        setCharacteristics((prev) =>
            prev.map((c) => (c.id === id ? { ...c, value } : c))
        );
    };

    const handleRemoveCharacteristic = (id) => {
        setCharacteristics((prev) => prev.filter((c) => c.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...strainData, characteristics }); // Pass strain data and characteristics
		resetForm();
		onClose();
    };

    const handleCancel = () => {
        resetForm();
		onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/5 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Add New Strain</h2>
                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Genus</label>
                                <input
                                    type="text"
                                    name="strain_genus"
                                    value={strainData.strain_genus}
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
                                    value={strainData.strain_species}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Depositor Name</label>
                                <input
                                    type="text"
                                    name="depositor_name"
                                    value={strainData.depositor_name}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                />
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="is_employee"
                                        checked={strainData.is_employee || false}
                                        onChange={(e) =>
                                            setStrainData((prev) => ({
                                                ...prev,
                                                is_employee: e.target.checked
                                            }))
                                        }
                                    />
                                    <label className="text-sm font-medium">Depositor is an employee</label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Organization/Affiliation</label>
                                <input
                                    type="text"
                                    name="organization"
                                    value={strainData.organization}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                />
                            </div>
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
							<div>
  								<label className="block text-sm font-medium">Strain Source</label>
  								<input
  								  type="text"
  								  name="strain_source"
  								  value={strainData.strain_source}
  								  onChange={handleChange}
  								  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
  								/>
							</div>
                            <div>
                                <label className="block text-sm font-medium">Storage Form</label>
                                <input
                                    type="text"
                                    name="storage_form"
                                    value={strainData.storage_form}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={strainData.location}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
    						<label className="block text-sm font-medium">Add Strain Characteristic</label>
    						<div className="flex space-x-2">
    						    <select
    						        value={selectedVariableId}
    						        onChange={(e) => setSelectedVariableId(e.target.value)}
    						        className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
    						    >
    						        <option value="">Select a variable</option>
    						        {variables.map((v) => (
    						            <option key={v.id} value={v.id}>
    						                {v.variable_name}
    						            </option>
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
    						        className="bg-green-700 text-white px-4 py-2 rounded-lg"
    						        onClick={() => {
    						            if (selectedVariableId && charValue) {
    						                const selectedVar = variables.find(v => v.id === parseInt(selectedVariableId));
    						                setCharacteristics([
    						                    ...characteristics,
    						                    {
    						                        id: parseInt(selectedVariableId),
    						                        name: selectedVar.variable_name,
    						                        value: charValue
    						                    }
    						                ]);
    						                setSelectedVariableId("");
    						                setCharValue("");
    						            }
    						        }}
    						    >
    						        Add
    						    </button>
    						</div>

					    	{/* Display list */}
					    	<ul className="mt-4 space-y-2">
					    	    {characteristics.map((char, index) => (
					    	        <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
					    	            <span><strong>{char.name}</strong>: {char.value}</span>
					    	            <button
					    	                type="button"
					    	                className="text-red-600 hover:underline"
					    	                onClick={() =>
					    	                    setCharacteristics(characteristics.filter((_, i) => i !== index))
					    	                }
					    	            >
					    	                Remove
					    	            </button>
					    	        </li>
					    	    ))}
					    	</ul>
						</div>

                    )}

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Cancel
                        </button>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Back
                            </button>
                        )}
                        {currentStep < 2 && (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Next
                            </button>
                        )}
                        {currentStep === 2 && (
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                Save
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStrainModal;