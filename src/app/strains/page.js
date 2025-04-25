"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import AddStrainModal from "@components/addStrainModal";
import EditStrainModal from "@components/editStrainModal";
import StrainInfoModal from "@/components/strainInfoModal";
import LoadingSpinner from "@components/loadingSpinner.js";
import toast from "react-hot-toast";

const StrainsPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/api/auth/signin");
        }
    }, [status, router]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [strains, setStrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStrain, setSelectedStrain] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoStrain, setInfoStrain] = useState(null);
    const [newStrain, setNewStrain] = useState({
        strain_genus: "",
        strain_species: "",
        status: "",
        storage_form: "",
        location: "",
        strain_source: "",
        depositor_name: "",
        organization: "",
        is_employee: false,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const strainsPerPage = 10;
    const totalPages = Math.ceil(strains.length / strainsPerPage);
    const paginatedStrains = strains.slice(
        (currentPage - 1) * strainsPerPage,
        currentPage * strainsPerPage
    );

    useEffect(() => {
        const fetchStrains = async () => {
            try {
                const response = await axios.get("/api/strains");
                setStrains(response.data);
            } catch (error) {
                console.error("Error fetching strains:", error);
                toast.error("Error fetching strains. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStrains();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();

        let processedSearchTerm = searchTerm;
        if (filter === "accession_number") {
            processedSearchTerm = searchTerm.replace(/\D/g, "");
        }

        try {
            const response = await axios.get(
                `/api/strains?searchTerm=${processedSearchTerm}&filter=${filter}`
            );
            setStrains(response.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error searching strains:", error);
            toast.error("Error searching strains. Please try again later.");
        }
    };

    const handleAddStrain = async (formData) => {
        try {
            const response = await axios.post("/api/strains", formData);
            setStrains([...strains, response.data]);
            setShowModal(false);
            setNewStrain({
                strain_genus: "",
                strain_species: "",
                status: "",
                storage_form: "",
                location: "",
                strain_source: "",
                depositor_name: "",
                organization: "",
                is_employee: false,
            });
            toast.success("Strain added successfully!");
        } catch (error) {
            console.error("Error adding strain:", error);
            toast.error("Error adding strain. Please try again later.");
        }
    };

    const handleEditStrain = async (updatedData) => {
        try {
            const response = await axios.put(
                `/api/strains/${updatedData.strain_id}`,
                updatedData
            );
            setStrains(
                strains.map((strain) =>
                    strain.strain_id === updatedData.strain_id
                        ? response.data
                        : strain
                )
            );
            toast.success("Strain updated successfully!");
            setShowEditModal(false);
            setSelectedStrain(null);
        } catch (error) {
            console.error("Error updating strain:", error);
            toast.error("Error updating strain. Please try again later.");
        }
    };

    const handleExportMasterlist = () => {
        const now = new Date();
        const exportDate = now.toLocaleDateString();
        const exportTime = now.toLocaleTimeString();
    
        let csv = 'Field,Value\n';
        csv += `Export Date,${exportDate}\n`;
        csv += `Export Time,${exportTime}\n\n`;
    
        csv += 'Accession Number,Scientific Name,Depositor,Status,Storage Form,Location\n';
    
        if (strains.length > 0) {
            strains.forEach((strain) => {
                csv += `FSPL-${strain.strain_id},"${strain.strain_genus} ${strain.strain_species}",${strain.depositor?.depositor_name || 'N/A'},${strain.status || 'N/A'},${strain.storage_form || 'N/A'},${strain.location?.loc_name || 'N/A'}\n`;
            });
        } else {
            csv += 'No results found\n';
        }
    
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `strain_masterlist_export_${exportDate.replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    if (loading) return <LoadingSpinner message="Fetching strains..." />;

    return (
        <main className="flex-grow bg-gray-100 px-6 py-4 space-y-6">
            <section className="bg-[#A0C878] p-3 rounded-lg shadow">
                <h2 className="text-xl font-bold">
                    <FontAwesomeIcon icon={faList} size="md" className="pr-2" />
                    Microbial Strain Masterlist
                </h2>
            </section>

            <div className="flex mt-6 justify-between">
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
                <div className="w-2/5 space-x-4 flex justify-end pr-4">
                    <button
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                        onClick={() => setShowModal(true)}
                    >
                        Add Strain
                    </button>
                    <button
                        className="bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800"
                        onClick={() => setShowEditModal(true)}
                    >
                        Edit Info
                    </button>
                    <button
                        onClick={handleExportMasterlist}
                        className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-900"
                    >
                        Export CSV
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

            <section className="bg-white p-2">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#DDEB9D]">
                            <th className="border border-gray-300 p-2 w-1/8">Accession Number</th>
                            <th className="border border-gray-300 p-2 w-2/8">Scientific name</th>
                            <th className="border border-gray-300 p-2 w-2/8">Depositor</th>
                            <th className="border border-gray-300 p-2 w-1/8">Status</th>
                            <th className="border border-gray-300 p-2 w-1/8">Storage Form</th>
                            <th className="border border-gray-300 p-2 w-1/8">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStrains.length > 0 ? (
                            paginatedStrains.map((strain, index) => (
                                <tr
                                    key={`strain-${strain.strain_id}-${index}`}
                                    className="border border-gray-300"
                                >
                                    <td className="border border-gray-300 p-2">FSPL-{strain.strain_id}</td>
                                    <td
                                        className="border border-gray-300 p-2 italic text-indigo-700 hover:underline cursor-pointer"
                                        onClick={() => {
                                            setInfoStrain(strain);
                                            setShowInfoModal(true);
                                        }}
                                    >
                                        {strain.strain_genus} {strain.strain_species}
                                    </td>
                                    <td className="border border-gray-300 p-2">{strain.depositor.depositor_name}</td>
                                    <td className="border border-gray-300 p-2">{strain.status}</td>
                                    <td className="border border-gray-300 p-2">{strain.storage_form}</td>
                                    <td className="border border-gray-300 p-2">
                                        {strain.location?.loc_name || "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center p-4 text-red-700"
                                >
                                    No strains found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {strains.length > 0 && (
                    <div className="flex justify-center items-center space-x-2 my-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 my-2"
                        >
                            Prev
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 my-2"
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>

            <StrainInfoModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                strain={infoStrain}
            />
        </main>
    );
};

export default StrainsPage;
