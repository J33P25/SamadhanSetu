// frontend/src/pages/Admin/ViewComplaint.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAccessToken } from "../Auth/auth.js";

export default function ViewComplaint() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const token = getAccessToken();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const [sysCoords, setSysCoords] = useState(null);

  // 1️⃣ Fetch complaint from API if not in state/localStorage
  useEffect(() => {
    const initialFromState = location.state && (location.state.complaint || location.state);
    if (initialFromState) {
      setComplaint(initialFromState);
      setLoading(false);
      return;
    }

    if (!id || !token) {
      navigate(-1);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/reports/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // API may return array or object
        const c = Array.isArray(data) ? data[0] : data;
        if (!c) throw new Error("Complaint not found");
        setComplaint(c);
        // persist locally if needed
        localStorage.setItem(`complaint-${c.id}`, JSON.stringify(c));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, token, location.state, navigate]);

  // 2️⃣ Browser geolocation
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setSysCoords({ lat: 20.5937, lng: 78.9629 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setSysCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setSysCoords({ lat: 20.5937, lng: 78.9629 }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // 3️⃣ Leaflet map
  useEffect(() => {
    if (!mapRef.current || !sysCoords) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapRef.current, {
        center: [sysCoords.lat, sysCoords.lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = map;
    } else {
      leafletMapRef.current.setView([sysCoords.lat, sysCoords.lng], 14);
    }

    if (!markerRef.current) {
      markerRef.current = L.marker([sysCoords.lat, sysCoords.lng]).addTo(leafletMapRef.current);
      markerRef.current.bindPopup("<b>System location</b>").openPopup();
    } else {
      markerRef.current.setLatLng([sysCoords.lat, sysCoords.lng]);
    }

    setTimeout(() => {
      try {
        leafletMapRef.current.invalidateSize();
      } catch (e) {}
    }, 120);
  }, [sysCoords]);

  if (loading) return <p className="p-6 text-gray-700">Loading complaint...</p>;
  if (!complaint)
    return (
      <div className="p-6">
        <p className="text-red-600 font-medium">No complaint data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          Back
        </button>
      </div>
    );

  // Tweaked formal letter
  const letterText = complaint.letter || `To
The District Collector
[District Name] District
[State], India

Subject: Report regarding issue ID #${complaint.id}

Respected Sir/Madam,

This is to formally submit that a complaint has been filed regarding the following matter:

Issue: ${complaint.issue}
Description: ${complaint.description}

${complaint.image ? "Attached Image: Please refer to the evidence image provided with this complaint for visual reference." : ""}

The matter has been recorded and is respectfully brought to the attention of the District Administration for necessary review and appropriate action.

Thanking you,

Yours faithfully,
Concerned Citizen`;

  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reports/${complaint.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setComplaint(updated);
      localStorage.setItem(`complaint-${updated.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  // Ensure image URL is absolute
  const imageUrl =
    complaint.image && !complaint.image.startsWith("http")
      ? `http://127.0.0.1:8000${complaint.image}`
      : complaint.image;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow overflow-hidden border border-green-200">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-green-200 bg-green-50">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 mr-4"
              aria-label="Back"
            >
              ← Back
            </button>
            <div>
              <div className="text-lg font-semibold text-green-800">Complaint #{complaint.id}</div>
              <div className="text-sm text-green-700">
                {complaint.address || `${complaint.latitude}, ${complaint.longitude}`} — {complaint.issue}
              </div>
            </div>
          </div>
          <div>
            <span className={`px-3 py-1 rounded text-sm font-semibold ${statusBadgeClass(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
        </div>

        {/* main content */}
        <div className="flex">
          <div className="w-1/2 p-6 border-r border-green-200">
            <h2 className="text-xl font-semibold mb-3 text-green-700">Formal Letter</h2>
            <textarea
              readOnly
              value={letterText}
              className="w-full h-[72vh] p-4 border rounded-md bg-gray-50 text-sm text-gray-800 resize-none"
            />
            {imageUrl && (
              <div className="mt-4">
                <h3 className="text-green-700 font-semibold mb-2">Attached Image</h3>
                <img src={imageUrl} alt="Complaint Evidence" className="w-full max-h-80 object-contain rounded border border-green-200" />
              </div>
            )}
          </div>

          <div className="w-1/2 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm text-green-700 mb-2 font-semibold">Reported Location (system)</h3>
              <div ref={mapRef} className="w-full h-56 rounded-md border border-green-200 overflow-hidden" />
            </div>

            <div className="mt-auto">
              <div className="flex gap-4">
                <button
                  onClick={() => updateStatus("approved")}
                  className="flex-1 px-6 py-3 bg-green-700 text-white rounded hover:bg-green-800 font-semibold"
                >
                  APPROVE
                </button>
                <button
                  onClick={() => updateStatus("completed")}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-800 font-semibold"
                >
                  MARK COMPLETED
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
