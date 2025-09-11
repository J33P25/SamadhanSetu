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
