// App.jsx
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import LoginPage from "./pages/Auth/LoginPage";
import CitizenHome from "./pages/Citizen/CitizenHome";
import AdminHome from "./pages/Admin/AdminHome";
import ViewComplaint from "./pages/Admin/ViewComplaint";
import ReportList from "./pages/Citizen/ReportList";
import Feedback from "./pages/Citizen/Feedback";
import PrivateRoute from "./pages/Auth/Privateroute"
import MyComplaints from "./pages/Citizen/MyComplaints";

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
          path="/complaints"
          element={
            <PrivateRoute>
              <ViewComplaint />
            </PrivateRoute>
          }
        />

        <Route
          path="/officer/complaints/:id"
          element={
            <PrivateRoute>
              <ViewComplaint />
            </PrivateRoute>
          }
        />

        {/* MyComplaints */}
        <Route
          path="/mycomplaints"
          element={
            <PrivateRoute>
              <MyComplaints/>
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

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
