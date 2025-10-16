import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./landing";  
import Register from "./components/register";
import Login from "./components/login"; 
import Dashboard from "./components/dashboard";
import Food from "./components/food";
import { useEffect, useState } from "react";
import { getMessage } from "./api";

// URL API backend FastAPI
export const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function App() {
  const [data, setData] = useState("");

  // Saat komponen App pertama kali dijalankan, ambil data dari backend
  useEffect(() => {
    getMessage().then((res) => setData(res.message));
  }, []);

  return (
    <Router>
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">Frontend & Backend Connected!</h1>
        <p className="mt-2 text-gray-600">{data}</p>
      </div>

      <Routes>
        <Route path="/" element={<Landing />} />       
        <Route path="/register" element={<Register />} />  
        <Route path="/login" element={<Login />} />    
        <Route path="/dashboard" element={<Dashboard />} />  
        <Route path="/food" element={<Food />} />  
      </Routes>
    </Router>
  );
}
