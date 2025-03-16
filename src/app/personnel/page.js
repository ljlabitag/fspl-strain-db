'use client';

import { useEffect, useState } from "react";
import axios from "axios";

const PersonnelPage = () => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await axios.get("/api/personnel");
        console.log("API Response:", response.data);
        setPersonnel(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching personnel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  if (loading) return <p>Loading personnel...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Personnel</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Job Title</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Projects</th>
          </tr>
        </thead>
        <tbody>
          {personnel.map((person) => (
            <tr key={person.person_id} className="border">
              <td className="border px-4 py-2">{person.person_name}</td>
              <td className="border px-4 py-2">{person.job_title || "N/A"}</td>
              <td className="border px-4 py-2">{person.email_address}</td>
              <td className="border px-4 py-2">
                {person.projects.length > 0
                  ? person.projects.map((proj) => proj.project.project_title).join(", ")
                  : "No Projects"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonnelPage;