insert into users (name, email, password_hash, role, unit, status) values
('Akhmad Husni Assidiqi', 'admin.simami@permata-medika.id', '$2a$10$2zH2fLQecfPo7Lftv0j2DuLzN3Tt6qNmEvYwB3TCrMqL7ZpE5jZ0a', 'Administrator', 'Manajemen Aset', 'Aktif'),
('Siti Aminah', 'siti@permata-medika.id', '$2a$10$2zH2fLQecfPo7Lftv0j2DuLzN3Tt6qNmEvYwB3TCrMqL7ZpE5jZ0a', 'Petugas Bangsal', 'Bangsal Mawar', 'Aktif'),
('Budi Santoso', 'budi@permata-medika.id', '$2a$10$2zH2fLQecfPo7Lftv0j2DuLzN3Tt6qNmEvYwB3TCrMqL7ZpE5jZ0a', 'Teknisi', 'Elektromedis', 'Aktif')
on conflict (email) do nothing;

insert into assets (id, name, category, serial_number, location, status, condition, procurement_date, unit_owner, next_maintenance, note, image, priority) values
('AST-IGD-001', 'Tabung Oksigen Portable', 'Respiratory Support', 'OX-PRT-2026-001', 'IGD', 'Tersedia', 'Baik', '2025-07-12', 'Unit IGD', '2026-07-12', 'Regulator lengkap, tekanan normal.', 'oxygen', 'Kritis'),
('AST-ICU-014', 'Bedside Monitor', 'Monitoring', 'BM-ICU-014', 'ICU', 'Dipakai', 'Baik', '2024-03-22', 'Perawat ICU', '2026-06-20', 'Sensor dan alarm berfungsi.', 'monitor', 'Kritis'),
('AST-RO-008', 'Defibrillator', 'Emergency Device', 'DFB-RO-008', 'Ruang Operasi', 'Maintenance', 'Butuh Kalibrasi', '2023-11-09', 'Teknisi Elektromedis', '2026-05-18', 'Output energi perlu validasi ulang sebelum digunakan.', 'defib', 'Sangat Kritis'),
('AST-BM-022', 'Kursi Roda Standar', 'Mobility Aid', 'KR-BM-022', 'Bangsal Mawar', 'Dipinjam', 'Baik', '2025-02-02', 'Bangsal Mawar', '2026-08-03', 'Dipinjam untuk pasien observasi.', 'wheelchair', 'Normal'),
('AST-BA-018', 'Infusion Pump', 'Infusion Device', 'IP-BA-018', 'Bangsal Anak', 'Tersedia', 'Baik', '2025-04-13', 'Bangsal Anak', '2026-06-25', 'Akurasi aliran terakhir normal.', 'pump', 'Kritis'),
('AST-GUD-031', 'Nebulizer', 'Respiratory Support', 'NB-GUD-031', 'Gudang Alat Medis', 'Tersedia', 'Perlu Cek Ringan', '2025-12-08', 'Admin Aset', '2026-05-28', 'Selang perlu dicek sebelum distribusi berikutnya.', 'nebulizer', 'Normal'),
('AST-POL-044', 'EKG Portable', 'Diagnostic Device', 'EKG-POL-044', 'Poli Umum', 'Tersedia', 'Baik', '2025-09-18', 'Poli Umum', '2026-07-02', 'Kertas EKG tersedia, baterai normal.', 'ekg', 'Kritis'),
('AST-ICU-052', 'Suction Pump', 'Emergency Device', 'SCT-ICU-052', 'ICU', 'Tersedia', 'Baik', '2025-10-10', 'ICU', '2026-07-30', 'Botol dan selang tersedia.', 'suction', 'Kritis')
on conflict (id) do nothing;

insert into asset_mutations (asset_id, from_location, to_location, officer, note, status) values
('AST-BM-022', 'IGD', 'Bangsal Mawar', 'Siti Aminah', 'Dipinjam untuk pasien observasi.', 'Belum kembali'),
('AST-IGD-001', 'Gudang Alat Medis', 'IGD', 'Rizky Pratama', 'Disiapkan untuk triase.', 'Selesai'),
('AST-ICU-014', 'ICU', 'ICU', 'Nur Halimah', 'Dipakai untuk pasien rawat intensif.', 'Dipakai');

insert into maintenance_records (asset_id, technician, scheduled_date, result, status) values
('AST-RO-008', 'Budi Santoso', '2026-05-18', 'Kalibrasi ulang dan pengujian output energi.', 'Butuh tindak lanjut'),
('AST-ICU-014', 'Teknisi Elektromedis B', '2026-06-20', 'Pemeriksaan sensor, baterai, dan alarm.', 'Terjadwal'),
('AST-BA-018', 'Teknisi Elektromedis A', '2026-06-25', 'Uji akurasi aliran infus.', 'Terjadwal');

insert into borrow_requests (asset_id, borrower, borrower_role, unit, from_location, to_location, purpose, expected_return, status, timeline) values
('AST-GUD-031', 'Siti Aminah', 'Petugas Bangsal', 'Bangsal Mawar', 'Gudang Alat Medis', 'Bangsal Mawar', 'Terapi inhalasi pasien anak dengan keluhan sesak ringan.', '2026-05-18', 'Menunggu Persetujuan', '[{"label":"Pengajuan dibuat","time":"18 Mei 2026, 08.30","done":true},{"label":"Menunggu approval admin","time":"-","done":false},{"label":"Alat diserahkan","time":"-","done":false},{"label":"Pengembalian","time":"-","done":false}]'::jsonb),
('AST-BM-022', 'Nur Halimah', 'Petugas Bangsal', 'ICU', 'IGD', 'Bangsal Mawar', 'Mobilisasi pasien observasi dari IGD ke bangsal.', '2026-05-19', 'Sedang Dipinjam', '[{"label":"Pengajuan dibuat","time":"18 Mei 2026, 07.40","done":true},{"label":"Disetujui admin","time":"18 Mei 2026, 07.45","done":true},{"label":"Alat diserahkan","time":"18 Mei 2026, 07.50","done":true},{"label":"Pengembalian","time":"-","done":false}]'::jsonb);
