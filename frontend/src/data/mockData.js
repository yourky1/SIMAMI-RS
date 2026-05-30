export const initialAssets = [
  {
    id: "AST-IGD-001",
    name: "Tabung Oksigen Portable",
    category: "Respiratory Support",
    serialNumber: "OX-PRT-2026-001",
    location: "IGD",
    status: "Tersedia",
    condition: "Baik",
    procurementDate: "2025-07-12",
    unitOwner: "Unit IGD",
    nextMaintenance: "2026-07-12",
    note: "Regulator lengkap, tekanan normal.",
    image: "oxygen",
    priority: "Kritis",
    createdAt: "2026-05-18T08:10:00.000Z",
    updatedAt: "2026-05-18T08:10:00.000Z"
  },
  {
    id: "AST-ICU-014",
    name: "Bedside Monitor",
    category: "Monitoring",
    serialNumber: "BM-ICU-014",
    location: "ICU",
    status: "Dipakai",
    condition: "Baik",
    procurementDate: "2024-03-22",
    unitOwner: "Perawat ICU",
    nextMaintenance: "2026-06-20",
    note: "Sensor dan alarm berfungsi.",
    image: "monitor",
    priority: "Kritis",
    createdAt: "2026-05-18T09:25:00.000Z",
    updatedAt: "2026-05-18T09:25:00.000Z"
  },
  {
    id: "AST-RO-008",
    name: "Defibrillator",
    category: "Emergency Device",
    serialNumber: "DFB-RO-008",
    location: "Ruang Operasi",
    status: "Maintenance",
    condition: "Butuh Kalibrasi",
    procurementDate: "2023-11-09",
    unitOwner: "Teknisi Elektromedis",
    nextMaintenance: "2026-05-18",
    note: "Output energi perlu validasi ulang sebelum digunakan.",
    image: "defib",
    priority: "Sangat Kritis",
    createdAt: "2026-05-17T15:45:00.000Z",
    updatedAt: "2026-05-17T15:45:00.000Z"
  },
  {
    id: "AST-BM-022",
    name: "Kursi Roda Standar",
    category: "Mobility Aid",
    serialNumber: "KR-BM-022",
    location: "Bangsal Mawar",
    status: "Dipinjam",
    condition: "Baik",
    procurementDate: "2025-02-02",
    unitOwner: "Bangsal Mawar",
    nextMaintenance: "2026-08-03",
    note: "Dipinjam untuk pasien observasi.",
    image: "wheelchair",
    priority: "Normal",
    createdAt: "2026-05-18T07:40:00.000Z",
    updatedAt: "2026-05-18T07:40:00.000Z"
  },
  {
    id: "AST-BA-018",
    name: "Infusion Pump",
    category: "Infusion Device",
    serialNumber: "IP-BA-018",
    location: "Bangsal Anak",
    status: "Tersedia",
    condition: "Baik",
    procurementDate: "2025-04-13",
    unitOwner: "Bangsal Anak",
    nextMaintenance: "2026-06-25",
    note: "Akurasi aliran terakhir normal.",
    image: "pump",
    priority: "Kritis",
    createdAt: "2026-05-18T10:05:00.000Z",
    updatedAt: "2026-05-18T10:05:00.000Z"
  },
  {
    id: "AST-GUD-031",
    name: "Nebulizer",
    category: "Respiratory Support",
    serialNumber: "NB-GUD-031",
    location: "Gudang Alat Medis",
    status: "Tersedia",
    condition: "Perlu Cek Ringan",
    procurementDate: "2025-12-08",
    unitOwner: "Admin Aset",
    nextMaintenance: "2026-05-28",
    note: "Selang perlu dicek sebelum distribusi berikutnya.",
    image: "nebulizer",
    priority: "Normal",
    createdAt: "2026-05-16T13:15:00.000Z",
    updatedAt: "2026-05-16T13:15:00.000Z"
  },
  {
    id: "AST-POL-044",
    name: "EKG Portable",
    category: "Diagnostic Device",
    serialNumber: "EKG-POL-044",
    location: "Poli Umum",
    status: "Tersedia",
    condition: "Baik",
    procurementDate: "2025-09-18",
    unitOwner: "Poli Umum",
    nextMaintenance: "2026-07-02",
    note: "Kertas EKG tersedia, baterai normal.",
    image: "ekg",
    priority: "Kritis",
    createdAt: "2026-05-16T11:20:00.000Z",
    updatedAt: "2026-05-16T11:20:00.000Z"
  },
  {
    id: "AST-ICU-052",
    name: "Suction Pump",
    category: "Emergency Device",
    serialNumber: "SCT-ICU-052",
    location: "ICU",
    status: "Tersedia",
    condition: "Baik",
    procurementDate: "2025-10-10",
    unitOwner: "ICU",
    nextMaintenance: "2026-07-30",
    note: "Botol dan selang tersedia.",
    image: "suction",
    priority: "Kritis",
    createdAt: "2026-05-15T09:35:00.000Z",
    updatedAt: "2026-05-15T09:35:00.000Z"
  }
];

