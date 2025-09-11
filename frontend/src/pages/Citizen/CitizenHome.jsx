import { useEffect, useState } from "react";
import { api, getAccessToken } from "../Auth/auth.js";
import {
  Volume2,
  FileText,
  PlusCircle,
  ClipboardList,
  Bell,
  Calendar,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function CitizenHome() {
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ Load user from JWT
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("🔑 Decoded JWT:", decoded);
        setUser(decoded);

        // Optional: check expiry
        if (decoded.exp * 1000 < Date.now()) {
          console.error("⚠️ Token expired → redirecting to login");
          navigate("/login");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch announcements with token
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          console.error("No token found");
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:8000/api/announcements/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          console.error("Unauthorized → redirecting to login");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch announcements: ${res.status}`);
        }

        const data = await res.json();
        console.log("📢 Announcements:", data);
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
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
      value: complaints.filter((c) => c.status === "Resolved").length,
      icon: CheckCircle,
      trend: "+8 this month",
      color: "green",
    },
    {
      label: "Pending Issues",
      value: complaints.filter((c) => c.status !== "Resolved").length,
      icon: Clock,
      trend: "-2 from last week",
      color: "orange",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
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
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#104C64] to-[#C0754D] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Welcome Back, {user?.full_name || user?.username || "Citizen"}
              </h1>
            </div>
          </div>
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
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <Volume2 className="w-6 h-6" />
                    Latest Announcements
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {announcements.map((announcement, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border-l-4 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${getPriorityColor(
                      announcement.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 bg-[#C6C6D0] rounded-full text-xs font-medium">
                            {announcement.category}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.priority === "high"
                            ? "bg-[#C0754D]/20 text-[#C0754D]"
                            : announcement.priority === "medium"
                            ? "bg-[#104C64]/20 text-[#104C64]"
                            : "bg-[#C6C6D0] text-gray-800"
                        }`}
                      >
                        {announcement.priority?.toUpperCase()}
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
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-[#104C64] to-[#C0754D] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-medium">Report New Issue</span>
                </button>
                <button 
                onClick={() => navigate("/mycomplaints")}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-[#104C64] to-[#C0754D] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <ClipboardList className="w-5 h-5" />
                  <span className="font-medium">My Complaints</span>
                </button>
                <button 
                onClick={() => navigate("/feedback")}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-[#104C64] to-[#C0754D] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Submit Feedback</span>
                </button>
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Issue Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#104C64]/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#104C64]" />
                    <span className="text-sm font-medium text-[#104C64]">
                      Resolved
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[#104C64]">
                    {complaints.filter((c) => c.status === "Resolved").length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#C6C6D0]/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">
                      In Progress
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-700">
                    {complaints.filter((c) => c.status === "In Progress").length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#C0754D]/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#C0754D]" />
                    <span className="text-sm font-medium text-[#C0754D]">
                      Pending
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[#C0754D]">
                    {complaints.filter((c) => c.status === "Pending").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#104C64] to-[#C0754D] p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <ClipboardList className="w-6 h-6" />
                Recent Complaints
              </h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 bg-[#104C64]/60 rounded-lg text-sm">
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-[#104C64]/60 rounded-lg text-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#C6C6D0]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Issue Description
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Date Submitted
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {complaints.map((complaint, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {complaint.issue}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: #{complaint.id?.toString().padStart(4, "0")}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          complaint.status === "Resolved"
                            ? "bg-[#104C64]/20 text-[#104C64]"
                            : complaint.status === "In Progress"
                            ? "bg-[#C6C6D0]/40 text-gray-700"
                            : "bg-[#C0754D]/20 text-[#C0754D]"
                        }`}
                      >
                        {complaint.status === "Resolved" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {complaint.status === "In Progress" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {complaint.status === "Pending" && (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {complaint.date
                        ? new Date(complaint.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-[#104C64] hover:text-[#C0754D] text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-[#C6C6D0]/40 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {complaints.length} complaints
              </p>
              <button className="text-[#104C64] hover:text-[#C0754D] text-sm font-medium">
                View All Complaints →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
