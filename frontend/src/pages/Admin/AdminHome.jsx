import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  const initialComplaints = [
    {
      id: 1,
      citizen: "Arjun",
      issue: "Streetlight not working",
      status: "Pending",
      description: "Streetlight near house no. 23 is not working for 3 days.",
      image: "/mocks/streetlight.jpg",
    },
    {
      id: 2,
      citizen: "Meera",
      issue: "Garbage not collected",
      status: "In Progress",
      description: "Garbage piled up near park gate, attracting stray dogs.",
      image: "/mocks/garbage.jpg",
    },
  ];

  const [complaints, setComplaints] = useState(() =>
    initialComplaints.map((c) => {
      const stored = localStorage.getItem(`complaint-${c.id}`);
      return stored ? JSON.parse(stored) : c;
    })
  );

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Water Supply Alert",
      description: "No supply tomorrow from 9AM–2PM",
      date: "2025-09-12 10:30",
      priority: "High",
    },
  ]);

  const [feedbacks] = useState([
    { id: 1, citizen: "Rahul", message: "Quick resolution on road issue. Thanks!" },
    { id: 2, citizen: "Sneha", message: "Garbage pickup needs to be more frequent." },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  // Sync complaints from localStorage when page regains focus
  useEffect(() => {
    const onFocus = () => {
      setComplaints((prev) =>
        prev.map((c) => {
          const stored = localStorage.getItem(`complaint-${c.id}`);
          return stored ? JSON.parse(stored) : c;
        })
      );
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = now.toLocaleString();
    const newEntry = {
      id: announcements.length + 1,
      ...newAnnouncement,
      date: formattedDate,
    };
    setAnnouncements([newEntry, ...announcements]);
    setNewAnnouncement({ title: "", description: "", priority: "Medium" });
  };

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8 sm:p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-green-900 tracking-wide">
        Officer Dashboard
      </h1>

      {/* Complaints Section */}
      <section className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-green-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-800 tracking-wide">
          Complaints
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse text-gray-700 shadow-sm">
            <thead>
              <tr className="bg-green-100 text-left text-green-900 font-semibold uppercase tracking-wide">
                <th className="py-3 px-4">Citizen</th>
                <th className="py-3 px-4">Issue</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-200 cursor-pointer hover:bg-green-50 transition-colors duration-150"
                  onClick={() => navigate(`/officer/complaints/${c.id}`, { state: { complaint: c } })}

                >
                  <td className="py-3 px-4 font-medium">{c.citizen}</td>
                  <td className="py-3 px-4">{c.issue}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        c.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : c.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : c.status === "Approved"
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
        </div>
      </section>

      {/* Announcements Section */}
      <section className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-green-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-800 tracking-wide">
          Announcements
        </h2>
        <form
          onSubmit={handleAnnouncementSubmit}
          className="space-y-5 mb-8 border-b border-green-300 pb-6"
        >
          <input
            type="text"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
            }
            className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 placeholder-green-600 transition"
            required
          />
          <textarea
            placeholder="Description"
            value={newAnnouncement.description}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, description: e.target.value })
            }
            className="w-full p-3 border border-green-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 placeholder-green-600 transition"
            required
          ></textarea>
          <select
            value={newAnnouncement.priority}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })
            }
            className="w-full max-w-xs p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 transition"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-500 transition"
          >
            Add Announcement
          </button>
        </form>

        <div className="space-y-6">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="border border-green-200 p-6 rounded-xl bg-green-50 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-extrabold text-xl text-green-900 mb-1 tracking-wide">
                {a.title}
              </h3>
              <p className="text-green-800 mb-3 leading-relaxed">{a.description}</p>
              <div className="flex flex-wrap items-center justify-between text-sm text-green-700 font-medium">
                <span>Date: {a.date}</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold tracking-wide ${
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
      <section className="bg-white p-8 rounded-2xl shadow-lg border border-green-200">
        <h2 className="text-2xl font-semibold mb-6 text-green-800 tracking-wide">
          Citizen Feedback
        </h2>
        <ul className="space-y-5">
          {feedbacks.map((f) => (
            <li
              key={f.id}
              className="border border-green-200 p-5 rounded-xl bg-gray-50 shadow-inner hover:shadow-md transition"
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
