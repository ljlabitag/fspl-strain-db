import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="bg-gray-100 flex-grow p-6 space-y-6">
    {/* Welcome Message */}
    <section className="bg-[#A0C878] px-6 py-8 rounded-lg shadow">
      <h2 className="text-3xl font-bold">Welcome to the FSPL Strain Database</h2>
      <p className="text-gray-700">Manage and monitor laboratory strains with ease.</p>
    </section>

    {/* Summary Statistics */}
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Total Strains", value: "120" },
        { label: "Active Cultures", value: "80" },
        { label: "Storage Locations", value: "5" },
        { label: "Personnel Involved", value: "10" }
      ].map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">{stat.label}</h3>
          <p className="text-2xl font-bold text-green-700">{stat.value}</p>
        </div>
      ))}
    </section>

    {/* Announcements */}
    <section className="bg-[#DDEB9D] p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-yellow-700">Announcements</h3>
      <ul className="list-disc pl-5 text-gray-700">
        <li>🔧 System maintenance on March 20, 2025.</li>
        <li>📢 Lab meeting scheduled for March 25, 2025.</li>
      </ul>
    </section>

     {/* Recent Activity */}
     <section className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>📝 New strain <span className="font-italic">Bacillus subtilis</span> added by Dr. Smith.</li>
            <li>🔍 Data for strain ID 105 updated.</li>
            <li>📤 Strain reports exported by Lab Technician.</li>
          </ul>
        </section>
  </main>
  );
}
