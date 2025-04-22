'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PersonnelModal from "../../components/personnelModal.js";
import LoadingSpinner from "../../components/loadingSpinner.js";

export default function ManagePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/api/auth/signin");
        } else if (session?.user?.role !== "LAB_HEAD") {
            router.push("/unauthorized");
        }
    }, [status, session, router]);

    // State variables
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [editMode, setEditMode] = useState(false);


    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const response = await fetch("/api/personnel");
                const data = await response.json();
                setPersonnel(data);
            } catch (error) {
                console.error("Error fetching personnel:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonnel();
    }, []);

    // Helper functions to handle modal open/close
    const handleAddPersonnel = (newPerson) => {
        setPersonnel([...personnel, newPerson]);
    };

    if (loading) return <LoadingSpinner message="Loading management resources..." />;

    return (
        <main className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-green-800">Lab Management</h1>

            {/* Section: Manage Personnel */}
            <section className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Personnel</h2>
                    <button
                        className="bg-green-700 text-white px-4 py-2 rounded-lg"
                        onClick={() => setShowModal(true)}
                    >
                        Add Personnel
                    </button>
                </div>

                <PersonnelModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditMode(false);
                        setSelectedPerson(null);
                    }}
                    onAdd={(updated) => {
                        if (editMode) {
                            setPersonnel((prev) =>
                                prev.map((p) =>
                                    p.person_id === updated.person_id ? updated : p
                                )
                            );
                        } else {
                            setPersonnel([...personnel, updated]);
                        }
                    
                        setShowModal(false);
                        setEditMode(false);
                        setSelectedPerson(null);
                    }}
                    mode={editMode ? "edit" : "add"}
                    personToEdit={selectedPerson}
                />

                {/* Personnel Table */}
                <table className="w-full table-auto border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Job Title</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personnel.map((person) => (
                            <tr key={person.person_id}>
                                <td className="border p-2">{person.person_name}</td>
                                <td className="border p-2">{person.job_title || "-"}</td>
                                <td className="border p-2">{person.email_address}</td>
                                <td className="border p-2">{person.role || "N/A"}</td>
                                <td className="border p-2 space-x-2">
                                    {/* Edit Personnel button */}
                                    <button
                                        className="bg-yellow-600 text-white px-2 py-1 rounded"
                                        onClick={() => {
                                            setSelectedPerson(person);
                                            setEditMode(true);
                                            setShowModal(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    {/* Delete Personnel button */}
                                    <button
                                        className="bg-red-600 text-white px-2 py-1 rounded"
                                        onClick={async () => {
                                            const confirmDelete = window.confirm(`Are you sure you want to delete ${person.person_name}?`);
                                            if (!confirmDelete) return;
                                        
                                            try {
                                                const response = await fetch(`/api/personnel/${person.person_id}`, {
                                                    method: "DELETE",
                                                });
                                            
                                                if (response.ok) {
                                                    setPersonnel(prev =>
                                                        prev.filter(p => p.person_id !== person.person_id)
                                                    );
                                                } else {
                                                    console.error("Failed to delete personnel");
                                                }
                                            } catch (err) {
                                                console.error("Delete error:", err);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>


            {/* Section: Delete Strains */}
            <section className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Strain Deletion</h2>
                <p className="text-sm text-gray-600 mb-4">Permanently delete strains from the database.</p>
                {/* Insert deletion UI here */}
            </section>

            {/* Section: Projects & Variables */}
            <section className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Projects & Variables</h2>
                <p className="text-sm text-gray-600 mb-4">Manage active projects and lab-wide variable settings.</p>
                <button className="bg-blue-700 text-white px-4 py-2 rounded-lg">Add Project</button>
                {/* Add inputs and forms here */}
            </section>
        </main>
    );
}
