// App.jsx
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import LoginPage from "./pages/Auth/LoginPage";
import CitizenHome from "./pages/Citizen/CitizenHome";
import AdminHome from "./pages/Admin/AdminHome";
import ViewComplaint from "./pages/Admin/ViewComplaint";
import PrivateRoute from "./pages/Auth/Privateroute";
import ReportList from "./pages/Citizen/ReportList";
import Feedback from "./pages/Citizen/Feedback";
function App() {
  return (
    <Routes>     
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/citizenhome"
        element={
          <PrivateRoute>
            <CitizenHome />
          </PrivateRoute>
        }
      />

       <Route
        path="/officehome"
        element={
          <PrivateRoute>
            <AdminHome />
          </PrivateRoute>
        }
      />
       <Route
        path="/complaints"
        element={
          <PrivateRoute>
            <ViewComplaint />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/report"
        element={
          <PrivateRoute>
            <ReportList />
          </PrivateRoute>
        }
      />
         <Route
        path="/Feedback"
        element={
          <PrivateRoute>
            <Feedback />
          </PrivateRoute>
        }
      />

      

      {/* Default redirect */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
