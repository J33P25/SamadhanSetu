import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    ref_id: "",
    name: "",
    phone: "",
    rectified: "",
    first_reported: "",
    delay: "",
    staff_act: "",
    severity: "",
    frequency: "",
    suggestions: "",
    consent: false,
    evidence: null,
  });
  const ratingRef = useRef(null);
  const formRef = useRef(null);

  const navigate = useNavigate();

  // Keep the hidden rating input in sync (for any non-React consumers)
  useEffect(() => {
    if (ratingRef.current) ratingRef.current.value = rating;
  }, [rating]);

  function handleInputChange(e) {
    const { name, type, value, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData(prev => ({ ...prev, [name]: files }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  function applyRating(v) {
    setRating(v);
  }

  function handleKeyRating(e) {
    // left/right/up/down or numbers
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      setRating(prev => Math.min(5, (prev || 0) + 1));
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      setRating(prev => Math.max(1, (prev || 6) - 1));
      e.preventDefault();
    } else if (/^[1-5]$/.test(e.key)) {
      setRating(Number(e.key));
      e.preventDefault();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Basic validation: rating and consent
    if (!rating) {
      alert("Please provide a satisfaction rating (1–5).");
      ratingRef.current?.focus();
      return;
    }
    if (!formData.consent) {
      alert("Please give consent to be contacted for follow-up (tick the checkbox).");
      formRef.current.querySelector("#consent")?.focus();
      return;
    }

    // Build a FormData object if you want to send files via fetch
    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (!formData[key]) return;
      if (key === "evidence") {
        // append all files
        const files = formData.evidence;
        if (files && files.length) {
          Array.from(files).forEach((file, i) => payload.append(`evidence[]`, file));
        }
      } else {
        payload.append(key, formData[key]);
      }
    });
    payload.append("rating", rating);

    // Example: handle submission with fetch
    // fetch('/feedback', { method: 'POST', body: payload })
    //   .then(r => r.json())
    //   .then(() => alert('Thanks — your feedback was submitted.'))
    //   .catch(() => alert('There was a problem submitting your feedback.'));

    // For this single-file example we'll just log the form content
    console.log("Form submitted:", { ...formData, rating });
    alert("Thanks — your feedback has been recorded (check console for payload in dev mode).\nReplace the console.log with your API call.");

    // reset form (optional)
    setRating(0);
    setHoverRating(0);
    setFormData({
      ref_id: "",
      name: "",
      phone: "",
      rectified: "",
      first_reported: "",
      delay: "",
      staff_act: "",
      severity: "",
      frequency: "",
      suggestions: "",
      consent: false,
      evidence: null,
    });
    formRef.current.reset();
  }

  return (
    <main className="max-w-[920px] mx-auto my-7 p-5">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0b3f35] to-[#053a2b] text-white p-6 rounded-xl shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-lg font-bold m-0">Citizen Feedback</h1>
        </div>
        <p className="m-0 text-sm text-white/95">Please let us know how your reported issue was handled. Your feedback helps improve district services.</p>
      </header>

      <form ref={formRef} id="feedbackForm" onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-md border border-black/6" noValidate>
        {/* Reference */}
        <fieldset className="mb-4 border-0 p-0">
          <legend className="text-[0.98rem] font-semibold text-[#0b3f35] mb-2">Reference</legend>

          <label className="block text-sm mt-2">Issue reference (if available)</label>
          <input name="ref_id" value={formData.ref_id} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-black/8 bg-white text-sm text-[#0f2b23] outline-none focus:shadow-lg focus:translate-y-[-2px] focus:border-[#0b3f35]/60" placeholder="e.g. REF-2025-0001" />

          <label className="block text-sm mt-3">Full name (optional)</label>
          <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-black/8 bg-white text-sm text-[#0f2b23] outline-none focus:shadow-lg focus:translate-y-[-2px] focus:border-[#0b3f35]/60" placeholder="Your full name" />

          <label className="block text-sm mt-3">Phone / WhatsApp (optional)</label>
          <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-black/8 bg-white text-sm text-[#0f2b23] outline-none focus:shadow-lg focus:translate-y-[-2px] focus:border-[#0b3f35]/60" placeholder="+91 98765 XXXXX" />
        </fieldset>

        {/* Outcome */}
        <fieldset className="mb-4 border-0 p-0">
          <legend className="text-[0.98rem] font-semibold text-[#0b3f35] mb-2">Was the issue resolved?</legend>
          <div className=" text-[black] flex flex-wrap gap-3">
            {[
              ["yes", "Yes — fully resolved"],
              ["partial", "Partially resolved"],
              ["no", "No — not resolved"],
            ].map(([val, label]) => (
              <label key={val} className="inline-flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-black/6 cursor-pointer">
                <input type="radio" name="rectified" value={val} checked={formData.rectified === val} onChange={handleInputChange} required className="w-4 h-4 accent-[#0b3f35]" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Time & delay */}
        <fieldset className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-0 p-0">
          <legend className="text-[0.98rem] font-semibold text-[#0b3f35] mb-2 col-span-full">Time taken</legend>
          <div>
            <label className="text-[#0b3f35] block text-sm">Date you first reported the issue</label>
            <input type="date" name="first_reported" value={formData.first_reported} onChange={handleInputChange} className=" w-full px-3 py-2 rounded-lg border border-black/8 bg-white text-sm outline-none focus:shadow-lg focus:translate-y-[-2px] focus:border-[#0b3f35]/60 text-[#0b3f35]" />
          </div>
          <div>
            <label className="text-[#0b3f35] block text-sm">How long did it take to address?</label>
            <div className="text-[#0b3f35] flex flex-wrap gap-3 mt-2">
              {[
                ["none", "No delay"],
                ["<1week", "Less than 1 week"],
                ["1-4weeks", "1–4 weeks"],
                [">1month", "More than 1 month"],
              ].map(([val, label]) => (
                <label key={val} className="inline-flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-black/6 cursor-pointer">
                  <input type="radio" name="delay" value={val} checked={formData.delay === val} onChange={handleInputChange} required className="w-4 h-4 accent-[#0b3f35]" />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Staff action */}
        <fieldset className="mb-4 border-0 p-0">
          <legend className="text-[0.98rem] font-semibold text-[#0b3f35] mb-2">Government action</legend>
          <label className="block text-sm">Did staff visit or take visible action?</label>
          <div className="text-[#0b3f35] flex flex-wrap gap-3 mt-2">
            {[["yes", "Yes"], ["no", "No"], ["unknown", "Not sure"]].map(([val, label]) => (
              <label key={val} className="inline-flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-black/6 cursor-pointer">
                <input type="radio" name="staff_act" value={val} checked={formData.staff_act === val} onChange={handleInputChange} required className="w-4 h-4 accent-[#0b3f35]" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Severity & frequency */}
        <fieldset className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-0 p-0">
          <legend className="text-[0.98rem] font-semibold text-[#0b3f35] mb-2 col-span-full">About the issue</legend>
          <div>
            <label className="block text-sm">Severity of the issue</label>
            <div className="text-[#0b3f35] flex flex-wrap gap-2 mt-2">
              {[["low", "Low"], ["medium", "Medium"], ["high", "High"]].map(([val, label]) => (
                <label key={val} className="inline-flex items-center gap-2 bg-white rounded-md px-2 py-2 border border-black/6 cursor-pointer text-sm">
                  <input type="radio" name="severity" value={val} checked={formData.severity === val} onChange={handleInputChange} required className="w-3.5 h-3.5 accent-[#0b3f35]" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm">Frequency</label>
            <select name="frequency" value={formData.frequency} onChange={handleInputChange} className="w-full px-3 py-2 rounded-lg border border-black/8 bg-white text-sm outline-none focus:shadow-lg focus:translate-y-[-2px] focus:border-[#0b3f35]/60 mt-2">
              <option value="">Select one</option>
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </fieldset>

        {/* Satisfaction (stars) */}
        <fieldset className="mb-4 border-0 p-0">
          <legend className="text-[0.98rem] font-semibold text-[#0b3f35] mb-2">Your satisfaction</legend>
          <label className="text-sm block mb-2">Overall, how satisfied are you?</label>

          <div
            tabIndex={0}
            role="radiogroup"
            aria-label="Satisfaction rating"
            onKeyDown={handleKeyRating}
            ref={ratingRef}
            className="flex gap-2 items-center text-2xl"
          >
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                type="button"
                aria-checked={rating === i}
                aria-label={`${i} star${i > 1 ? "s" : ""}`}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => applyRating(i)}
                className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl transition-transform select-none border border-black/6 bg-white ${
                  (hoverRating || rating) >= i ? "text-[#f5b301] translate-y-[-6px]" : "text-[#d1d1d1]"
                }`}
              >
                ★
              </button>
            ))}
            {/* Hidden input (kept for compatibility) */}
            <input type="hidden" name="rating" value={rating} />
          </div>
        </fieldset>

        {/* Suggestions */}
        <fieldset className="mb-4 border-0 p-0">
          <legend className="text-[0.98rem] font-semibold text-[#0b3f35] mb-2">Suggestions & comments</legend>
          <label className="block text-sm">Anything else you would like to tell us?</label>
          <textarea name="suggestions" value={formData.suggestions} onChange={handleInputChange} rows={5} className="w-full mt-2 px-3 py-2 rounded-lg border border-black/8 bg-white text-sm outline-none focus:shadow-lg focus:translate-y-[-2px] focus:border-[#0b3f35]/60" placeholder="Your suggestions" />
        </fieldset>



        {/* Actions */}
        <div className="flex gap-3 justify-end mt-3 flex-col md:flex-row-reverse md:items-center">
          <button 
          onClick = {() => navigate('/citizenhome')}
          type="submit" className="px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-[#0b3f35] to-[#053a2b] text-white shadow-md">Submit Feedback</button>
          <button type="reset" onClick={() => { setRating(0); setFormData(prev => ({ ...prev, consent: false })); formRef.current.reset(); }} className="px-4 py-2 rounded-lg font-bold border border-black/6 text-[#6b6d72] bg-transparent">Reset</button>
        </div>
      </form>
    </main>
  );
}
