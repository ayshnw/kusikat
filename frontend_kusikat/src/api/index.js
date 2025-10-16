const API_URL = "http://127.0.0.1:8000";

export async function getMessage() {
  const res = await fetch(`${API_URL}/`);
  return await res.json();
}
