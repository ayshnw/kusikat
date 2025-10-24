import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// -----------------------------
// REGISTER USER MANUAL
// -----------------------------
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/api/register`, userData);
  return res.data;
};

// -----------------------------
// LOGIN USER MANUAL
// -----------------------------
export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_URL}/api/login`, credentials);
  return res.data;
};

// -----------------------------
// GOOGLE AUTH LOGIN (jika pakai OAuth Google)
// -----------------------------
export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google/login`;
};

// -----------------------------
// Forgot Password Flow
// -----------------------------
export const sendOTP = async (email) => {
  const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return res.data;
};

export const verifyOTP = async (email, otp) => {
  const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
  return res.data;
};

export const resetPassword = async (email, new_password) => {
  const res = await axios.post(`${API_URL}/auth/reset-password`, { email, new_password });
  return res.data;
};