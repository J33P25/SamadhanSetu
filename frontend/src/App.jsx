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