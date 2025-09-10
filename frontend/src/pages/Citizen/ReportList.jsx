import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CATEGORIES = [
  "land and revenue",
  "law and order / public safety",
  "basic services and infra",
  "other",
];

export default function ReportForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle");

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
      markerRef.current = L.marker([coords.lat, coords.lng]).addTo(map);
      markerRef.current.bindPopup("<b>Report location</b><br/>Automatically captured.");
      markerRef.current.openPopup();
    } else {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      // update popup content if required
      markerRef.current.getPopup()?.setContent("<b>Report location</b><br/>Automatically captured.");
      markerRef.current.openPopup();
    }
  }, [coords]);

  function onFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setImagePreview(null);
      return;
    }
    setImagePreview(URL.createObjectURL(f));
  }

  function onSubmit(e) {
    e.preventDefault();
    alert("Report submitted (demo only).");
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
      }

      .rf-button {
        padding: 12px 18px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: 700;
        color: ${colors.darkGreen};
      }

      .rf-submit {
        background: ${colors.lightOrange};
      }

      .rf-refresh {
        background: ${colors.white};
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
      <form className="rf-form" onSubmit={onSubmit}>
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
          <button type="submit" className="rf-button rf-submit">
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}
