'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlaskVial, faUser, faDna, faGears } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@components/loadingSpinner.js";
import ManagePersonnel from "@/components/manage/ManagePersonnel.js";
import ManageStrains from "@/components/manage/ManageStrains.js";
import ManageAdmin from "@/components/manage/ManageAdmin.js";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ManagePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/api/auth/signin");
        } else if (session?.user?.role !== "LAB_HEAD") {
            router.push("/unauthorized");
        }
    }, [status, session, router]);

    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [activeSection, setActiveSection] = useState("personnel");

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

    const handleAddPersonnel = (newPerson) => {
        setPersonnel([...personnel, newPerson]);
    };

    if (loading) return <LoadingSpinner message="Loading management resources..." />;

    return (
        <main className="p-6 bg-gray-100 flex-grow">
            <section className="bg-[#A0C878] p-3 rounded-lg shadow mb-4">
                <h2 className="text-xl font-bold">
                    <FontAwesomeIcon icon={faFlaskVial} size="md" className="pr-2" />
                    Laboratory Management
                </h2>
            </section>

            {/* Tab Header */}
            <div className="flex flex-wrap space-x-4 mb-0 overflow-x-auto">
                {[
                    { id: 'personnel', label: 'Personnel', icon: faUser },
                    { id: 'strains', label: 'Strains', icon: faDna },
                    { id: 'admin', label: 'Admin', icon: faGears },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        className={`flex items-center gap-2 px-4 py-2 font-semibold border rounded-t-lg border-b-0 transition-colors duration-200 whitespace-nowrap 
                            ${activeSection === tab.id ? 'bg-white text-blue-800 shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-white hover:text-blue-700'}`}
                        onClick={() => setActiveSection(tab.id)}
                    >
                        <FontAwesomeIcon icon={tab.icon} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Container */}
            <div className="border border-gray-300 bg-white rounded-b-3xl rounded-tr-3xl shadow-md overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeSection === 'personnel' && (
                        <motion.div
                            key="personnel"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="p-6"
                        >
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
                        </motion.div>
                    )}

                    {activeSection === 'strains' && (
                        <motion.div
                            key="strains"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="p-6"
                        >
                            <ManageStrains />
                        </motion.div>
                    )}

                    {activeSection === 'admin' && (
                        <motion.div
                            key="admin"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="p-6"
                        >
                            <ManageAdmin />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
