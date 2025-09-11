import { useEffect, useState } from "react";
import { Volume2, FileText, PlusCircle, ClipboardList, Bell, Calendar, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, Search, Filter } from "lucide-react";

export default function CitizenHome() {
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Mock data for demo purposes
  useEffect(() => {
    // Mock announcements
    setAnnouncements([
      { 
        id: 1, 
        title: "New Public Park Opening Next Month", 
        date: "2024-09-10", 
        priority: "high",
        category: "Infrastructure"
      },
      { 
        id: 2, 
        title: "Water Supply Maintenance Schedule", 
        date: "2024-09-08", 
        priority: "medium",
        category: "Utilities"
      },
      { 
        id: 3, 
        title: "Community Meeting on Budget Planning", 
        date: "2024-09-05", 
        priority: "low",
        category: "Community"
      }
    ]);

    // Mock complaints
    setComplaints([
      { id: 1, issue: "Streetlight not working on Oak Avenue", status: "In Progress", date: "2024-09-09" },
      { id: 2, issue: "Pothole repair needed on Main Street", status: "Resolved", date: "2024-09-07" },
      { id: 3, issue: "Noise complaint from construction site", status: "Pending", date: "2024-09-06" },
      { id: 4, issue: "Garbage collection missed", status: "Resolved", date: "2024-09-05" },
      { id: 5, issue: "Traffic signal malfunction", status: "In Progress", date: "2024-09-04" }
    ]);
  }, []);

  const stats = [
    { label: "Total Complaints", value: "47", icon: ClipboardList, trend: "+3 this week", color: "blue" },
    { label: "Resolved Issues", value: "32", icon: CheckCircle, trend: "+8 this month", color: "green" },
    { label: "Pending Issues", value: "15", icon: Clock, trend: "-2 from last week", color: "orange" }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Welcome Back, Sarah
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Here's your personalized civic dashboard for today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                S
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 flex items-center gap-1 ${
                    stat.trend.includes('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <stat.icon className={`w-7 h-7 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Announcements Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <Volume2 className="w-6 h-6" />
                    Latest Announcements
                  </h2>
                  <button className="text-blue-100 hover:text-white transition-colors text-sm font-medium">
                    View All →
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {announcements.map((announcement, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border-l-4 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${getPriorityColor(announcement.priority)}`}
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
                            <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-medium">
                              {announcement.category}
                            </span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                          announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {announcement.priority.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-medium">Report New Issue</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <ClipboardList className="w-5 h-5" />
                  <span className="font-medium">My Complaints</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Submit Feedback</span>
                </button>
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Issue Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Resolved</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">32</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">In Progress</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">8</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <ClipboardList className="w-6 h-6" />
                Recent Complaints
              </h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Issue Description</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Date Submitted</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {complaints.map((complaint, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{complaint.issue}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: #{complaint.id.toString().padStart(4, '0')}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          complaint.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : complaint.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {complaint.status === "Resolved" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {complaint.status === "In Progress" && <Clock className="w-3 h-3 mr-1" />}
                        {complaint.status === "Pending" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {new Date(complaint.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing {complaints.length} of 47 complaints</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Complaints →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}