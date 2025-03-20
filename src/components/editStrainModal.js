import React from "react";

const EditStrainModal = ({ isOpen, onClose, onSubmit, strainData, setStrainData, strains }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStrainData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectStrain = (e) => {
    const strainId = parseInt(e.target.value, 10);
    const selected = strains.find((strain) => strain.strain_id === strainId);
    setStrainData(selected || null); // Set the selected strain or null if none is selected
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
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
                <label className="block text-sm font-medium">Form</label>
                <input
                  type="text"
                  name="form"
                  value={strainData.form || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={strainData.location || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
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