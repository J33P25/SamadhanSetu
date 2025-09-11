<<<<<<< HEAD
// App.jsx
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import CitizenHome from './pages/Citizen/CitizenHome'
import AdminHome from './pages/Admin/AdminHome'
import ViewComplaint from "./pages/Admin/ViewComplaint";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/citizen/home" element={<CitizenHome fullName="Karthik" />} />
      <Route path="/officer/home" element={<AdminHome />} />
      <Route path="/officer/complaints/:id" element={<ViewComplaint />} /> 
    </Routes>
  )
}

export default App
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import CitizenHome from "./pages/Citizen/CitizenHome"; 
import PrivateRoute from "./pages/Auth/Privateroute";  
import ReportList from "./pages/Citizen/ReportList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/citizenhome" element={<CitizenHome />} />
        
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
    </Router>
  );
}

export default App;
>>>>>>> c1234bc8626815cb4f1c0348925bb5be1f0f430a
