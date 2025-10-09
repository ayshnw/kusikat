import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Leaf } from 'lucide-react';
import Sidebar from "../assets/sidebar";
import Header from "../assets/navbar";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState('home');
  const [animateCards, setAnimateCards] = useState(false);

  const [chartData, setChartData] = useState([
    { time: '07:00', suhu: 3, kelembapan: 75 },
    { time: '08:00', suhu: 4, kelembapan: 73 },
    { time: '09:00', suhu: 5, kelembapan: 70 },
    { time: '10:00', suhu: 4, kelembapan: 72 },
    { time: '11:00', suhu: 3, kelembapan: 74 },
    { time: '12:00', suhu: 3, kelembapan: 76 },
    { time: '13:00', suhu: 4, kelembapan: 73 },
    { time: '14:00', suhu: 5, kelembapan: 72 },
    { time: '15:00', suhu: 4, kelembapan: 74 },
    { time: '16:00', suhu: 3, kelembapan: 75 },
    { time: '17:00', suhu: 3, kelembapan: 73 },
    { time: '18:00', suhu: 4, kelembapan: 72 }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setTimeout(() => setAnimateCards(true), 100);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => 'Selamat Datang';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
      />

      {/* Overlay untuk mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} currentTime={currentTime} />

        {/* Dashboard Content */}
        <div className="p-4 md:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
               style={{
                 background: 'linear-gradient(135deg, rgba(25, 43, 13, 0.85), rgba(45, 74, 24, 0.75))',
                 backdropFilter: 'blur(20px)',
                 animation: 'fadeInUp 0.8s ease-out'
               }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-white bg-opacity-15 backdrop-blur-md rounded-2xl flex items-center justify-center animate-bounce-slow shadow-lg">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-white text-3xl md:text-4xl font-bold">
                    {getGreeting()}, BgToga
                  </h2>
                  <p className="text-green-100 mt-1 text-sm">Sistem monitoring berjalan dengan baik</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - mobile slide */}
          <div className="flex gap-4 md:grid md:grid-cols-3 md:gap-6 overflow-x-auto px-2 md:px-0">
            {/* Suhu Card */}
            <div className={`min-w-[250px] rounded-2xl p-6 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                 style={{ backgroundColor: '#2d4a18', transitionDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-15 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                  <Thermometer className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-white bg-opacity-15 backdrop-blur-md rounded-full">
                  <span className="text-white text-xs font-medium">Live</span>
                </div>
              </div>
              <h3 className="text-green-200 text-sm font-medium mb-2">Suhu</h3>
              <p className="text-white text-4xl font-bold">3°C</p>
            </div>

            {/* Kelembapan Card */}
            <div className={`min-w-[250px] rounded-2xl p-6 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                 style={{ backgroundColor: '#2d4a18', transitionDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-15 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-white bg-opacity-15 backdrop-blur-md rounded-full">
                  <span className="text-white text-xs font-medium">Live</span>
                </div>
              </div>
              <h3 className="text-green-200 text-sm font-medium mb-2">Kelembapan</h3>
              <p className="text-white text-4xl font-bold">75 %RH</p>
            </div>

            {/* Jumlah Sayur Card */}
            <div className={`min-w-[250px] rounded-2xl p-6 shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                 style={{ backgroundColor: '#2d4a18', transitionDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-15 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-white bg-opacity-15 backdrop-blur-md rounded-full">
                  <span className="text-white text-xs font-medium">Stock</span>
                </div>
              </div>
              <h3 className="text-green-200 text-sm font-medium mb-2">Jumlah sayur</h3>
              <p className="text-white text-4xl font-bold">3</p>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200"
               style={{ backgroundColor: '#5a7052', animation: 'fadeInUp 1s ease-out 0.4s both' }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h3 className="text-white text-xl md:text-2xl font-bold">Grafik Suhu & Kelembapan</h3>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-white bg-opacity-15 backdrop-blur-md rounded-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#ec9bb6' }} />
                  <span className="text-white text-sm font-medium">Suhu</span>
                </div>
                <div className="px-4 py-2 bg-white bg-opacity-15 backdrop-blur-md rounded-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#93c5fd' }} />
                  <span className="text-white text-sm font-medium">Kelembapan</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-inner">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSuhu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec9bb6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#ec9bb6" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorKelembapan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: '#6b7280' }} style={{ fontSize: '11px' }} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" tick={{ fill: '#6b7280' }} style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="suhu" stroke="#ec9bb6" strokeWidth={2.5} fill="url(#colorSuhu)" />
                  <Area type="monotone" dataKey="kelembapan" stroke="#93c5fd" strokeWidth={2.5} fill="url(#colorKelembapan)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce-slow { 0%,100%{transform:translateY(-5%);} 50%{transform:translateY(0);} }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;
