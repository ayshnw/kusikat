import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./landing";  
import Register from "./components/register";
import Login from "./components/login"; 
import Dashboard from "./components/dashboard";
import Food from "./components/food";


export const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function App() {
  return (
    <Router>
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