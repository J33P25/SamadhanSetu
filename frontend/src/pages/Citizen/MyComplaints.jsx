import { useEffect, useState } from "react";
import { api, getAccessToken } from "../Auth/auth.js";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Load user and fetch complaints
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);

      api
        .get(`/complaints?userId=${decoded.id}`)
        .then((res) => {
          const data =
            Array.isArray(res.data) ? res.data : res.data?.complaints || [];
          setComplaints(data);
        })
        .catch((err) => {
          console.error("Error fetching complaints:", err);
          setError("Failed to load complaints. Please try again later.");
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C6C6D0] via-[#104C64] to-[#C0754D] p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#104C64] to-[#C0754D] p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ClipboardList className="w-6 h-6" />
            My Complaints
          </h2>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 text-[#104C64] animate-spin" />
            <span className="ml-2 text-gray-700">Loading complaints...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
          <>
            {/* Complaints Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-[#C6C6D0] sticky top-0">
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
                  {complaints.length > 0 ? (
                    complaints.map((complaint, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                      >
                        {/* Description */}
                        <td className="px-6 py-4 max-w-xs">
                          <p
                            className="text-sm font-medium text-gray-900 truncate"
                            title={complaint.issue}
                          >
                            {complaint.issue}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: #{complaint.id?.toString().padStart(4, "0")}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              complaint.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : complaint.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
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

                        {/* Date */}
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {complaint.date
                            ? new Date(complaint.date).toLocaleDateString()
                            : "-"}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              navigate(`/complaints/${complaint.id}`)
                            }
                            className="text-[#104C64] hover:text-[#C0754D] text-sm font-medium underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500 italic"
                      >
                        No complaints reported yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#C6C6D0]/40 border-t text-right">
              <p className="text-sm text-gray-600">
                Total Complaints:{" "}
                <span className="font-semibold">{complaints.length}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
