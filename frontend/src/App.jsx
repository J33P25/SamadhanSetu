// App.jsx
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import LoginPage from "./pages/Auth/LoginPage";
import CitizenHome from "./pages/Citizen/CitizenHome";
import AdminHome from "./pages/Admin/AdminHome";
import ViewComplaint from "./pages/Admin/ViewComplaint";
import ReportList from "./pages/Citizen/ReportList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/citizenhome" element={<CitizenHome />} />
      <Route path="/officehome" element={<AdminHome />} />
      <Route path="/complaints" element={<ViewComplaint />} />
      <Route path="/report" element={<ReportList />} />

      {/* Default redirect */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
