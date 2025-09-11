// ReportForm.jsx
import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import jsPDF from "jspdf";
import { Camera, FolderUp } from "lucide-react";
// import { api, getAccessToken } from "../Auth/auth"; // optional for posting

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
  const [userLocation, setUserLocation] = useState({
    city: "",
    district: "",
    state: "",
  });
  const [address, setAddress] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // get geolocation
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

  // init map
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

  // update map and reverse geocode when coords change
  useEffect(() => {
    if (!coords || !leafletMapRef.current) return;
    const map = leafletMapRef.current;

    setTimeout(() => map.invalidateSize(), 100);
    map.setView([coords.lat, coords.lng], 16);

    if (!markerRef.current) {
      markerRef.current = L.marker([coords.lat, coords.lng], { draggable: true }).addTo(map);
      markerRef.current.bindPopup("<b>Report location</b><br/>Drag to correct location.").openPopup();
      markerRef.current.on("dragend", (e) => {
        const latLng = e.target.getLatLng();
        setCoords({ lat: latLng.lat, lng: latLng.lng });
        map.setView(latLng);
      });
    } else {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      markerRef.current.getPopup()?.setContent("<b>Report location</b><br/>Drag to correct location.");
      markerRef.current.openPopup();
    }

    // reverse geocode (Nominatim)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`)
      .then((res) => res.json())
      .then((data) => {
        const city = data.address?.city || data.address?.town || data.address?.village || "";
        const district = data.address?.county || data.address?.state_district || "";
        const state = data.address?.state || "";
        setUserLocation({ city, district, state });
        setAddress(data.display_name || "");
      })
      .catch((err) => {
        console.error("Error reverse geocoding:", err);
        setUserLocation({ city: "", district: "", state: "" });
        setAddress("");
      });
  }, [coords]);

  // file input
  function onFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setImagePreview(null);
      localStorage.removeItem("uploadedImage");
      return;
    }

    setImagePreview(URL.createObjectURL(f));

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("uploadedImage", reader.result);
    };
    reader.readAsDataURL(f);
  }

  // camera handling
  useEffect(() => {
    if (showCamera && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [showCamera]);

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
    } catch (err) {
      console.error("startCamera error:", err);
      setShowCamera(false);
      alert("Camera access denied or not available");
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (e) {}
    }
    setShowCamera(false);
  }

  function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setImagePreview(URL.createObjectURL(blob));
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem("uploadedImage", reader.result);
          };
          reader.readAsDataURL(blob);
          stopCamera();
        }
      },
      "image/jpeg",
      0.85
    );
  }

  // submit -> create PDF (demo)
  function onSubmit(e) {
    e.preventDefault();

    if (!category || !description || !coords) {
      alert("Please fill all required fields before submitting.");
      return;
    }

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    const userFullName = localStorage.getItem("user_full_name");

    const letter = `To,
Municipal Office,
${userLocation.district || ""}, ${userLocation.state || ""}

Subject: Complaint Regarding ${category}

Respected Sir/Madam,

I am writing to formally lodge a complaint regarding the following issue:

${description}

The issue has been observed at the following location:
Latitude: ${coords.lat.toFixed(6)}, Longitude: ${coords.lng.toFixed(6)}

I kindly request your immediate attention and necessary action in resolving this matter.

Yours sincerely,
${userFullName || "Citizen"}
Date: ${today}
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

  return (
    <div className="min-h-screen bg-[#0B2F20] flex flex-col items-center text-white font-sans">
      {/* Header */}
      <div className="w-full bg-[#F4B183] text-[#0B2F20] font-extrabold text-2xl text-center py-5 mt-8">
        FILE A REPORT
      </div>

      <form
        onSubmit={onSubmit}
        className="w-full max-w-4xl p-6 md:p-10 mt-6 bg-transparent"
      >
        {/* Attach image */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-semibold text-[#F4B183] uppercase">
            Attach an image
          </label>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-2 bg-white text-[#0B2F20] font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </button>

            <label className="inline-flex items-center gap-2 bg-white text-[#0B2F20] font-semibold px-4 py-2 rounded-lg cursor-pointer">
              <FolderUp />
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </label>
          </div>

          {imagePreview && (
            <div className="relative mt-3 inline-block">
              <img
                src={imagePreview}
                alt="preview"
                className="max-w-full rounded-md shadow-md"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  localStorage.removeItem("uploadedImage");
                }}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#0B2F20] font-black"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#F4B183] uppercase mb-2">
            Choose Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg p-3 text-[#0B2F20] bg-white"
          >
            <option value="">-- Choose Category --</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#F4B183] uppercase mb-2">
            Describe the issue
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            className="w-full rounded-lg p-3 text-[#0B2F20] bg-white min-h-[110px] resize-y"
            placeholder="Provide details (when seen, severity, etc.)"
          />
          <div className="text-right text-sm text-[#F4B183] mt-1">
            {description.length}/500
          </div>
        </div>

        {/* Location + map */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-sm font-semibold text-[#F4B183] uppercase mb-2">
              Location
            </label>
            <div className="rounded-lg p-4 bg-white text-[#0B2F20]">
              {geoStatus === "loading" && <div>Getting location…</div>}
              {geoStatus === "error" && <div>Location not available</div>}
              {geoStatus === "ready" && coords && (
                <div>
                  <div className="font-semibold mb-1">
                    {address || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`}
                  </div>
                  <div className="text-sm text-gray-700">
                    ({coords.lat.toFixed(6)}, {coords.lng.toFixed(6)})
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <div
                ref={mapRef}
                className="w-full h-56 bg-gray-200"
                aria-label="map showing report location"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white text-[#0B2F20] font-semibold"
          >
            Refresh location
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-[#F4B183] text-[#0B2F20] font-extrabold shadow-md hover:brightness-95 transition"
          >
            Submit Report
          </button>
        </div>
      </form>

      {/* Camera modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-black rounded-lg p-3">
            <video
              ref={videoRef}
              className="w-[90vw] max-w-[720px] h-auto rounded-md"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={takePhoto}
                className="inline-flex items-center gap-2 bg-[#F4B183] text-[#0B2F20] px-4 py-2 rounded-lg font-semibold"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="inline-flex items-center gap-2 bg-white text-[#0B2F20] px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
