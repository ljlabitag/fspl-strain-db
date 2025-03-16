'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const StrainsPage = () => {
  const [strains, setStrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrains = async () => {
      try {
        const response = await axios.get("/api/strains");
        setStrains(response.data);
      } catch (error) {
        console.error("Error fetching strains:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrains();
  }, []);

  if (loading) return <p>Loading strains...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Strains</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Accession Number</th>
            <th className="border px-4 py-2">Genus</th>
            <th className="border px-4 py-2">Species</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Form</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Depositor</th>
          </tr>
        </thead>
        <tbody>
          {strains.map((strain) => (
            <tr key={strain.strain_id} className="border">
              <td className="border px-4 py-2">FSPL-{strain.strain_id}</td>
              <td className="border px-4 py-2">{strain.strain_genus}</td>
              <td className="border px-4 py-2">{strain.strain_species}</td>
              <td className="border px-4 py-2">{strain.status}</td>
              <td className="border px-4 py-2">{strain.form}</td>
              <td className="border px-4 py-2">{strain.location?.loc_name || "N/A"}</td>
              <td className="border px-4 py-2">{strain.depositor?.person_name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StrainsPage;
