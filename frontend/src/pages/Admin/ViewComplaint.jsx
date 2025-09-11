import { useLocation, useNavigate } from "react-router-dom";

export default function ViewComplaint() {
  const location = useLocation();
  const navigate = useNavigate();
  const complaint = location.state; // complaint object passed from OfficerHome

  if (!complaint) {
    return (
      <div className="p-6">
        <p className="text-red-600">No complaint data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-green-700 text-white rounded"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-800">Complaint Details</h1>

        <p><span className="font-semibold">Citizen:</span> {complaint.citizen}</p>
        <p><span className="font-semibold">Issue:</span> {complaint.issue}</p>
        <p><span className="font-semibold">Status:</span> {complaint.status}</p>
        <p className="mb-4">
          <span className="font-semibold">Description:</span> {complaint.description}
        </p>

        {complaint.image && (
          <img
            src={complaint.image}
            alt="Complaint evidence"
            className="rounded-lg shadow mb-4 max-h-64 object-cover"
          />
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
