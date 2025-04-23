'use client';

import { useEffect, useState } from "react";
import VariableModal from "./variableModal";
import toast from "react-hot-toast";

export default function StrainManagement() {
    const [strains, setStrains] = useState([]);
    const [filteredStrains, setFilteredStrains] = useState([]);
    const [variables, setVariables] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [searched, setSearched] = useState(false);
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [selectedVariable, setSelectedVariable] = useState(null);
    
    // Pagination state
    // Strain pagination
    const [strainCurrentPage, setStrainCurrentPage] = useState(1);
    const strainPageSize = 5;
    const strainTotalPages = Math.ceil(filteredStrains.length / strainPageSize);
    const paginatedStrains = filteredStrains.slice(
        (strainCurrentPage - 1) * strainPageSize,
        strainCurrentPage * strainPageSize
    );
    // Variable pagination
    const [varCurrentPage, setVarCurrentPage] = useState(1);
    const varPageSize = 5;
    const paginatedVariables = variables.slice(
        (varCurrentPage - 1) * varPageSize,
        varCurrentPage * varPageSize
    );
    const varTotalPages = Math.ceil(variables.length / varPageSize);


    useEffect(() => {
        const fetchStrains = async () => {
            try {
                const res = await fetch("/api/strains");
                const data = await res.json();
                setStrains(data);
            } catch (err) {
                console.error("Error fetching strains:", err);
                toast.error("Error fetching strains");
            }
        };

        const fetchVariables = async () => {
            try {
                const res = await fetch("/api/variables");
                const data = await res.json();
                setVariables(data);
            } catch (err) {
                console.error("Error fetching variables:", err);
                toast.error("Error fetching variables");
            }
        };

        fetchStrains();
        fetchVariables();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        //Process the search term based on the selected filter
        let term = searchTerm;
        if (filter === "accession_number") {
            term = parseInt(searchTerm.replace(/\D/g, ""));
        } else {
            term = searchTerm.toLowerCase();
        }

        const filtered = strains.filter((s) => {
            switch (filter) {
                case "accession_number":
                    return s.strain_id === term;
                case "depositor":
                    return s.depositor?.depositor_name?.toLowerCase().includes(term);
                case "genus":
                    return s.strain_genus.toLowerCase().includes(term);
                case "species":
                    return s.strain_species.toLowerCase().includes(term);
                default:
                    return (
                        s.strain_genus.toLowerCase().includes(term) ||
                        s.strain_species.toLowerCase().includes(term) ||
                        s.depositor?.depositor_name?.toLowerCase().includes(term)
                    );
            }
        });

        setFilteredStrains(filtered);
        setSearched(true);
    };

    const handleAddVariable = async (newVar) => {
        try {
            const res = await fetch("/api/variables", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newVar)
            });
            const result = await res.json();
            if (res.ok) {
                setVariables((prev) => [...prev, result]);
                toast.success("Variable added successfully");
            }
        } catch (err) {
            console.error("Error adding variable:", err);
            toast.error("Error adding variable");
        }
    };

    const handleEditVariable = async (updatedVar) => {
        try {
            const res = await fetch(`/api/variables/${selectedVariable.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedVar)
            });
            const result = await res.json();
            if (res.ok) {
                setVariables((prev) =>
                    prev.map((v) => (v.id === selectedVariable.id ? result : v))
                );
                toast.success("Variable updated successfully");
            }
        } catch (err) {
            console.error("Error updating variable:", err);
            toast.error("Error updating variable");
        }
    };

    const handleDeleteVariable = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this variable?");
        if (!confirm) return;

        try {
            const res = await fetch(`/api/variables/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setVariables((prev) => prev.filter((v) => v.id !== id));
                toast.success("Variable deleted successfully");
            }
        } catch (err) {
            console.error("Error deleting variable:", err);
            toast.error("Error deleting variable");
        }
    };

    return (
        <section className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold">Strain Management</h2>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="w-full md:w-2/4 flex flex-wrap items-center gap-2">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2"
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
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-grow"
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

            {/* Strain List */}
            {searched && (
                <table className="w-full table-auto border border-gray-300 text-sm mt-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Genus</th>
                            <th className="border p-2">Species</th>
                            <th className="border p-2">Storage Form</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStrains.length > 0 ? (
                            paginatedStrains.map((strain) => (
                            <tr key={strain.strain_id}>
                                <td className="border p-2">{strain.strain_genus}</td>
                                <td className="border p-2">{strain.strain_species}</td>
                                <td className="border p-2">{strain.storage_form || "-"}</td>
                                <td className="border p-2">{strain.status}</td>
                                <td className="border p-2">
                                    <button
                                        className="bg-red-700 text-white px-2 py-1 rounded"
                                        onClick={async () => {
                                            const confirmDelete = window.confirm(
                                                `Delete FSPL-${strain.strain_id} ${strain.strain_genus} ${strain.strain_species}?`
                                            );
                                            if (!confirmDelete) return;

                                            try {
                                                const res = await fetch(`/api/strains/${strain.strain_id}`, {
                                                    method: "DELETE",
                                                });
                                                if (res.ok) {
                                                    setStrains((prev) =>
                                                        prev.filter((s) => s.strain_id !== strain.strain_id)
                                                    );
                                                    setFilteredStrains((prev) =>
                                                        prev.filter((s) => s.strain_id !== strain.strain_id)
                                                    );
                                                }
                                            } catch (err) {
                                                console.error("Error deleting strain:", err);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-red-700 ">
                                    No matching strains found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            {filteredStrains.length > 0 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                    onClick={() => setStrainCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={strainCurrentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-sm text-gray-600">
                    Page {strainCurrentPage} of {strainTotalPages}
                </span>
                <button
                    onClick={() => setStrainCurrentPage((p) => Math.min(p + 1, strainTotalPages))}
                    disabled={strainCurrentPage === strainTotalPages}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
                </div>
            )}

            {/* Variable Management UI */}
            <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Strain Variables</h3>
                <div className="flex justify-between mb-4">
                    <p className="text-gray-500 text-sm">Add, edit, or delete variable definitions used for characterizing strains.</p>
                    <button 
                        className="bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() => {
                            setSelectedVariable(null);
                            setShowVariableModal(true);
                        }}
                    >
                        Add Variable
                    </button>
                </div>

                <table className="w-full table-auto border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Variable Name</th>
                            <th className="border p-2">Data Type</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedVariables.map((v) => (
                            <tr key={v.id}>
                                <td className="border p-2">{v.variable_name}</td>
                                <td className="border p-2">{v.data_type || '-'}</td>
                                <td className="border p-2 space-x-2">
                                    <button 
                                        className="bg-yellow-700 text-white px-2 py-1 rounded"
                                        onClick={() => {
                                            setSelectedVariable(v);
                                            setShowVariableModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="bg-red-700 text-white px-2 py-1 rounded"
                                        onClick={() => handleDeleteVariable(v.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-center items-center space-x-2 mt-4">
                    <button
                        onClick={() => setVarCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={varCurrentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {varCurrentPage} of {varTotalPages}
                    </span>
                    <button
                        onClick={() => setVarCurrentPage((p) => Math.min(p + 1, varTotalPages))}
                        disabled={varCurrentPage === varTotalPages}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                {/* Modal for Add/Edit Variable */}
                <VariableModal
                    isOpen={showVariableModal}
                    onClose={() => setShowVariableModal(false)}
                    onSubmit={selectedVariable ? handleEditVariable : handleAddVariable}
                    initialData={selectedVariable}
                />
            </div>
        </section>
    );
}
