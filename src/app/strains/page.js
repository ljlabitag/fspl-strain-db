"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import AddStrainModal from "../../components/addStrainModal.js";
import EditStrainModal from "../../components/editStrainModal.js";

const StrainsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [strains, setStrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStrain, setSelectedStrain] = useState(null);
    const [newStrain, setNewStrain] = useState({
        strain_genus: "",
        strain_species: "",
        status: "",
        form: "",
        location: "",
        location_type: "",
        depositor: "",
    });

    useEffect(() => {
        const fetchStrains = async () => {
            try {
                const response = await axios.get("/api/strains");
                setStrains(response.data.slice(0, 10)); // Get only the first 10 strains
            } catch (error) {
                console.error("Error fetching strains:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStrains();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();

        let processedSearchTerm = searchTerm;
        //If the filter is set to accession_number, convert the search term to an integer
        if (filter === "accession_number") {
            processedSearchTerm = searchTerm.replace(/\D/g, "");
        }

        try {
            const response = await axios.get(`/api/strains?searchTerm=${processedSearchTerm}&filter=${filter}`);
            setStrains(response.data);
        } catch (error) {
            console.error("Error searching strains:", error);
        }
    };
    
    const handleAddStrain = async () => {
        try {
            const response = await axios.post("/api/strains", newStrain);
            setStrains([...strains, response.data]); // Update list
            setShowModal(false);
            setNewStrain({
                strain_genus: "",
                strain_species: "",
                status: "",
                form: "",
                location: "",
            });
        } catch (error) {
            console.error("Error adding strain:", error);
        }
    };

    const handleEditStrain = async () => {
        try {
            const response = await axios.put(`/api/strains/${selectedStrain.strain_id}`, selectedStrain);
            setStrains(
                strains.map((strain) =>
                    strain.strain_id === selectedStrain.strain_id ? response.data : strain
                )
            );
            setShowEditModal(false);
            setSelectedStrain(null);
        } catch (error) {
            console.error("Error updating strain:", error);
        }
    };

    if (loading) return <p>Loading strains...</p>;

    return (
        <main className="flex-grow bg-gray-100 p-6 space-y-6">
            <section className="bg-[#A0C878] p-3 rounded-lg shadow">
                <h2 className="text-xl font-bold">
                    <FontAwesomeIcon icon={faList} size="md" className="pr-2" />
                    Microbial Strain Masterlist
                </h2>
            </section>

            <div className="flex mt-8 justify-between">
            <form onSubmit={handleSearch} className="w-2/4 space-x-2 flex justify-start">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-500 rounded-lg px-4 py-2"
                    >
                        <option value="all">All</option>
                        <option value="accession_number">Accession Number</option>
                        <option value="depositor">Depositor</option>
                        <option value="genus">Genus</option>
                        <option value="species">Species</option>
                    </select>
                    
                    <input
                        type="text"
                        placeholder="Search strains..."
                        className="border border-gray-500 rounded-lg px-4 py-2 w-1/2 ml-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900"
                    >
                      Search
                    </button>
                </form>
                <div className="w-1/5 space-x-4 flex justify-end pr-4">
                    <button
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                        onClick={() => setShowModal(true)}
                    >
                        Add Strain
                    </button>
                    <button
                        className="bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800"
                        onClick={() => {
                            setSelectedStrain(null); // Reset selected strain
                            setShowEditModal(true);
                        }}
                    >
                        Edit Info
                    </button>
                </div>
            </div>

            <AddStrainModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSubmit={handleAddStrain}
              strainData={newStrain}
              setStrainData={setNewStrain}
            />

            <EditStrainModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              onSubmit={handleEditStrain}
              strainData={selectedStrain}
              setStrainData={setSelectedStrain}
              strains={strains}
            />

            <section className="bg-white">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#DDEB9D]">
                            <th className="border border-gray-300 p-2">Accession Number</th>
                            <th className="border border-gray-300 p-2">Genus</th>
                            <th className="border border-gray-300 p-2">Species</th>
                            <th className="border border-gray-300 p-2">Status</th>
                            <th className="border border-gray-300 p-2">Form</th>
                            <th className="border border-gray-300 p-2">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {strains.map((strain) => (
                            <tr key={strain.strain_id} className="border border-gray-300">
                                <td className="border border-gray-300 p-2">FSPL-{strain.strain_id}</td>
                                <td className="border border-gray-300 p-2">{strain.strain_genus}</td>
                                <td className="border border-gray-300 p-2">{strain.strain_species}</td>
                                <td className="border border-gray-300 p-2">{strain.status}</td>
                                <td className="border border-gray-300 p-2">{strain.form}</td>
                                <td className="border border-gray-300 p-2">{strain.location?.loc_name || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
};

export default StrainsPage;