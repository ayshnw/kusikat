// src/pages/GoogleCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Ambil token dari URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("access_token");

      if (!token) {
        alert("Gagal login dengan Google. Token tidak ditemukan.");
        navigate("/login");
        return;
      }

      try {
        // Simpan token ke localStorage
        localStorage.setItem("access_token", token);

        // Ambil data user dan simpan ke localStorage (opsional tapi disarankan)
        const res = await fetch("http://localhost:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const userData = await res.json();
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // Redirect ke dashboard
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Error during Google callback:", err);
        alert("Terjadi kesalahan saat login Google.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-lg text-gray-700">Memproses login Google...</div>
    </div>
  );
};

export default GoogleCallback;