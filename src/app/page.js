'use client';
import { useEffect, useState } from "react";
import axios from "axios";


export default function Dashboard() {
    const [summary, setSummary] = useState({
        totalStrains: 0,
        activeCultures: 0,
        storageLocations: 0,
        numberDepositors: 0,
        announcements: [],
        recentActivity: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axios.get("/api/summary");
                setSummary(response.data);
            } catch (error) {
                console.error("Error fetching summary:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSummary();
    }
    , []);    

    if (loading) return <p>Loading...</p>;
    
    return (
        <main className="bg-gray-100 flex-grow p-6 space-y-6">
                {/* Welcome Message */}
                <section className="bg-[#A0C878] px-6 py-8 rounded-lg shadow">
                    <h2 className="text-3xl font-bold">
                        Welcome to the FSPL Strain Database
                    </h2>
                    <p className="text-gray-700">
                        Manage and monitor laboratory strains with ease.
                    </p>
                </section>

                {/* Summary Statistics */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Total Strains</h3>
                        <p className="text-2xl font-bold text-green-700">{summary.totalStrains}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Active Cultures</h3>
                        <p className="text-2xl font-bold text-green-700">{summary.activeCultures}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Storage Locations</h3>
                        <p className="text-2xl font-bold text-green-700">{summary.storageLocations}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">No. of Depositors</h3>
                        <p className="text-2xl font-bold text-green-700">{summary.numberDepositors}</p>
                    </div>
                </section>

                {/* Announcements */}
                <section className="bg-[#DDEB9D] p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-yellow-700">Announcements</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                        {summary.announcements.map((announcement, index) => (
                            <li key={`announcement-${announcement.announcement_id}-${index}`}>
                                {announcement.message}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Recent Activity */}
                <section className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                        <ul className="list-disc pl-5 text-gray-700">
                            {summary.recentActivity.map((activity, index) => (
                                <li key={`activity-${activity.activity_id}-${index}`}>
                                    {activity.message}
                                </li>
                            ))}
                        </ul>
                </section>
        </main>
);
}
