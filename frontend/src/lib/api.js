const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("simami_token");

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch (error) {
    throw new Error(
      "Tidak dapat terhubung ke backend. Periksa URL API Netlify dan pengaturan CORS Vercel."
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem("simami_token");
    localStorage.removeItem("simami_user");

    if (path !== "/auth/login") {
      window.location.href = "/login";
    }

    throw new Error(payload.message || "Email atau password salah.");
  }

  if (!response.ok) {
    throw new Error(
      payload.message || "Terjadi kesalahan saat menghubungi server."
    );
  }

  return payload;
}
