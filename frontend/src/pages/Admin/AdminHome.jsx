import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../Auth/auth.js";

export default function AdminHome() {
  const navigate = useNavigate();
  const token = getAccessToken();

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

  // ✅ Fetch complaints + announcements from API
  useEffect(() => {
    if (!token) return navigate("/login");

    // Fetch complaints
    fetch("http://127.0.0.1:8000/api/reports/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch complaints");
        return res.json();
      })
      .then((data) => setComplaints(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching complaints:", err));

    // Fetch announcements
    fetch("http://127.0.0.1:8000/api/announcements/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch announcements");
        return res.json();
      })
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
      setAnnouncements([data, ...announcements]); // prepend new one
      setNewAnnouncement({ title: "", description: "", priority: "Medium" });
    } catch (err) {
      console.error(err);
    }
  };

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8 sm:p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-green-900 tracking-wide">
        Officer Dashboard
      </h1>

      {/* Complaints Section */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8 border border-green-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-800 tracking-wide">
          Complaints
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse text-gray-700 shadow-sm">
            <thead>
              <tr className="bg-green-100 text-left text-green-900 font-semibold uppercase tracking-wide">
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Issue</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-200 cursor-pointer hover:bg-green-50 transition-colors duration-200 ease-in-out"
                  onClick={() => navigate(`/admincomplaints/${c.id}`, { state: { complaint: c } })}
                >
                  <td className="py-3 px-4 font-medium">
                    {c.address || `${c.latitude}, ${c.longitude}`}
                  </td>
                  <td className="py-3 px-4">{c.description}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        c.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : c.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : c.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : c.status === "completed"
                          ? "bg-gray-300 text-gray-800"
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
        </div>
      </section>


      {/* Announcements Section */}
      <section className="bg-white text-black p-6 sm:p-8 rounded-2xl shadow-lg mb-8 border border-green-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-800 tracking-wide">
          Announcements
        </h2>
        <form
          onSubmit={handleAnnouncementSubmit}
          className="mb-8 border-b border-green-300 pb-6"
        >
          <div className="mb-3">
            <input
              type="text"
              placeholder="Title"
              value={newAnnouncement.title}
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
              }
              className="w-full p-3 border border-green-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-3">
            <textarea
              placeholder="Description"
              value={newAnnouncement.description}
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, description: e.target.value })
              }
              className="w-full p-3 border border-green-300 rounded-lg h-28 sm:h-24 resize-none"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <select
              value={newAnnouncement.priority}
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })
              }
              className="w-full max-w-xs p-3 border border-green-300 rounded-lg"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 transition-colors duration-150 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Add Announcement
            </button>
          </div>
        </form>


        <div className="space-y-6">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="border border-green-200 p-6 rounded-xl bg-green-50 shadow-sm hover:shadow-md transition-shadow duration-150"
            >
              <h3 className="font-extrabold text-xl text-green-900 mb-1">{a.title}</h3>
              <p className="text-green-800 mb-3">{a.description}</p>
              <div className="flex items-center justify-between text-sm text-green-700 font-medium">
                <span>{new Date(a.date).toLocaleString()}</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold ${
                    priorityColors[a.priority] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  Priority: {a.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-green-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-800 tracking-wide">
          Citizen Feedback
        </h2>
        <ul className="space-y-5">
          {feedbacks.map((f) => (
            <li
              key={f.id}
              className="border border-green-200 p-5 rounded-xl bg-gray-50 shadow-inner"
            >
              <p className="font-semibold text-green-900 mb-2">{f.citizen}</p>
              <p className="text-green-800">{f.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
