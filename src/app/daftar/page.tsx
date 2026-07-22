"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function DaftarUMKMPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "Kuliner",
    pemilik: "",
    kontak: "",
    dusun: "Krajan",
    rtRw: "",
    deskripsi: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={`container ${styles.headerContent}`}>
          <span className={styles.badge}>Formulir Resmi</span>
          <h1 className={styles.title}>Pendaftaran UMKM Desa Winong</h1>
          <p className={styles.subtitle}>
            Bergabunglah dalam ekosistem digital Desa Winong. Dapatkan fasilitas promosi gratis dan jangkauan pasar yang lebih luas untuk usaha lokal Anda.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: "800px" }}>
          {submitted ? (
            <div className={`organic-shadow ${styles.successCard}`}>
              <span className={`material-symbols-outlined ${styles.successIcon}`}>
                check_circle
              </span>
              <h2 className={styles.successTitle}>Pendaftaran Berhasil Dikirim!</h2>
              <p className={styles.successDesc}>
                Terima kasih <strong>{formData.pemilik}</strong>, pendaftaran unit usaha{" "}
                <strong>"{formData.nama}"</strong> telah diterima oleh Perangkat Desa Winong. Tim kami akan melakukan verifikasi data dan menghubungi Anda via WhatsApp di nomor{" "}
                <strong>{formData.kontak}</strong>.
              </p>
              <div className={styles.successActions}>
                <Link href="/umkm" className="btn btn-primary btn-pill">
                  Lihat Katalog UMKM
                </Link>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline btn-pill"
                >
                  Daftarkan UMKM Lain
                </button>
              </div>
            </div>
          ) : (
            <div className={`organic-shadow ${styles.formCard}`}>
              <div className={styles.formCardHeader}>
                <h2>Formulir Pendaftaran Unit Usaha Baru</h2>
                <p>Isi data profil UMKM Anda dengan lengkap dan benar.</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Section 1: Informasi Bisnis */}
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
                        placeholder="Contoh: Ibu Siti Aminah"
                        value={formData.pemilik}
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
                      placeholder="Jelaskan secara singkat mengenai keunggulan produk atau keunikan usaha Anda..."
                      value={formData.deskripsi}
                      onChange={handleChange}
                      className={styles.textarea}
                    ></textarea>
                  </div>
                </div>

                {/* Section 2: Kontak & Alamat */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <span className="material-symbols-outlined">location_on</span> 2. Kontak & Alamat
                  </h3>

                  <div className={styles.formRow}>
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

                {/* Section 3: Upload Foto */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <span className="material-symbols-outlined">image</span> 3. Foto Produk / Banner
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
                  <button type="submit" className="btn btn-primary btn-pill" style={{ width: "100%", padding: "1.2rem" }}>
                    Kirim Pendaftaran UMKM
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
