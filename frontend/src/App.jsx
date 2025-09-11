import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import CitizenHome from "./pages/Citizen/CitizenHome"; 
import PrivateRoute from "./pages/Auth/Privateroute";  

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected route */}
        <Route
          path="/citizenhome"
          element={
            <PrivateRoute>
              <CitizenHome />
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
