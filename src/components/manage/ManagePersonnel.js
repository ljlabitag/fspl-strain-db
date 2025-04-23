'use client';

import PersonnelModal from "./personnelModal";
import toast from "react-hot-toast";

const ManagePersonnel = ({
    personnel,
    setPersonnel,
    showModal,
    setShowModal,
    selectedPerson,
    setSelectedPerson,
    editMode,
    setEditMode,
}) => {
    return (
        <section className="bg-white p-6 rounded-lg shadow space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Personnel Management</h2>
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
                                    className="bg-yellow-700 text-white px-2 py-1 rounded"
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
                                    className="bg-red-700 text-white px-2 py-1 rounded"
                                    onClick={async () => {
                                        const confirmDelete = window.confirm(
                                            `Are you sure you want to delete ${person.person_name}?`
                                        );
                                        if (!confirmDelete) return;

                                        try {
                                            const response = await fetch(
                                                `/api/personnel/${person.person_id}`,
                                                {
                                                    method: "DELETE",
                                                }
                                            );

                                            if (response.ok) {
                                                setPersonnel((prev) =>
                                                    prev.filter(
                                                        (p) => p.person_id !== person.person_id
                                                    )
                                                );
                                                toast.success(
                                                    `${person.person_name} has been deleted.`
                                                );
                                            } else {
                                                console.error("Failed to delete personnel");
                                                toast.error(
                                                    "Failed to delete personnel. Please try again."
                                                );
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
    );
};

export default ManagePersonnel;