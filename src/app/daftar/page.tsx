"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function DaftarUMKMPage() {
  const [submitted, setSubmitted] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [loadingGps, setLoadingGps] = useState(false);
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

  const [formData, setFormData] = useState({
    nama: "",
    kategori: "Kuliner",
    pemilik: "",
    kontak: "",
    dusun: "Krajan",
    rtRw: "",
    deskripsi: "",
    nib: "Tidak",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetGps = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setLoadingGps(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6)),
          });
          setGpsDetected(true);
          setLoadingGps(false);
        },
        (error) => {
          alert("Gagal mendeteksi lokasi GPS. Pastikan izin lokasi di browser Anda aktif.");
          setLoadingGps(false);
        }
      );
    } else {
      alert("Browser Anda tidak mendukung deteksi lokasi GPS.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* BANNER HEADER */}
      <div className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={`container ${styles.headerContent}`}>
          <span className={styles.badge}>Formulir Pendaftaran Publik</span>
          <h1 className={styles.title}>Pendaftaran UMKM Desa Winong</h1>
          <p className={styles.subtitle}>
            Daftarkan unit usaha Anda secara gratis tanpa perlu membuat akun. Data Anda akan diverifikasi oleh Perangkat Desa Winong sebelum diterbitkan.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: "800px" }}>
          {submitted ? (
            <div className={`organic-shadow ${styles.successCard}`}>
              <span className={`material-symbols-outlined ${styles.successIcon}`}>
                verified_user
              </span>
              <h2 className={styles.successTitle}>Pendaftaran Berhasil Dikirim!</h2>
              <p className={styles.successDesc}>
                Terima kasih <strong>{formData.pemilik}</strong>! Pendaftaran usaha{" "}
                <strong>"{formData.nama}"</strong> telah masuk ke antrean verifikasi dengan status{" "}
                <span style={{ color: "#B45309", fontWeight: "700" }}>"Pending Verifikasi"</span>. Tim Perangkat Desa Winong akan memverifikasi keaslian usaha Anda sebelum menerbitkannya di Katalog Publik.
              </p>

              {gpsDetected && coords.lat !== null && (
                <div style={{ backgroundColor: "rgba(21, 66, 18, 0.08)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.9rem", color: "#154212" }}>
                  📍 <strong>Koordinat Presisi GPS Terrekam:</strong> {coords.lat}, {coords.lng}
                </div>
              )}

              <div className={styles.successActions}>
                <Link href="/umkm" className="btn btn-primary btn-pill">
                  Lihat Katalog UMKM
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setGpsDetected(false);
                  }}
                  className="btn btn-outline btn-pill"
                >
                  Daftarkan Usaha Lain
                </button>
              </div>
            </div>
          ) : (
            <div className={`organic-shadow ${styles.formCard}`}>
              <div className={styles.formCardHeader}>
                <h2>Formulir Pendaftaran Unit Usaha Baru</h2>
                <p>Isi profil usaha Anda. Pendaftaran ini <strong>bebas tanpa perlu login</strong>.</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Section 1: Profil Usaha */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <span className="material-symbols-outlined">storefront</span> 1. Profil Usaha
                  </h3>

                  <div className={styles.formGroup}>
                    <label>Nama Usaha / UMKM *</label>
                    <input
                      type="text"
                      name="nama"
                      required
                      placeholder="Contoh: Keripik Tempe Mak E"
                      value={formData.nama}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Kategori Usaha *</label>
                      <select
                        name="kategori"
                        value={formData.kategori}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="Kuliner">Kuliner (Makanan & Minuman)</option>
                        <option value="Kerajinan">Kerajinan Tangan & Seni</option>
                        <option value="Fashion">Fashion, Batik & Tenun</option>
                        <option value="Pertanian">Pertanian & Hasil Bumi</option>
                        <option value="Jasa">Jasa & Servis</option>
                        <option value="Perdagangan">Toko & Perdagangan</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Nama Pemilik / Pengelola *</label>
                      <input
                        type="text"
                        name="pemilik"
                        required
                        placeholder="Contoh: Bu Siti Aminah"
                        value={formData.pemilik}
                        onChange={handleChange}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Apakah Memiliki NIB (Legalitas)? *</label>
                      <select
                        name="nib"
                        value={formData.nib}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="Ada">Ada (Sudah Memiliki NIB)</option>
                        <option value="Tidak">Tidak / Belum Ada</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Nomor WhatsApp Aktif *</label>
                      <input
                        type="tel"
                        name="kontak"
                        required
                        placeholder="Contoh: 081234567890"
                        value={formData.kontak}
                        onChange={handleChange}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Deskripsi Usaha & Produk *</label>
                    <textarea
                      name="deskripsi"
                      rows={4}
                      required
                      placeholder="Jelaskan secara singkat keunggulan produk atau keunikan usaha Anda..."
                      value={formData.deskripsi}
                      onChange={handleChange}
                      className={styles.textarea}
                    ></textarea>
                  </div>
                </div>

                {/* Section 2: Alamat & Penandaan GPS */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <span className="material-symbols-outlined">location_on</span> 2. Alamat & Penandaan Lokasi GPS
                  </h3>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Dusun *</label>
                      <select
                        name="dusun"
                        value={formData.dusun}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="Krajan">Dusun Krajan</option>
                        <option value="Sukamaju">Dusun Sukamaju</option>
                        <option value="Puncak">Dusun Puncak</option>
                        <option value="Griya">Dusun Griya</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>RT / RW & Detail Alamat *</label>
                      <input
                        type="text"
                        name="rtRw"
                        required
                        placeholder="Contoh: RT 02 / RW 01, Jalan Mawar No. 12"
                        value={formData.rtRw}
                        onChange={handleChange}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  {/* FEATURE: AUTOMATIC GPS GEOLOCATION DETECTOR BUTTON */}
                  <div className={styles.gpsContainer} style={{ background: "var(--surface-container-low)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div>
                        <strong style={{ fontSize: "0.9rem", color: "var(--primary)" }}>📍 Penandaan Koordinat Presisi (Opsional)</strong>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Klik tombol saat Anda sedang berada di rumah/toko usaha agar titik Google Maps 100% tepat di lokasi Anda.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGetGps}
                        disabled={loadingGps}
                        className="btn btn-outline"
                        style={{ fontSize: "0.8rem", padding: "0.5rem 1rem", flexShrink: 0 }}
                      >
                        {loadingGps ? "Mendeteksi GPS..." : "📍 Ambil Lokasi Saya (GPS HP)"}
                      </button>
                    </div>

                    {gpsDetected && coords.lat !== null && (
                      <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #22C55E", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", color: "#166534", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="material-symbols-outlined">check_circle</span>
                        Koordinat GPS Berhasil Dikunci: Latitude {coords.lat}, Longitude {coords.lng}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Upload Foto */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <span className="material-symbols-outlined">image</span> 3. Foto Produk / Usaha
                  </h3>
                  <div className={styles.fileUploadArea}>
                    <span className={`material-symbols-outlined ${styles.uploadIcon}`}>
                      cloud_upload
                    </span>
                    <p className={styles.uploadText}>Klik atau seret foto produk terbaik ke sini</p>
                    <span className={styles.uploadHint}>Format JPG, PNG (Maksimal 5MB)</span>
                    <input type="file" accept="image/*" className={styles.fileInput} />
                  </div>
                </div>

                <div className={styles.formFooter}>
                  <button type="submit" className="btn btn-primary btn-pill" style={{ width: "100%", padding: "1.1rem" }}>
                    Kirim Pendaftaran (Menunggu Verifikasi Admin)
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
