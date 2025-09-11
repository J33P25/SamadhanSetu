// App.jsx
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import LoginPage from "./pages/Auth/LoginPage";
import CitizenHome from "./pages/Citizen/CitizenHome";
import AdminHome from "./pages/Admin/AdminHome";
import ViewComplaint from "./pages/Admin/ViewComplaint";
import PrivateRoute from "./pages/Auth/Privateroute";
import ReportList from "./pages/Citizen/ReportList";

function App() {
  return (
    <Routes>      
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/citizen/home" element={<CitizenHome fullName="Karthik" />} />
      <Route path="/officer/home" element={<AdminHome />} />
      <Route path="/officer/complaints/:id" element={<ViewComplaint />} />
      <Route
        path="/report"
        element={
          <PrivateRoute>
            <ReportList />
          </PrivateRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
