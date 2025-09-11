import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import jsPDF from "jspdf";
import { api,getAccessToken } from "../Auth/auth";

const CATEGORIES = [
  "land and revenue",
  "law and order / public safety",
  "basic services and infra",
  "other",
];

export default function ReportForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle");
  const [municipalOffice, setMunicipalOffice] = useState("Fetching municipal office...");
  const [userLocation, setUserLocation] = useState({ city: "", district: "", state: "" });



  const mapRef = useRef(null); 
  const leafletMapRef = useRef(null); 
  const markerRef = useRef(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("ready");
      },
      () => setGeoStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!leafletMapRef.current) {
      // create map instance
      const map = L.map(mapRef.current, {
        center: [0, 0],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = map;
    }

    return () => {
      // remove only if you want to fully destroy map on unmount
      // if (leafletMapRef.current) {
      //   leafletMapRef.current.remove();
      //   leafletMapRef.current = null;
      // }
    };
  }, [mapRef]);

  // when coords update, move map + update marker
  useEffect(() => {
    if (!coords || !leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // size might change; ensure proper rendering
    setTimeout(() => map.invalidateSize(), 100);

    // center map and set zoom appropriate for a small square
    map.setView([coords.lat, coords.lng], 16);

    // create or move marker
    if (!markerRef.current) {
      // Create draggable marker
      markerRef.current = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);

      // Bind popup
      markerRef.current.bindPopup("<b>Report location</b><br/>Drag to correct location.").openPopup();

      // Update coords when marker is dragged
      markerRef.current.on("dragend", (e) => {
        const latLng = e.target.getLatLng();
        setCoords({ lat: latLng.lat, lng: latLng.lng });
        map.setView(latLng); // keep marker centered
      });
    } else {
      // Move existing marker
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      markerRef.current.getPopup()?.setContent("<b>Report location</b><br/>Drag to correct location.");
      markerRef.current.openPopup();
    }

    // ✅ Reverse geocoding to get district/city
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`)
      .then((res) => res.json())
      .then((data) => {
        const city = data.address.city || data.address.town || data.address.village || "";
        const district = data.address.county || data.address.state_district || "";
        const state = data.address.state || "";
        setUserLocation({ city, district, state });
      })
      .catch((err) => {
        console.error("Error fetching city/district/state:", err);
        setUserLocation({ city: "", district: "", state: "" });
      });
  }, [coords]);

  function onFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setImagePreview(null);
      return;
    }

    // Preview for UI
    setImagePreview(URL.createObjectURL(f));

    // Convert to base64 for PDF
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("uploadedImage", reader.result); // store temporarily
    };
    reader.readAsDataURL(f);
  }

  async function getNearbyMunicipalOffice(coords) {
    // Using OpenStreetMap Nominatim API (free)
    const url = `https://nominatim.openstreetmap.org/search.php?q=municipal+office&format=json&limit=1&lat=${coords.lat}&lon=${coords.lng}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        return data[0].display_name;
      }
      return "Municipal office not found nearby";
    } catch (err) {
      console.error("Error fetching municipal office:", err);
      return "Municipal office not found";
    }
  }


  function onSubmit(e) {
  e.preventDefault();

  if (!category || !description || !coords) {
    alert("Please fill all required fields before submitting.");
    return;
  }

  const doc = new jsPDF();
  const today = new Date().toLocaleDateString();
  const userFullName = localStorage.getItem("user_full_name");

  const letter = `
To,
Municipal Office,
${userLocation.district},
${userLocation.state}

Subject: Complaint Regarding ${category}

Respected Sir/Madam,

I am writing to formally lodge a complaint regarding the following issue:

${description}

The issue has been observed at the following location:
Latitude: ${coords.lat.toFixed(6)}, Longitude: ${coords.lng.toFixed(6)}

I kindly request your immediate attention and necessary action in resolving this matter
at the earliest possible time. I would be grateful for your prompt intervention.

Thank you.

Yours sincerely,
${userFullName || "Citizen"}
Date: ${today}

You can find the necessary image corresponding to the issue below :-
`;

  doc.setFont("Times", "Roman");
  doc.setFontSize(12);
  doc.text(letter, 20, 30, { maxWidth: 170 });

  const imgData = localStorage.getItem("uploadedImage");
  if (imgData) {
    doc.addPage();
    doc.addImage(imgData, "JPEG", 20, 40, 160, 120);
  }

  doc.save("complaint_letter.pdf");
}



  const colors = {
    darkGreen: "#0B2F20", // 🔑 Dark green background
    lightOrange: "#F4B183", // 🔑 Light orange for headings/buttons
    white: "#FFFFFF", // 🔑 White for text
  };

  return (
    <div className="rf-page">
      <style>{`
      .rf-page {
        min-height: 100vh;
        width: 100vw;
        background: ${colors.darkGreen}; /* Dark green full-page background */
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Inter, Roboto, sans-serif;
        color: ${colors.white};
      }

      /* Full-width band header */
      .rf-title {
        width: 100%;
        background: ${colors.lightOrange};
        color: ${colors.darkGreen};
        font-size: 32px;
        font-weight: 800;
        text-align: center;
        padding: 20px 0;
        margin-top: 40px;
      }

      .rf-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        max-width: 800px;
        padding: 20px;
        box-sizing: border-box;
      }

      .rf-field {
        margin-bottom: 20px;
        width: 100%;
      }

      /* 🔑 Label styling: bold, bigger, white */
      .rf-label {
        display: block;
        font-weight: 800;
        font-size: 20px;
        margin-bottom: 8px;
        text-align: center;
        text-transform: uppercase;
        color: ${colors.lightOrange};
      }

      .rf-input,
      .rf-select {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: none;
        text-align: center;
        background: #fff;
        color: ${colors.darkGreen};
        box-sizing: border-box;
      }

      .rf-textarea {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        border: none;
        background: #fff;
        color: ${colors.darkGreen};
        resize: vertical;
        min-height: 100px;
        font-family: Inter, Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        box-sizing: border-box;
      }

      .rf-textarea::placeholder {
        color: #666;
        font-style: italic;
      }

      .rf-preview {
        margin-top: 12px;
        max-width: 100%;
        border-radius: 8px;
      }

      .rf-loc-box {
        background: rgba(255, 255, 255, 0.1);
        padding: 12px;
        border-radius: 8px;
        text-align: center;
        color: ${colors.white};
      }

      /* Map square styling */
      .rf-map {
        width: 100%;
        max-width: 360px; /* keep it compact */
        height: 220px;
        margin: 12px auto 0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        background: #e6e6e6;
      }

      .rf-btns {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 20px;
      }

      .rf-button {
        padding: 12px 18px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: 700;
        color: ${colors.darkGreen};
        transition: all 0.2s ease;
      }

      .rf-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      .rf-submit {
        background: ${colors.lightOrange};
      }

      .rf-refresh {
        background: ${colors.white};
      }

      /* Character counter styling */
      .rf-char-counter {
        text-align: right;
        font-size: 12px;
        color: ${colors.lightOrange};
        margin-top: 4px;
        opacity: 0.8;
      }

      /* Responsive tweak: on wide screens place map to right of location box */
      @media (min-width: 960px) {
        .rf-loc-row {
          display:flex;
          gap:16px;
          align-items:flex-start;
          justify-content:center;
        }
        .rf-loc-box {
          flex: 1;
          max-width: 400px;
          text-align: left;
          padding-left: 18px;
        }
        .rf-map { margin: 0; }
      }
    `}</style>

      {/* Full-width band title */}
      <div className="rf-title">FILE A REPORT</div>

      {/* Form content */}
      <div className="rf-form">
        {/* Attach image */}
        <div className="rf-field">
          <label className="rf-label">Attach an image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="rf-input"
          />
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="rf-preview" />
          )}
        </div>

        {/* Category */}
        <div className="rf-field">
          <label className="rf-label">Choose Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rf-select"
          >
            <option value="">-- Choose Category --</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

                {/* Description box */}
        <div className="rf-field">
          <label className="rf-label">Describe the issue</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rf-textarea"
            placeholder="Please provide a brief description of the issue you are reporting. Include any relevant details such as when you noticed the problem, its severity, and how it affects you or the community..."
            maxLength={500}
          />
          <div className="rf-char-counter">
            {description.length}/500 characters
          </div>
        </div>

        {/* Location + Map row */}
        <div className="rf-field rf-loc-row">
          <div style={{ width: "100%" }}>
            <label className="rf-label">Location</label>
            <div className="rf-loc-box">
              {geoStatus === "loading" && <div>Getting location…</div>}
              {geoStatus === "error" && <div>Location not available</div>}
              {geoStatus === "ready" && coords && (
                <div>
                  <strong>
                    {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                  </strong>
                  <div>Automatically captured</div>
                </div>
              )}
            </div>
          </div>

          {/* Map square */}
          <div
            ref={mapRef}
            className="rf-map"
            aria-label="map showing report location"
          />
        </div>



        {/* Buttons */}
        <div className="rf-btns">
          <button
            type="button"
            className="rf-button rf-refresh"
            onClick={() => window.location.reload()}
          >
            Refresh location
          </button>
          <button 
            type="button" 
            className="rf-button rf-submit"
            onClick={onSubmit}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}