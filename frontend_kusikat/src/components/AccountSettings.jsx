// src/components/AccountSettings.jsx
import React, { useState, useEffect } from 'react';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  // Notification
  const [message, setMessage] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('Token tidak ditemukan');

        const res = await fetch('http://localhost:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Gagal memuat data user');
        const data = await res.json();
        setUser(data);
        setPhone(data.phone_number || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(''), 4000);
  };

  // --- Update Phone ---
  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/user/phone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone_number: phone })
      });

      if (res.ok) {
        showMessage('Nomor telepon berhasil diperbarui!');
        // Opsional: update localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const updatedUser = { ...JSON.parse(userStr), phone_number: phone };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else {
        const err = await res.json();
        showMessage(err.detail || 'Gagal mengubah nomor', true);
      }
    } catch (err) {
      showMessage('Terjadi kesalahan jaringan', true);
    }
  };

  // --- Set Password (untuk akun Google) ---
  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (tempPassword.length < 6) {
      return showMessage('Password minimal 6 karakter', true);
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/user/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_password: tempPassword })
      });

      if (res.ok) {
        showMessage('Password berhasil diatur!');
        setUser(prev => ({ ...prev, has_password: true }));
      } else {
        const err = await res.json();
        showMessage(err.detail || 'Gagal mengatur password', true);
      }
    } catch (err) {
      showMessage('Terjadi kesalahan jaringan', true);
    }
  };

  // --- Change Password ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return showMessage('Password baru dan konfirmasi tidak cocok', true);
    }
    if (newPassword.length < 6) {
      return showMessage('Password minimal 6 karakter', true);
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      });

      if (res.ok) {
        showMessage('Password berhasil diubah!');
        // Kosongkan form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const err = await res.json();
        showMessage(err.detail || 'Gagal mengganti password', true);
      }
    } catch (err) {
      showMessage('Terjadi kesalahan jaringan', true);
    }
  };

  if (loading) return <div className="text-white">Memuat data akun...</div>;
  if (error) return <div className="text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-8">
      {/* Ubah Nomor Telepon */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-white text-xl font-bold mb-4">Nomor Telepon</h3>
        <form onSubmit={handleUpdatePhone} className="space-y-3">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Masukkan nomor telepon"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition"
          >
            Simpan Nomor Telepon
          </button>
        </form>
      </div>

      {/* Atur atau Ganti Password */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-white text-xl font-bold mb-4">
          {user.has_password ? 'Ganti Password' : 'Atur Password'}
        </h3>

        {user.has_password ? (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Password lama"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password baru"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password baru"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition"
            >
              Ganti Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleSetPassword} className="space-y-3">
            <input
              type="password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="Buat password baru"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition"
            >
              Atur Password
            </button>
          </form>
        )}
      </div>

      {/* Notifikasi */}
      {message && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white font-medium shadow-lg ${
            message.isError ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default AccountSettings;