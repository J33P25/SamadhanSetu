// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    inProgress: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    // Fetch stats from backend later
    // Dummy data for now
    setStats({
      totalComplaints: 120,
      resolvedComplaints: 80,
      pendingComplaints: 25,
      inProgress: 15,
    });

    setRecentComplaints([
      { id: 1, issue: "Pothole near main road", status: "Resolved", date: "2025-10-05" },
      { id: 2, issue: "Streetlight not working", status: "In Progress", date: "2025-10-07" },
      { id: 3, issue: "Garbage not collected", status: "Pending", date: "2025-10-08" },
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Officer Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-600">Total Complaints</h2>
          <p className="text-3xl font-bold text-green-800 mt-2">{stats.totalComplaints}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
          <h2 className="text-lg font-semibold text-gray-600">In Progress</h2>
          <p className="text-3xl font-bold text-blue-800 mt-2">{stats.inProgress}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-600">
          <h2 className="text-lg font-semibold text-gray-600">Pending</h2>
          <p className="text-3xl font-bold text-yellow-800 mt-2">{stats.pendingComplaints}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-700">
          <h2 className="text-lg font-semibold text-gray-600">Resolved</h2>
          <p className="text-3xl font-bold text-green-700 mt-2">{stats.resolvedComplaints}</p>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Recent Complaints</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-900 text-left font-semibold">
              <th className="py-3 px-4">Issue</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((c) => (
              <tr key={c.id} className="border-b hover:bg-green-50">
                <td className="py-3 px-4">{c.issue}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Future Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Complaint Statistics (Coming Soon)</h2>
        <p className="text-gray-600">
          This section can later show a bar chart or pie chart using libraries like <strong>Recharts</strong> or <strong>Chart.js</strong>.
        </p>
      </div>
    </div>
  );
}
