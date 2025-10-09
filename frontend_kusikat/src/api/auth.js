import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};
