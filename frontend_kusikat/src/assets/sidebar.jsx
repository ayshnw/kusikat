import React from "react";
import { Home, Package } from "lucide-react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import logo from "../assets/logo_kusikat.png";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate(); // hook navigate

  const menuItems = [
    { id: "home", icon: Home, label: "Home", path: "/dashboard" },
    { id: "food", icon: Package, label: "Food", path: "/food" },
  ];

  return (
    <>
      <div
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-64 shadow-2xl`}
        style={{ backgroundColor: "#192B0D" }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 animate-fade-in">
            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <img src={logo} alt="Logo Kusikat" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">ResQ</h1>
              <p className="text-white text-xl font-bold">Freeze</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsSidebarOpen(false);
                  navigate(item.path); // navigasi ke path
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeMenu === item.id
                    ? "bg-white text-green-900 shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay untuk mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
