import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Leaf, RefreshCw, Bell, Star } from 'lucide-react';
import logo from "./assets/logo_kusikat.png";

// Fungsi fetch data backend
async function fetchBackendData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/"); // Ganti sesuai endpoint FastAPI
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching backend:", err);
    return {
      message: "Gagal mengambil data",
      stats: { users: "0", rating: "0", savings: "0%" },
      features: [
        { icon: Leaf, title: "Ramah Lingkungan", desc: "Kurangi limbah makanan" },
        { icon: RefreshCw, title: "Hemat Budget", desc: "Tidak ada makanan terbuang" },
        { icon: Bell, title: "Notifikasi Pintar", desc: "Pengingat otomatis" }
      ]
    };
  }
}

export default function KusiKatLanding() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // State untuk data backend
  const [backendMessage, setBackendMessage] = useState("");
  const [stats, setStats] = useState({ users: "0", rating: "0", savings: "0%" });
  const [features, setFeatures] = useState([
    { icon: Leaf, title: "Ramah Lingkungan", desc: "Kurangi limbah makanan" },
    { icon: RefreshCw, title: "Hemat Budget", desc: "Tidak ada makanan terbuang" },
    { icon: Bell, title: "Notifikasi Pintar", desc: "Pengingat otomatis" }
  ]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Ambil data backend
    fetchBackendData().then(data => {
      setBackendMessage(data.message);
      if (data.stats) setStats(data.stats);
      if (data.features) setFeatures(data.features);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleNavigateToRegister = () => navigate('/register');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden relative">

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ top: '10%', left: '10%', transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.2}px) scale(${1 + Math.sin(scrollY * 0.01) * 0.1})`, transition: 'transform 0.3s ease-out' }} />
        <div className="absolute w-96 h-96 bg-teal-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ top: '50%', right: '10%', transform: `translate(${-scrollY * 0.1}px, ${scrollY * 0.3}px) scale(${1 + Math.cos(scrollY * 0.01) * 0.1})`, transition: 'transform 0.3s ease-out', animationDelay: '1s' }} />
        <div className="absolute w-80 h-80 bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ bottom: '10%', left: '50%', transform: `translate(-50%, ${-scrollY * 0.25}px) rotate(${scrollY * 0.1}deg)`, transition: 'transform 0.3s ease-out', animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <nav className={`relative z-50 flex items-center justify-between p-6 md:p-8 bg-white/70 backdrop-blur-xl border-b border-emerald-100 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:rotate-12 transition-all duration-300">
            <img src={logo} alt="KusiKat" className="w-50 h-50 object-contain" />
          </div>
          <span className="text-2xl font-bold text-emerald-800">Kusikat</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95">
          {isMenuOpen ? <X className="w-6 h-6 text-emerald-700" /> : <Menu className="w-6 h-6 text-emerald-700" />}
        </button>
        <button onClick={handleNavigateToRegister} className="hidden md:block px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 font-medium hover:scale-105 active:scale-95">
          Mulai Sekarang
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-24 right-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 z-50 border border-emerald-100" style={{ animation: 'slideDown 0.3s ease-out' }}>
          <button onClick={handleNavigateToRegister} className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
            Mulai Sekarang
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left Content */}
          <div className={`flex-1 space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">✨ Solusi Terbaru</div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">Kusi<span className="text-emerald-600">Kat</span></h1>
            <p className="text-gray-700 text-lg md:text-xl max-w-lg leading-relaxed">
              Solusi pintar untuk menjaga kesegaran makanan di kulkas Anda. 
              <span className="text-emerald-600 font-semibold"> Hemat, praktis, dan ramah lingkungan!</span>
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={handleNavigateToRegister} className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 flex items-center gap-2 font-medium hover:scale-105 active:scale-95">
                Mulai Sekarang <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/80 backdrop-blur text-emerald-700 rounded-full hover:shadow-xl transition-all duration-300 font-medium border-2 border-emerald-200 hover:border-emerald-400 hover:scale-105 active:scale-95">
                Pelajari Lebih
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{stats.users}</div>
                <div className="text-gray-600 text-sm">Pengguna Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{stats.rating}</div>
                <div className="text-gray-600 text-sm flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{stats.savings}</div>
                <div className="text-gray-600 text-sm">Hemat Budget</div>
              </div>
            </div>

            {/* Backend message */}
            <div className="mt-6 text-gray-700 font-medium">
              Pesan dari Backend: <span className="text-emerald-600">{backendMessage}</span>
            </div>
          </div>

          {/* Right Content - Logo */}
          <div className={`flex-1 relative max-w-md transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 border-4 border-emerald-200">
                <div className="relative bg-white rounded-2xl p-8 shadow-inner overflow-hidden group">
                  <img src={logo} alt="KusiKat Logo" className="w-full h-auto rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-teal-500 rounded-full opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={`mt-20 md:mt-32 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Kenapa Pilih <span className="text-emerald-600">KusiKat?</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className={`group bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 ${activeFeature === idx ? 'border-emerald-500 scale-105' : 'border-transparent hover:border-emerald-300 hover:scale-105'}`} onMouseEnter={() => setActiveFeature(idx)}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300 ${activeFeature === idx ? 'scale-110' : ''}`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 25% { transform: translateY(-15px) rotate(1deg); } 50% { transform: translateY(-10px) rotate(-1deg); } 75% { transform: translateY(-20px) rotate(0.5deg); } }
        @keyframes floatParticle { 0%,100% { transform: translate(0,0) scale(1); } 25% { transform: translate(10px,-20px) scale(1.1); } 50% { transform: translate(-5px,-30px) scale(0.9); } 75% { transform: translate(15px,-10px) scale(1.05); } }
      `}</style>
    </div>
  );
}
