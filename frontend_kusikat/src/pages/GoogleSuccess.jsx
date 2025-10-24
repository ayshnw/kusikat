// src/pages/GoogleSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      console.error("❌ Token tidak ditemukan di URL");
      navigate("/", { replace: true });
      return;
    }

    const fetchUserData = async () => {
      try {
        // Simpan token
        localStorage.setItem("auth_token", token);

        // Ambil data user lengkap dari backend
        const res = await fetch("http://127.0.0.1:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || `HTTP ${res.status}`);
        }

        const userData = await res.json();

        // Simpan ke localStorage
        localStorage.setItem("user", JSON.stringify({
          id: userData.id,
          email: userData.email,
          username: userData.username, // 👈 Ini nama asli dari DB
        }));

        console.log("✅ Login sukses, redirect ke dashboard");
        navigate("/dashboard", { replace: true });

      } catch (error) {
        console.error("❌ Gagal proses login:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <p className="text-lg font-semibold text-gray-700">
        Login Google berhasil... mengarahkan ke dashboard
      </p>
    </div>
  );
}