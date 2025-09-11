import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { value: "land", label: "Land and Revenue" },
  { value: "law", label: "Law and Order / Public Safety" },
  { value: "infra", label: "Basic Services and Infra" },
  { value: "other", label: "Other" },
];

export default function ReportForm() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle");
  const [showCamera, setShowCamera] = useState(false);
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState({
    city: "",
    district: "",
    state: "",
  });

  const navigate = useNavigate();

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // --- geolocation ---
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

  // --- init map ---
  useEffect(() => {
    if (!mapRef.current) return;
    if (!leafletMapRef.current) {
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
  }, []);

  // --- update marker when coords change ---
  useEffect(() => {
    if (!coords || !leafletMapRef.current) return;
    const map = leafletMapRef.current;

    setTimeout(() => map.invalidateSize(), 100);
    map.setView([coords.lat, coords.lng], 16);

    if (!markerRef.current) {
      markerRef.current = L.marker([coords.lat, coords.lng], {
        draggable: true,
      }).addTo(map);
      markerRef.current
        .bindPopup("<b>Report location</b><br/>Drag to correct location.")
        .openPopup();
      markerRef.current.on("dragend", (e) => {
        const latLng = e.target.getLatLng();
        setCoords({ lat: latLng.lat, lng: latLng.lng });
        map.setView(latLng);
      });
    } else {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
    }

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
    )
      .then((res) => res.json())
      .then((data) => {
        const city =
          data.address.city || data.address.town || data.address.village || "";
        const district = data.address.county || data.address.state_district || "";
        const state = data.address.state || "";
        setUserLocation({ city, district, state });
      })
      .catch(() => setUserLocation({ city: "", district: "", state: "" }));
  }, [coords]);

  // --- fetch address string ---
  useEffect(() => {
    if (!coords) return;
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`,
      { headers: { "User-Agent": "SamadhanSetuApp/1.0" } }
    )
      .then((res) => res.json())
      .then((data) => setAddress(data.display_name || "Unknown location"))
      .catch(() => setAddress("Unknown location"));
  }, [coords]);

  // --- handle file upload ---
  function onFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  }

  // --- camera ---
  async function startCamera() {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch {
      alert("Camera access denied or not available");
      setShowCamera(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  }

  function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setImageFile(new File([blob], "photo.jpg", { type: "image/jpeg" }));
          setImagePreview(URL.createObjectURL(blob));
          stopCamera();
        }
      },
      "image/jpeg",
      0.8
    );
  }

  // --- submit to Django API ---
  async function onSubmit(e) {
    e.preventDefault();
    if (!category || !description || !coords) {
      alert("Please fill all required fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("description", description);
    formData.append("latitude", coords.lat);
    formData.append("longitude", coords.lng);
    formData.append("address", address);
    if (imageFile) formData.append("image", imageFile);

    try {
      const headers = {};
      const token = localStorage.getItem("access_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("http://127.0.0.1:8000/api/reports/", {
        method: "POST",
        headers,
        body: formData,
      });

      if (res.ok) {
        alert("Report submitted successfully!");
        setCategory("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
        navigate("/citizenhome");
      } else {
        const err = await res.json();
        console.error("Error response:", err);
        alert("Failed to submit report. Check console for details.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error while submitting report.");
    }
  }

  // --- styles ---
  const colors = {
    darkGreen: "#0B2F20",
    lightOrange: "#F4B183",
    white: "#FFFFFF",
  };

  return (
    <div className="rf-page">
      <style>{`
        .rf-page {
          min-height: 100vh;
          width: 100vw;
          background: ${colors.darkGreen};
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: Inter, Roboto, sans-serif;
          color: ${colors.white};
        }
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
        .rf-form { max-width: 800px; width: 100%; padding: 20px; }
        .rf-label { display: block; font-weight: 800; font-size: 20px; margin-bottom: 8px; text-align: center; text-transform: uppercase; color: ${colors.lightOrange}; }
        .rf-input, .rf-select, .rf-textarea {
          width: 100%; padding: 12px; border-radius: 8px; border: none;
          background: #fff; color: ${colors.darkGreen};
        }
        .rf-textarea { resize: vertical; min-height: 100px; }
        .rf-btns { display: flex; justify-content: center; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
        .rf-button { padding: 12px 18px; border-radius: 8px; border: none; cursor: pointer; font-weight: 700; }
        .rf-submit { background: ${colors.lightOrange}; color: ${colors.darkGreen}; }
        .rf-refresh { background: ${colors.white}; color: ${colors.darkGreen}; }
        .rf-map { width: 100%; max-width: 360px; height: 220px; border-radius: 8px; margin: 12px auto; }
        .rf-camera-container {
          position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.9);
          display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:1000;
        }
      `}</style>

      <div className="rf-title">FILE A REPORT</div>

      <form className="rf-form" onSubmit={onSubmit}>
        {/* image */}
        <div>
          <label className="rf-label">Attach an image</label>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              type="button"
              onClick={startCamera}
              className="rf-button rf-refresh"
            >
              Take Photo
            </button>
            <label className="rf-button rf-refresh" style={{ cursor: "pointer" }}>
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              style={{ marginTop: "10px", maxWidth: "100%", borderRadius: "8px" }}
            />
          )}
        </div>

        {/* category */}
        <div>
          <label className="rf-label">Choose Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rf-select"
          >
            <option value="">-- Choose Category --</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* description */}
        <div>
          <label className="rf-label">Describe the issue</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rf-textarea"
            maxLength={500}
          />
          <div style={{ textAlign: "right", fontSize: "12px", color: colors.lightOrange }}>
            {description.length}/500
          </div>
        </div>

        {/* location */}
        <div>
          <label className="rf-label">Location</label>
          <div>
            {geoStatus === "loading" && "Getting location…"}
            {geoStatus === "error" && "Location not available"}
            {geoStatus === "ready" && address}
          </div>
          <div ref={mapRef} className="rf-map" />
        </div>

        <div className="rf-btns">
          <button
            type="button"
            className="rf-button rf-refresh"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
          <button type="submit" className="rf-button rf-submit">
            Submit Report
          </button>
        </div>
      </form>

      {showCamera && (
        <div className="rf-camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ maxWidth: "90vw", maxHeight: "70vh" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button
              type="button"
              onClick={takePhoto}
              className="rf-button rf-submit"
            >
              <Camera size={16} /> Capture
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="rf-button rf-refresh"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
