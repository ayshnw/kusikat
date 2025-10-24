import { useState } from "react";
import { User, Phone, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logo_kusikat.png";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../App";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [otpPopup, setOtpPopup] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [message, setMessage] = useState("");
  const API_BASE = "http://127.0.0.1:8000";

  // Update form field
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // === REGISTER MANUAL ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, phoneNumber } = formData;

    if (!username || !email || !password || !phoneNumber) {
      alert("⚠️ Lengkapi semua data terlebih dahulu!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          phone_number: phoneNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`❌ ${data.detail || data.message || "Gagal mendaftar!"}`);
        return;
      }

      setMessage(data.message || "Pendaftaran berhasil!");

      // OTP (demo)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setOtpPopup(true);

      alert(`📱 Kode OTP dikirim ke WhatsApp: ${phoneNumber}\n\n(Kode demo: ${otp})`);
    } catch (err) {
      console.error("❌ Gagal konek backend:", err);
      alert("❌ Gagal menghubungi server. Pastikan FastAPI aktif.");
    }
  };

  // === VERIFIKASI OTP ===
  const handleVerifyOtp = () => {
    if (otpCode.trim() === generatedOtp) {
      alert("✅ Verifikasi berhasil! Akun Anda telah dibuat.");
      setOtpPopup(false);
      navigate("/login", { replace: true });
    } else {
      alert("❌ Kode OTP salah. Silakan coba lagi.");
    }
  };

  // === REGISTER DENGAN GOOGLE ===
  const handleGoogleSignUp = () => {
    window.location.href = `${API_BASE}/auth/google/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full">
        <div className="grid md:grid-cols-2">
          {/* Left Side */}
          <div className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm p-12 flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 400 600">
                <path d="M50,100 Q100,50 150,100 T250,100" fill="#10b981" opacity="0.3"/>
                <path d="M300,200 Q350,150 400,200 T500,200" fill="#10b981" opacity="0.3"/>
                <circle cx="80" cy="450" r="30" fill="#10b981" opacity="0.2"/>
                <circle cx="320" cy="500" r="40" fill="#10b981" opacity="0.2"/>
              </svg>
            </div>

            <div className="relative z-10 mb-8">
              <img src={logo} alt="KusiKat Logo" className="w-44 h-44 object-contain drop-shadow-lg" />
            </div>

            <h1 className="text-5xl font-bold text-gray-800 mb-2 relative z-10 text-center">
              ResQ<br />
              <span className="text-5xl">Freeze</span>
            </h1>
          </div>

          {/* Right Side - Form */}
          <div className="p-12 flex flex-col justify-center bg-white/70 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">User Sign Up</h2>

            <div className="space-y-6">
              {/* Username */}
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                  <User size={20} className="text-gray-600" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-6 py-4 pl-16 bg-gray-100 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-400 transition-colors placeholder-gray-500"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                  <Mail size={20} className="text-gray-600" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 pl-16 bg-gray-100 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-400 transition-colors placeholder-gray-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                  <Lock size={20} className="text-gray-600" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 pl-16 bg-gray-100 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-400 transition-colors placeholder-gray-500"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full p-2">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-6 py-4 pl-16 bg-gray-100 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-400 transition-colors placeholder-gray-500"
                />
              </div>

              {/* Google Sign Up */}
              <button
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-full hover:bg-gray-100 transition-all"
              >
                <FcGoogle size={24} />
                <span className="font-medium text-gray-700">Sign Up with Google</span>
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-center text-sm text-gray-500 mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold py-4 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-lg uppercase tracking-wide"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Popup */}
      {otpPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Verifikasi OTP</h2>
            <p className="text-gray-600 text-sm">
              Masukkan kode OTP yang dikirim ke WhatsApp:{" "}
              <span className="font-semibold">{formData.phoneNumber}</span>
            </p>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
              className="w-full border-2 border-gray-300 rounded-full py-3 px-5 text-center text-lg tracking-widest focus:border-blue-400 outline-none"
              placeholder="______"
            />
            <div className="flex gap-3">
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold transition-all"
              >
                Verifikasi
              </button>
              <button
                onClick={() => setOtpPopup(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-full font-semibold transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
