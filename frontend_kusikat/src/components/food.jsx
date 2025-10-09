import React, { useState, useEffect } from "react";
import { ChevronRight, X, Thermometer, Droplets, Clock, ChefHat, Calendar } from "lucide-react";
import Sidebar from "../assets/sidebar";
import Navbar from "../assets/navbar";

const VegetableImage = ({ name }) => (
  <img
    src={`/assets/vegetables/${name.toLowerCase()}.png`}
    alt={name}
    className="w-12 h-12 rounded-full object-cover"
    onError={(e) => (e.target.src = "/api/placeholder/48/48")}
  />
);

function App() {
  const [activeMenu, setActiveMenu] = useState("food");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading animation when component mounts
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const vegetables = [
    { 
      id: 1, 
      name: "Bayam", 
      category: "Segar",
      temperature: "4°C",
      humidity: "85%",
      daysUntilSpoil: 5,
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      recipes: [
        "Tumis Bayam dengan Bawang Putih",
        "Sayur Bening Bayam",
        "Smoothie Bayam untuk Kesehatan",
        "Bayam Jagung Segar",
        "Pecel Bayam Tradisional"
      ]
    },
    { 
      id: 2, 
      name: "Sawi", 
      category: "Busuk",
      temperature: "8°C",
      humidity: "60%",
      daysUntilSpoil: 0,
      expiryDate: "Sudah Kadaluarsa",
      recipes: [
        "Segera buang - tidak layak konsumsi",
        "Bisa dijadikan kompos untuk tanaman"
      ]
    },
    { 
      id: 3, 
      name: "Tomat", 
      category: "Hampir Busuk",
      temperature: "12°C",
      humidity: "75%",
      daysUntilSpoil: 2,
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      recipes: [
        "Saus Tomat untuk Pasta",
        "Sup Tomat Hangat",
        "Sambal Tomat Mentah",
        "Tumis Tomat untuk Lauk",
        "Jus Tomat Segar",
        "Tomat Balado Pedas"
      ]
    },
    { 
      id: 4, 
      name: "Kangkung", 
      category: "Segar",
      temperature: "5°C",
      humidity: "90%",
      daysUntilSpoil: 4,
      expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      recipes: [
        "Cah Kangkung Bawang Putih",
        "Plecing Kangkung",
        "Kangkung Belacan"
      ]
    },
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case "Segar":
        return "text-green-600";
      case "Hampir Busuk":
        return "text-orange-500";
      case "Busuk":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  const getCategoryBgColor = (category) => {
    switch (category) {
      case "Segar":
        return "bg-green-100";
      case "Hampir Busuk":
        return "bg-orange-100";
      case "Busuk":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusMessage = (category, days) => {
    if (category === "Busuk") {
      return "Sudah busuk - segera buang";
    } else if (category === "Hampir Busuk") {
      return `${days} hari lagi akan busuk`;
    } else {
      return `Masih segar, ${days} hari lagi akan busuk`;
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedVegetable(null);
      setIsClosing(false);
    }, 300);
  };

  const currentTime = new Date();

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ backgroundColor: 'rgba(25, 176, 13, 0.3)' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: 'rgba(25, 176, 13, 0.25)' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" style={{ backgroundColor: 'rgba(25, 176, 13, 0.35)' }}></div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #192B0D 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Navbar */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          currentTime={currentTime}
        />

        {/* Content Area */}
        <div className="flex-1 px-8 py-6 overflow-auto">
          {/* Header with animation */}
          <div className={`text-white text-center py-4 rounded-2xl mb-6 mx-auto w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%] shadow-2xl transform transition-all duration-700 ${
            isLoading ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'
          }`} style={{ background: 'linear-gradient(to right, #192B0D, #1a3010)' }}>
            <h2 className="text-xl font-bold tracking-wider">🥬 SAYURAN 🥬</h2>
            <p className="text-xs mt-1 opacity-80">Pantau kesegaran sayuran Anda</p>
          </div>

          {/* Daftar Sayuran with staggered animation */}
          <div className="space-y-4 mx-auto w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%]">
            {vegetables.map((vegetable, index) => (
              <div
                key={vegetable.id}
                onClick={() => setSelectedVegetable(vegetable)}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer border-2 hover:border-opacity-100 transform ${
                  isLoading ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  borderColor: 'rgba(25, 176, 13, 0.2)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(25, 176, 13, 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(25, 176, 13, 0.2)'}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(25, 176, 13, 0.15), rgba(25, 176, 13, 0.3))' }}>
                    <VegetableImage name={vegetable.name} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{vegetable.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getCategoryBgColor(vegetable.category)} ${getCategoryColor(vegetable.category)}`}>
                        {vegetable.category}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{vegetable.daysUntilSpoil} hari</span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" style={{ color: '#192B0D' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pop-up Modal with Animation - FIXED SCROLL ISSUE */}
      {selectedVegetable && (
        <div 
          className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-all duration-300 ${
            isClosing ? 'bg-opacity-0' : 'bg-opacity-60'
          }`}
          onClick={handleCloseModal}
        >
          <div 
            className={`backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col transition-all duration-300 transform border-2 ${
              isClosing ? 'scale-90 opacity-0 -translate-y-4' : 'scale-100 opacity-100 translate-y-0'
            }`}
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(25, 176, 13, 0.08), rgba(255,255,255,0.95))',
              borderColor: 'rgba(25, 176, 13, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Pop-up with Gradient - STICKY FIXED */}
            <div className="text-white p-5 rounded-t-3xl flex items-center justify-between shadow-lg flex-shrink-0" style={{ background: 'linear-gradient(to right, #192B0D, #1a3010, #192B0D)' }}>
              <h3 className="text-xl font-bold">📋 Detail Sayuran</h3>
              <button
                onClick={handleCloseModal}
                className="hover:bg-white/20 rounded-full p-1.5 transition-all duration-200 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Pop-up - SCROLLABLE CONTAINER */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Foto dan Info Dasar with Animation */}
              <div className="flex items-start gap-4 mb-6 animate-fadeIn">
                <div className="w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xl animate-scaleIn border-2 border-white" style={{ background: 'linear-gradient(135deg, rgba(25, 176, 13, 0.2), rgba(25, 176, 13, 0.4))' }}>
                  <img
                    src={`/assets/vegetables/${selectedVegetable.name.toLowerCase()}.png`}
                    alt={selectedVegetable.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/api/placeholder/112/112")}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-2xl text-gray-900 mb-2">{selectedVegetable.name}</h4>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-md ${getCategoryBgColor(selectedVegetable.category)} ${getCategoryColor(selectedVegetable.category)}`}>
                    {selectedVegetable.category}
                  </div>
                </div>
              </div>

              {/* Kondisi Sayuran with Staggered Animation */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideInLeft border border-blue-200">
                  <Thermometer className="w-7 h-7 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1 font-medium">Suhu</p>
                    <p className="font-bold text-lg text-gray-900">{selectedVegetable.temperature}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideInRight border border-cyan-200" style={{ animationDelay: '0.1s' }}>
                  <Droplets className="w-7 h-7 text-cyan-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1 font-medium">Kelembaban</p>
                    <p className="font-bold text-lg text-gray-900">{selectedVegetable.humidity}</p>
                  </div>
                </div>
              </div>

              {/* Status Waktu with Pulse Animation */}
              <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 shadow-md animate-fadeIn border-2 ${getCategoryBgColor(selectedVegetable.category)}`} style={{ animationDelay: '0.2s' }}>
                <Clock className={`w-7 h-7 ${getCategoryColor(selectedVegetable.category)} flex-shrink-0 animate-pulse`} />
                <div className="flex-1">
                  <p className={`text-sm font-bold ${getCategoryColor(selectedVegetable.category)}`}>
                    {getStatusMessage(selectedVegetable.category, selectedVegetable.daysUntilSpoil)}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Daya tahan: {selectedVegetable.daysUntilSpoil} hari
                  </p>
                </div>
              </div>

              {/* Tanggal Kadaluarsa */}
              <div className="flex items-center gap-3 p-4 rounded-xl mb-6 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 animate-fadeIn" style={{ animationDelay: '0.25s' }}>
                <Calendar className="w-7 h-7 text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium mb-0.5">
                    {selectedVegetable.category === "Busuk" ? "Status" : "Perkiraan Busuk"}
                  </p>
                  <p className="font-bold text-purple-900">{selectedVegetable.expiryDate}</p>
                </div>
              </div>

              {/* Rekomendasi Olahan Masakan with Gradient Background */}
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-5 rounded-2xl border-2 border-amber-300 shadow-lg animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl shadow-md">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="font-bold text-gray-900 text-xl">Rekomendasi Olahan</h5>
                </div>
                {selectedVegetable.category === "Busuk" ? (
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-300 shadow-md">
                    {selectedVegetable.recipes.map((recipe, index) => (
                      <p key={index} className="text-sm text-red-700 font-semibold mb-1 last:mb-0">
                        • {recipe}
                      </p>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mb-4 font-medium bg-white/70 p-3 rounded-lg border border-amber-200">
                      {selectedVegetable.category === "Hampir Busuk" 
                        ? "⚠️ Segera olah sebelum busuk untuk menghindari limbah makanan:"
                        : "✨ Ide masakan untuk sayuran segar:"}
                    </p>
                    <ul className="space-y-3">
                      {selectedVegetable.recipes.map((recipe, index) => (
                        <li 
                          key={index} 
                          className="bg-white/90 p-3.5 rounded-xl shadow-md border-2 border-amber-200 flex items-start hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-slideUp backdrop-blur-sm"
                          style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                        >
                          <span className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold mr-3 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-md">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-800 font-medium">{recipe}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;