import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../Auth/auth.js";

export default function AdminHome() {
  const navigate = useNavigate();
  const token = getAccessToken();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [feedbacks] = useState([
    { id: 1, citizen: "Rahul", message: "Quick resolution on road issue. Thanks!" },
    { id: 2, citizen: "Sneha", message: "Garbage pickup needs to be more frequent." },
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  // ✅ Fetch complaints & announcements
  useEffect(() => {
    if (!token) return navigate("/login");

    // Fetch complaints
    fetch("http://127.0.0.1:8000/api/reports/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setComplaints(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching complaints:", err));

    // Fetch announcements
    fetch("http://127.0.0.1:8000/api/announcements/")
      .then((res) => res.json())
      .then((data) => setAnnouncements(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching announcements:", err));
  }, [token, navigate]);

  // ✅ Add announcement
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/announcements/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAnnouncement),
      });

      if (!res.ok) throw new Error("Failed to add announcement");
      const data = await res.json();
      setAnnouncements([data, ...announcements]);
      setNewAnnouncement({ title: "", description: "", priority: "Medium" });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  // ✅ Complaint stats
  const totalComplaints = complaints.length;
  const resolved = complaints.filter((c) => c.status === "approved").length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const inProgress = complaints.filter((c) => c.status === "in_progress").length;

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col justify-between py-8 px-4 shadow-lg">
        {/* Top Section */}
        <div>
          <h1 className="text-2xl font-bold mb-8 text-center">Officer Panel</h1>

          <nav className="flex flex-col gap-3">
            {["dashboard", "complaints", "announcements", "feedback"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-green-600 text-white"
                    : "hover:bg-green-700 hover:text-white text-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section (Logout Button) */}
        <div className="border-t border-green-700 mt-8 pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            <span>Logout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-green-900 mb-6">
          Officer Dashboard — {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>

        {/* ✅ Dashboard Summary */}
        {activeTab === "dashboard" && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
              <h2 className="text-gray-500 font-semibold text-sm">Total Complaints</h2>
              <p className="text-3xl font-bold text-green-800 mt-2">{totalComplaints}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-500">
              <h2 className="text-gray-500 font-semibold text-sm">Pending</h2>
              <p className="text-3xl font-bold text-yellow-700 mt-2">{pending}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
              <h2 className="text-gray-500 font-semibold text-sm">In Progress</h2>
              <p className="text-3xl font-bold text-blue-700 mt-2">{inProgress}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600 md:col-span-3">
              <h2 className="text-gray-500 font-semibold text-sm">Resolved</h2>
              <p className="text-3xl font-bold text-green-700 mt-2">{resolved}</p>
            </div>
          </section>
        )}

        {/* ✅ Complaints Section */}
        {activeTab === "complaints" && (
          <section className="bg-white p-6 rounded-2xl shadow-md border border-green-200">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Complaints</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-green-900 font-semibold uppercase text-left">
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Issue</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-green-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/admincomplaints/${c.id}`, { state: { complaint: c } })
                    }
                  >
                    <td className="py-3 px-4">
                      {c.address || `${c.latitude}, ${c.longitude}`}
                    </td>
                    <td className="py-3 px-4">{c.description}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          c.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : c.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : c.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ✅ Announcements Section */}
        {activeTab === "announcements" && (
          <section className="bg-white p-6 rounded-2xl shadow-md border border-green-200">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Announcements</h2>

            <form onSubmit={handleAnnouncementSubmit} className="mb-8 border-b pb-6">
              <input
                type="text"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                }
                className="w-full p-3 mb-3 border border-green-300 rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={newAnnouncement.description}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, description: e.target.value })
                }
                className="w-full p-3 mb-3 border border-green-300 rounded-lg h-24"
                required
              ></textarea>
              <select
                value={newAnnouncement.priority}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })
                }
                className="p-3 mb-4 border border-green-300 rounded-lg"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button
                type="submit"
                className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
              >
                Add Announcement
              </button>
            </form>

            {announcements.map((a) => (
              <div key={a.id} className="border border-green-200 p-4 mb-3 rounded-xl bg-green-50">
                <h3 className="font-bold text-green-900">{a.title}</h3>
                <p className="text-green-800 mb-2">{a.description}</p>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-semibold ${
                    priorityColors[a.priority]
                  }`}
                >
                  Priority: {a.priority}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* ✅ Feedback Section */}
        {activeTab === "feedback" && (
          <section className="bg-white p-6 rounded-2xl shadow-md border border-green-200">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Citizen Feedback</h2>
            {feedbacks.map((f) => (
              <div key={f.id} className="border border-green-200 p-4 mb-3 rounded-xl bg-gray-50">
                <p className="font-semibold text-green-900">{f.citizen}</p>
                <p className="text-green-800">{f.message}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
