'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlaskVial } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@components/loadingSpinner.js";
import ManagePersonnel from "@/components/manage/ManagePersonnel";
import ManageStrains from "@/components/manage/ManageStrains.js";
import toast from "react-hot-toast";

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
                toast.error("Error fetching personnel. Please try again later.");
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
        <main className="p-6 space-y-6 bg-gray-100 flex-grow">
            {/* Manage Page Header */}
            <section className="bg-[#A0C878] p-3 rounded-lg shadow">
                <h2 className="text-xl font-bold">
                    <FontAwesomeIcon icon={faFlaskVial} size="md" className="pr-2" />
                    Laboratory Management
                </h2>
            </section>

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
