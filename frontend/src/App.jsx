// App.jsx
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import LoginPage from "./pages/Auth/LoginPage";
import CitizenHome from "./pages/Citizen/CitizenHome";
import AdminHome from "./pages/Admin/AdminHome";
import Admincomplaint from "./pages/Admin/ViewComplaint";
import Citizencomplaint from "./pages/Citizen/MyComplaint"
import PrivateRoute from "./pages/Auth/Privateroute";
import ReportList from "./pages/Citizen/ReportList";
import Feedback from "./pages/Citizen/Feedback";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Citizen */}
        <Route
          path="/citizenhome"
          element={
            <PrivateRoute>
              <CitizenHome />
            </PrivateRoute>
          }
        />

                <Route
          path="/citizencomplaint"
          element={
            <PrivateRoute>
              <Citizencomplaint />
            </PrivateRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportList />
            </PrivateRoute>
          }
        />

        {/* Feedback */}
        <Route
          path="/feedback"
          element={
            <PrivateRoute>
              <Feedback />
            </PrivateRoute>
          }
        />

        {/* Admin / Office */}
        <Route
          path="/officehome"
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminhome"
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          }
        />

        {/* Complaints */}
        <Route
          path="/admincomplaints/:id"
          element={
            <PrivateRoute>
              <Admincomplaint />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
