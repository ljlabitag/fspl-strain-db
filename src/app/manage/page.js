'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PersonnelModal from "@components/manage/personnelModal.js";
import LoadingSpinner from "@components/loadingSpinner.js";
import ManagePersonnel from "@/components/manage/ManagePersonnel";
import ManageStrains from "@/components/manage/ManageStrains.js";

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

            {/* Manage Personnel Section */}
            <ManagePersonnel
                personnel={personnel}
                setPersonnel={setPersonnel}
                showModal={showModal}
                setShowModal={setShowModal}
                selectedPerson={selectedPerson}
                setSelectedPerson={setSelectedPerson}
                editMode={editMode}
                setEditMode={setEditMode}
            />

            {/* Manage Strains Section */}
            <ManageStrains />
        </main>
    );
}
