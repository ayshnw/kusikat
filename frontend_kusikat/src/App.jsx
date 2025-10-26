import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./landing";  
import Register from "./components/register";
import Login from "./components/login"; 
import Dashboard from "./components/dashboard";
import Food from "./components/food";
import { useEffect, useState } from "react";
import { getMessage } from "./api";
import GoogleSuccess from "./pages/GoogleSuccess";
import GoogleCallback from "./pages/GoogleCallback";
import ProtectedRoute from "./components/ProtectedRoute";

// URL API backend FastAPI
export const API_BASE_URL = "http://127.0.0.1:8000";

export default function App() {
  const [data, setData] = useState("");

  // Saat komponen App pertama kali dijalankan, ambil data dari backend
  useEffect(() => {
    getMessage().then((res) => setData(res.message));
  }, []);

  return (
<Router>
  <Routes>
    <Route path="/" element={<Landing />} />       
    <Route path="/register" element={<Register />} />  
    <Route path="/login" element={<Login />} />
    <Route path="/google-success" element={<GoogleSuccess />} />    
    <Route path="/auth/callback" element={<GoogleCallback />} />
    
    {/* Dashboard dilindungi */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />  

    {/* Food juga dilindungi (opsional, sesuai kebutuhan) */}
    <Route 
      path="/food" 
      element={
        <ProtectedRoute>
          <Food />
        </ProtectedRoute>
      } 
    />  
  </Routes>
</Router>
  );
}