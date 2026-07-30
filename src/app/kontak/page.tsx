"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { desaInfo } from "@/data/desa";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import { MapPin, Phone, Mail } from "lucide-react";

export default function KontakPage() {
  const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' });
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending form
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setFormData({ nama: '', email: '', pesan: '' });
    }, 3000);
  };

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Hubungi Kami</h1>
          <p className={styles.subtitle}>Sampaikan saran, pertanyaan, atau pengaduan Anda kepada Pemerintah Desa Winong.</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.infoCard}>
              <SectionHeader title="Informasi Kontak" />
              <p className={styles.desc}>Kami siap melayani dan mendengarkan aspirasi warga maupun pengunjung. Silakan hubungi kami melalui kontak di bawah ini.</p>
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.icon}><MapPin size={24} color="var(--primary)" /></div>
                  <div>
                    <h4>Alamat Kantor</h4>
                    <p>{desaInfo.kontak.alamat}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.icon}><Phone size={24} color="var(--primary)" /></div>
                  <div>
                    <h4>Telepon</h4>
                    <p>{desaInfo.kontak.telepon}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.icon}><Mail size={24} color="var(--primary)" /></div>
                  <div>
                    <h4>Email</h4>
                    <p>{desaInfo.kontak.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formCard}>
              <SectionHeader title="Kirim Pesan" />
              {status === 'success' ? (
                <div className={styles.successMessage}>
                  Pesan Anda berhasil dikirim! Kami akan segera merespon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nama">Nama Lengkap</label>
                    <input 
                      type="text" 
                      id="nama" 
                      required 
                      value={formData.nama}
                      onChange={e => setFormData({...formData, nama: e.target.value})}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email / No. HP</label>
                    <input 
                      type="text" 
                      id="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="pesan">Pesan</label>
                    <textarea 
                      id="pesan" 
                      rows={5} 
                      required
                      value={formData.pesan}
                      onChange={e => setFormData({...formData, pesan: e.target.value})}
                      className={styles.textarea}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Kirim Pesan</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
