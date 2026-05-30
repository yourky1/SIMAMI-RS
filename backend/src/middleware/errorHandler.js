export function notFound(req, res) {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Terjadi kesalahan server."
  });
}