export const initialBorrowRequests = [
  {
    id: "BRW-2401",
    assetId: "AST-GUD-031",
    assetName: "Nebulizer",
    borrower: "Siti Aminah",
    borrowerRole: "Petugas Bangsal",
    unit: "Bangsal Mawar",
    fromLocation: "Gudang Alat Medis",
    toLocation: "Bangsal Mawar",
    purpose: "Terapi inhalasi pasien anak dengan keluhan sesak ringan.",
    requestedAt: "2026-05-18T08:30:00.000Z",
    expectedReturn: "2026-05-18",
    status: "Menunggu Persetujuan",
    timeline: [
      { label: "Pengajuan dibuat", time: "18 Mei 2026, 08.30", done: true },
      { label: "Menunggu approval admin", time: "-", done: false },
      { label: "Alat diserahkan", time: "-", done: false },
      { label: "Pengembalian", time: "-", done: false }
    ]
  },
  {
    id: "BRW-2400",
    assetId: "AST-BM-022",
    assetName: "Kursi Roda Standar",
    borrower: "Nur Halimah",
    borrowerRole: "Petugas Bangsal",
    unit: "ICU",
    fromLocation: "IGD",
    toLocation: "Bangsal Mawar",
    purpose: "Mobilisasi pasien observasi dari IGD ke bangsal.",
    requestedAt: "2026-05-18T07:40:00.000Z",
    expectedReturn: "2026-05-19",
    status: "Sedang Dipinjam",
    timeline: [
      { label: "Pengajuan dibuat", time: "18 Mei 2026, 07.40", done: true },
      { label: "Disetujui admin", time: "18 Mei 2026, 07.45", done: true },
      { label: "Alat diserahkan", time: "18 Mei 2026, 07.50", done: true },
      { label: "Pengembalian", time: "-", done: false }
    ]
  },
  {
    id: "BRW-2399",
    assetId: "AST-IGD-001",
    assetName: "Tabung Oksigen Portable",
    borrower: "Rizky Pratama",
    borrowerRole: "Petugas IGD",
    unit: "IGD",
    fromLocation: "Gudang Alat Medis",
    toLocation: "IGD",
    purpose: "Kebutuhan triase pasien masuk.",
    requestedAt: "2026-05-17T21:10:00.000Z",
    expectedReturn: "2026-05-18",
    status: "Selesai",
    timeline: [
      { label: "Pengajuan dibuat", time: "17 Mei 2026, 21.10", done: true },
      { label: "Disetujui admin", time: "17 Mei 2026, 21.14", done: true },
      { label: "Alat diserahkan", time: "17 Mei 2026, 21.20", done: true },
      { label: "Pengembalian", time: "18 Mei 2026, 06.55", done: true }
    ]
  }
];

export const initialMutations = [
  {
    id: "MTS-1021",
    assetId: "AST-BM-022",
    assetName: "Kursi Roda Standar",
    fromLocation: "IGD",
    toLocation: "Bangsal Mawar",
    officer: "Siti Aminah",
    note: "Dipinjam untuk pasien observasi.",
    status: "Belum kembali",
    createdAt: "2026-05-18T07:40:00.000Z"
  },
  {
    id: "MTS-1020",
    assetId: "AST-IGD-001",
    assetName: "Tabung Oksigen Portable",
    fromLocation: "Gudang Alat Medis",
    toLocation: "IGD",
    officer: "Rizky Pratama",
    note: "Disiapkan untuk kebutuhan triase.",
    status: "Selesai",
    createdAt: "2026-05-18T06:55:00.000Z"
  },
  {
    id: "MTS-1019",
    assetId: "AST-ICU-014",
    assetName: "Bedside Monitor",
    fromLocation: "ICU",
    toLocation: "ICU",
    officer: "Nur Halimah",
    note: "Dipakai untuk pasien rawat intensif.",
    status: "Dipakai",
    createdAt: "2026-05-17T21:20:00.000Z"
  }
];

export const initialMaintenances = [
  {
    id: "MTN-204",
    assetId: "AST-RO-008",
    assetName: "Defibrillator",
    technician: "Budi Santoso",
    scheduledDate: "2026-05-18",
    result: "Kalibrasi ulang dan pengujian output energi.",
    status: "Butuh tindak lanjut"
  },
  {
    id: "MTN-203",
    assetId: "AST-ICU-014",
    assetName: "Bedside Monitor",
    technician: "Teknisi Elektromedis B",
    scheduledDate: "2026-06-20",
    result: "Pemeriksaan sensor, baterai, dan alarm.",
    status: "Terjadwal"
  },
  {
    id: "MTN-202",
    assetId: "AST-BA-018",
    assetName: "Infusion Pump",
    technician: "Teknisi Elektromedis A",
    scheduledDate: "2026-06-25",
    result: "Uji akurasi aliran infus.",
    status: "Terjadwal"
  }
];

export const initialUsers = [
  {
    id: "USR-001",
    name: "Akhmad Husni Assidiqi",
    role: "Administrator",
    unit: "Manajemen Aset",
    email: "admin.simami@permata-medika.id",
    status: "Aktif"
  },
  {
    id: "USR-002",
    name: "Siti Aminah",
    role: "Petugas Bangsal",
    unit: "Bangsal Mawar",
    email: "siti@permata-medika.id",
    status: "Aktif"
  },
  {
    id: "USR-003",
    name: "Budi Santoso",
    role: "Teknisi",
    unit: "Elektromedis",
    email: "budi@permata-medika.id",
    status: "Aktif"
  },
  {
    id: "USR-004",
    name: "Nur Halimah",
    role: "Petugas Bangsal",
    unit: "ICU",
    email: "nur@permata-medika.id",
    status: "Aktif"
  }
];

export const locations = [
  "IGD",
  "ICU",
  "Bangsal Mawar",
  "Bangsal Melati",
  "Bangsal Anak",
  "Ruang Operasi",
  "Poli Umum",
  "Gudang Alat Medis"
];

export const categories = [
  "Respiratory Support",
  "Monitoring",
  "Emergency Device",
  "Mobility Aid",
  "Infusion Device",
  "Diagnostic Device"
];
