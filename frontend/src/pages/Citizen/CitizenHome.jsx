import { useEffect, useState } from "react";
import { getAccessToken } from "../Auth/auth.js";
import {
  Volume2,
  FileText,
  PlusCircle,
  ClipboardList,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function CitizenHome() {
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ Load user, complaints, and announcements
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        // Complaints
        fetch("http://127.0.0.1:8000/api/reports/", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => setComplaints(Array.isArray(data) ? data : []));

        // Announcements
        fetch("http://127.0.0.1:8000/api/announcements/")
          .then((res) => res.json())
          .then((data) => setAnnouncements(Array.isArray(data) ? data : []));
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const stats = [
    {
      label: "Total Complaints",
      value: complaints.length,
      icon: ClipboardList,
      color: "blue",
    },
    {
      label: "Resolved Issues",
      value: complaints.filter((c) => c.status === "resolved").length,
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Pending Issues",
      value: complaints.filter(
        (c) => c.status === "pending" || c.status === "in_progress"
      ).length,
      icon: Clock,
      color: "orange",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "border-l-[#C0754D] bg-[#C0754D]/10";
      case "medium":
        return "border-l-[#104C64] bg-[#104C64]/10";
      case "low":
        return "border-l-[#C6C6D0] bg-[#C6C6D0]/20";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C6C6D0] via-[#104C64] to-[#C0754D]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#104C64] to-[#C0754D] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            Welcome Back, {user?.full_name || "Citizen"}
          </h1>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-[#104C64]/20"
                      : stat.color === "green"
                      ? "bg-[#104C64]/20"
                      : "bg-[#C0754D]/20"
                  }`}
                >
                  <stat.icon
                    className={`w-7 h-7 ${
                      stat.color === "blue"
                        ? "text-[#104C64]"
                        : stat.color === "green"
                        ? "text-[#104C64]"
                        : "text-[#C0754D]"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#104C64] to-[#C0754D] p-6 text-white">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Volume2 className="w-6 h-6" />
                  Latest Announcements
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {announcements.map((a, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border-l-4 rounded-lg hover:shadow-md transition-all duration-200 ${getPriorityColor(
                      a.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {a.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(a.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.priority?.toLowerCase() === "high"
                            ? "bg-[#C0754D]/20 text-[#C0754D]"
                            : a.priority?.toLowerCase() === "medium"
                            ? "bg-[#104C64]/20 text-[#104C64]"
                            : "bg-[#C6C6D0] text-gray-800"
                        }`}
                      >
                        {a.priority?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions + Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/report")}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-[#104C64] to-[#C0754D] text-white shadow-lg"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-medium">Report New Issue</span>
                </button>
                <button
                  onClick={() => navigate("/citizencomplaint")}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-[#104C64] to-[#C0754D] text-white shadow-lg"
                >
                  <ClipboardList className="w-5 h-5" />
                  <span className="font-medium">My Complaints</span>
                </button>
                <button
                  onClick={() => navigate("/feedback")}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-[#104C64] to-[#C0754D] text-white shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Submit Feedback</span>
                </button>
              </div>
            </div>

            {/* Issue Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Issue Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#104C64]/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#104C64]" />
                  <span className="text-lg font-bold text-[#104C64]">
                    {complaints.filter((c) => c.status === "resolved").length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#C6C6D0]/40 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <span className="text-lg font-bold text-gray-700">
                    {complaints.filter((c) => c.status === "in_progress").length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#C0754D]/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-[#C0754D]" />
                  <span className="text-lg font-bold text-[#C0754D]">
                    {complaints.filter((c) => c.status === "pending").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
