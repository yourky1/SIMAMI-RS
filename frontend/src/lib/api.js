const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("simami_token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  // Token tidak valid / expired → hapus dan paksa login ulang
  if (response.status === 401) {
    localStorage.removeItem("simami_token");
    localStorage.removeItem("simami_user");
    window.location.href = "/login";
    return;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Terjadi kesalahan saat menghubungi server.");
  }

  return payload;
}

