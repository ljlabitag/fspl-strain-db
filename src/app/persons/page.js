'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@components/loadingSpinner.js";
import axios from "axios";

const PersonPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/api/auth/signin");
        }
    }, [status, router]);
    
    const [person, setPerson] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            try {
                const response = await axios.get("/api/persons");
                console.log("API Response:", response.data);
                setPerson(response.data || []);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching persons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerson();
    }, []);

    if (loading) return <p>Loading persons...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Persons</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Position Title</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Projects</th>
                    </tr>
                </thead>
                <tbody>
                    {person.map((person) => (
                        <tr key={person.person_id} className="border">
                            <td className="border px-4 py-2">{person.person_name}</td>
                            <td className="border px-4 py-2">{person.position_title || "N/A"}</td>
                            <td className="border px-4 py-2">{person.email}</td>
                            <td className="border px-4 py-2">
                                {person.projects.length > 0
                                    ? person.projects.map((proj) => proj.title).join(", ")
                                    : "No Projects"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PersonPage;