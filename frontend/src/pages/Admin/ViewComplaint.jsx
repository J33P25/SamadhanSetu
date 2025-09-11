// frontend/src/pages/Admin/ViewComplaint.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * ViewComplaint page (full-page route)
 * - route: /officer/complaints/:id
 * - prefers complaint object from location.state (OfficerHome should pass it)
 * - falls back to localStorage key `complaint-{id}` (useful when opening the URL directly)
 * - left half: formal letter (read-only)
 * - top-right: small Leaflet map showing system/browser location (demo)
 * - bottom-right: two action buttons to change status (persisted to localStorage)
 *
 * Colors tuned to match Officer Dashboard:
 *  - primary dark green: text-green-800 / bg-green-50 / border-green-200
 *  - mint accent: bg-green-100 etc.
 */

export default function ViewComplaint() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // route param

  // Prefer complaint passed via location.state (may be either { complaint } or plain object)
  const initialFromState = location.state && (location.state.complaint || location.state);
  const storedKey = id
    ? `complaint-${id}`
    : initialFromState
    ? `complaint-${initialFromState.id}`
    : null;

  const storedJson = storedKey ? localStorage.getItem(storedKey) : null;

  const [complaint, setComplaint] = useState(() => {
    if (initialFromState) return initialFromState;
    if (storedJson) return JSON.parse(storedJson);
    return null;
  });

  // Map refs for Leaflet
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  // system/browser coords for demo map (fallback center of India)
  const [sysCoords, setSysCoords] = useState(null);

  // Acquire browser location (demo). If denied, fallback to India center.
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

  // Init / update Leaflet map when sysCoords ready
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

    // ensure correct tile rendering after layout
    setTimeout(() => {
      try {
        leafletMapRef.current.invalidateSize();
      } catch (e) {
        /* ignore */
      }
    }, 120);
  }, [sysCoords]);

  // If not present, try to read complaint from localStorage on mount
  useEffect(() => {
    if (!complaint && storedKey) {
      const s = localStorage.getItem(storedKey);
      if (s) setComplaint(JSON.parse(s));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If still no complaint, show fallback message
  if (!complaint) {
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
  }

  // Generate formal letter text if complaint does not include one
  const letterText =
    complaint.letter ||
    `To
The District Collector
[District Name] District
[State], India

Subject: Report on ${complaint.issue}

Respected Sir/Madam,

This is to formally submit that I, ${complaint.citizen}, have filed a report concerning ${complaint.issue}. The matter has been recorded and respectfully brought to the attention of the District Administration for necessary review and appropriate action.

I request the District Government to kindly acknowledge this submission and initiate suitable measures in accordance with prescribed procedures.

Thanking you,

Yours faithfully,
${complaint.citizen}`;

  // Persist status locally (replace this with API call if you have backend)
  const updateStatus = (newStatus) => {
    const updated = { ...complaint, status: newStatus };
    setComplaint(updated);
    const key = storedKey || `complaint-${updated.id}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // Status badge classes
  const statusBadgeClass = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "In Progress") return "bg-blue-100 text-blue-700";
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Completed") return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
  };

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
              <div className="text-sm text-green-700">{complaint.citizen} — {complaint.issue}</div>
            </div>
          </div>

          <div>
            <span className={`px-3 py-1 rounded text-sm font-semibold ${statusBadgeClass(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
        </div>

        {/* main content: left letter, right map + actions */}
        <div className="flex">
          {/* left half: formal letter */}
          <div className="w-1/2 p-6 border-r border-green-200">
            <h2 className="text-xl font-semibold mb-3 text-green-700">Formal Letter</h2>

            <textarea
              readOnly
              value={letterText}
              className="w-full h-[72vh] p-4 border rounded-md bg-gray-50 text-sm text-gray-800 resize-none"
            />
          </div>

          {/* right half: top-right map (quarter) + bottom-right actions */}
          <div className="w-1/2 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm text-green-700 mb-2 font-semibold">Reported Location (system)</h3>
              <div
                ref={mapRef}
                className="w-full h-56 rounded-md border border-green-200 overflow-hidden"
                aria-label="map showing report location"
              />
            </div>

            {/* action buttons area (bottom-right quarter) */}
            <div className="mt-auto">
              <div className="flex gap-4">
                <button
                  onClick={() => updateStatus("Approved")}
                  className="flex-1 px-6 py-3 bg-green-700 text-white rounded hover:bg-green-800 font-semibold"
                >
                  APPROVE
                </button>

                <button
                  onClick={() => updateStatus("Completed")}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-800 font-semibold"
                >
                  MARK COMPLETED
                </button>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Status updated locally. If you have a backend API, replace the localStorage persistence in <code>updateStatus</code> with an API request.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
