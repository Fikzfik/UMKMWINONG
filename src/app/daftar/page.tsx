"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { createClient } from "@/lib/supabase/client";
import { MapPin } from "lucide-react";

const DUSUN_OPTIONS = [
  "Winong",
  "Badur",
  "Bamban",
  "Gebangan",
  "Matokan",
  "Padas Malang",
  "Tumpak Asri"
];

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function DaftarUMKMPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data Master
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchKategori() {
      const { data } = await supabase.from('kategori').select('*');
      if (data) setKategoriList(data);
    }
    fetchKategori();
  }, [supabase]);

  // --- FORM STATE ---
  
  // Step 1: Profil
  const [profilData, setProfilData] = useState({
    business_name: "",
    category_id: "",
    owner_name: "",
    nik: "",
    phone: "",
    nib: "",
    description: "",
    social_media: ""
  });

  // Step 2: Alamat & Jam Operasional
  const [alamatData, setAlamatData] = useState({
    dusun: DUSUN_OPTIONS[0],
    alamat: ""
  });
  
  const [operationalHours, setOperationalHours] = useState(
    DAYS.map(day => ({
      day,
      isOpen: true,
      openTime: "08:00",
      closeTime: "17:00"
    }))
  );

  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [gpsDetected, setGpsDetected] = useState(false);
  const [loadingGps, setLoadingGps] = useState(false);
  
  const [fotoLokasi, setFotoLokasi] = useState<File | null>(null);
  const [previewLokasi, setPreviewLokasi] = useState<string | null>(null);

  // Step 3: Branding (Opsional)
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  // Step 4: Produk/Menu
  const [productMode, setProductMode] = useState<"menu" | "list">("menu");
  
  // Mode Menu
  const [fotoMenu, setFotoMenu] = useState<File | null>(null);
  const [previewMenu, setPreviewMenu] = useState<string | null>(null);
  
  // Mode List
  const [products, setProducts] = useState([
    { id: 1, nama: "", harga: "", deskripsi: "", foto: null as File | null, preview: null as string | null }
  ]);


  // --- HANDLERS ---
  
  const handleNextStep = () => {
    // Validasi Step 1
    if (currentStep === 1) {
      if (!profilData.business_name || !profilData.category_id || !profilData.owner_name || !profilData.nik || !profilData.phone || !profilData.description) {
        alert("Mohon lengkapi semua field yang wajib diisi pada Profil UMKM.");
        return;
      }
    }
    
    // Validasi Step 2
    if (currentStep === 2) {
      if (!alamatData.alamat) {
        alert("Detail alamat wajib diisi.");
        return;
      }
      if (!fotoLokasi) {
        alert("Foto lokasi/tempat usaha wajib diunggah.");
        return;
      }
      if (!gpsDetected) {
        const confirmNoGps = window.confirm("Anda belum mengambil titik koordinat GPS. Apakah Anda yakin ingin melanjutkan?");
        if (!confirmNoGps) return;
      }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => Math.max(prev - 1, 1));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any, previewSetter: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setProducts(products.map(p => p.id === id ? { ...p, foto: file, preview } : p));
    }
  };

  const formatJamOperasional = () => {
    return operationalHours.map(h => 
      `${h.day}: ${h.isOpen ? `${h.openTime} - ${h.closeTime}` : 'Tutup'}`
    ).join('; ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi akhir Step 4
    if (productMode === "menu" && !fotoMenu) {
      alert("Foto Daftar Menu/Produk wajib diunggah untuk opsi ini.");
      return;
    }
    
    if (productMode === "list") {
      const validProducts = products.filter(p => p.nama.trim() !== "");
      if (validProducts.length === 0) {
        alert("Minimal harus ada 1 produk yang diisi nama produknya.");
        return;
      }
    }

    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    
    // Append Profil
    Object.entries(profilData).forEach(([key, val]) => formDataToSend.append(key, val));
    
    // Append Alamat & Jam
    Object.entries(alamatData).forEach(([key, val]) => formDataToSend.append(key, val));
    formDataToSend.append("jam_operasional", formatJamOperasional());
    
    formDataToSend.append("latitude", coords.lat !== null ? coords.lat.toString() : "0");
    formDataToSend.append("longitude", coords.lng !== null ? coords.lng.toString() : "0");
    
    if (fotoLokasi) formDataToSend.append("foto_lokasi", fotoLokasi);
    
    // Append Branding
    if (logo) formDataToSend.append("logo", logo);
    if (banner) formDataToSend.append("banner", banner);
    
    // Append Produk
    formDataToSend.append("product_mode", productMode);
    
    if (productMode === "menu") {
      if (fotoMenu) formDataToSend.append("foto_menu", fotoMenu);
      formDataToSend.append("product_count", "1");
    } else {
      const validProducts = products.filter(p => p.nama.trim() !== "");
      formDataToSend.append("product_count", validProducts.length.toString());
      
      validProducts.forEach((p, idx) => {
        const num = idx + 1;
        formDataToSend.append(`produk_${num}_nama`, p.nama);
        formDataToSend.append(`produk_${num}_harga`, p.harga);
        formDataToSend.append(`produk_${num}_deskripsi`, p.deskripsi);
        if (p.foto) {
          formDataToSend.append(`produk_${num}_foto`, p.foto);
        }
      });
    }

    try {
      const res = await fetch("/api/umkm/register", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const result = await res.json();
        alert(`Gagal mendaftar: ${result.error}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan saat mendaftar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERERS ---

  return (
    <div style={{ minHeight: "80vh", paddingBottom: "5rem" }}>
      <div className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={`container ${styles.headerContent}`}>
          <span className={styles.badge}>Formulir Pendaftaran Publik</span>
          <h1 className={styles.title}>Pendaftaran UMKM Desa Winong</h1>
          <p className={styles.subtitle}>
            Daftarkan usaha Anda beserta produk-produk unggulan Anda secara gratis dalam satu form ini.
          </p>
        </div>
      </div>

      <section style={{ marginTop: "-3rem", position: "relative", zIndex: 20 }}>
        <div className="container" style={{ maxWidth: "850px", margin: "0 auto" }}>
          
          {submitted ? (
            <div className={`organic-shadow ${styles.successCard}`}>
              <span className={`material-symbols-outlined ${styles.successIcon}`}>verified_user</span>
              <h2 className={styles.successTitle}>Pendaftaran Berhasil Dikirim!</h2>
              <p className={styles.successDesc}>
                Terima kasih <strong>{profilData.owner_name}</strong>! Pendaftaran usaha{" "}
                <strong>"{profilData.business_name}"</strong> telah masuk ke antrean verifikasi.
              </p>
              <div className={styles.successActions}>
                <Link href="/umkm" className="btn btn-primary btn-pill">Lihat Katalog UMKM</Link>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-outline btn-pill"
                >
                  Daftarkan Usaha Lain
                </button>
              </div>
            </div>
          ) : (
            <div className={`organic-shadow ${styles.formCard}`}>
              
              {/* Stepper Progress */}
              <div className={styles.stepperContainer}>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar} style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                </div>
                <ul className={styles.stepsList}>
                  {[
                    { num: 1, label: "Profil", icon: "storefront" },
                    { num: 2, label: "Alamat & Jam", icon: "location_on" },
                    { num: 3, label: "Branding", icon: "branding_watermark" },
                    { num: 4, label: "Produk/Menu", icon: "inventory_2" },
                  ].map(step => (
                    <li key={step.num} className={`${styles.stepItem} ${currentStep === step.num ? styles.active : ''} ${currentStep > step.num ? styles.completed : ''}`}>
                      <div className={styles.stepIcon}>
                        {currentStep > step.num ? <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>check</span> : <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{step.icon}</span>}
                      </div>
                      <span className={styles.stepLabel}>{step.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                
                {/* STEP 1: PROFIL UMKM */}
                {currentStep === 1 && (
                  <div className={styles.formStep}>
                    <div className={styles.formCardHeader}>
                      <h2>1. Profil UMKM</h2>
                      <p>Informasi dasar tentang usaha dan pemilik (semua bertanda * wajib diisi).</p>
                    </div>

                    <div className={styles.formSection}>
                      <div className={styles.formGroup}>
                        <label>Nama Usaha / UMKM *</label>
                        <input type="text" required placeholder="Contoh: Warung Kopi Mantap" 
                          value={profilData.business_name} onChange={e => setProfilData({...profilData, business_name: e.target.value})} className={styles.input} />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Kategori Usaha *</label>
                          <select required value={profilData.category_id} onChange={e => setProfilData({...profilData, category_id: e.target.value})} className={styles.select}>
                            <option value="">Pilih Kategori</option>
                            {kategoriList.map(kat => <option key={kat.id} value={kat.id}>{kat.nama}</option>)}
                          </select>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Nama Pemilik / Pengelola *</label>
                          <input type="text" required placeholder="Contoh: Bu Siti" 
                            value={profilData.owner_name} onChange={e => setProfilData({...profilData, owner_name: e.target.value})} className={styles.input} />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>NIK (Nomor Induk Kependudukan) *</label>
                          <input type="text" required placeholder="Nomor KTP (16 digit)" 
                            value={profilData.nik} onChange={e => setProfilData({...profilData, nik: e.target.value})} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Nomor WhatsApp Aktif *</label>
                          <input type="tel" required placeholder="Contoh: 081234567890" 
                            value={profilData.phone} onChange={e => setProfilData({...profilData, phone: e.target.value})} className={styles.input} />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>NIB (Nomor Induk Berusaha)</label>
                          <input type="text" placeholder="Opsional jika ada" 
                            value={profilData.nib} onChange={e => setProfilData({...profilData, nib: e.target.value})} className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                          <label>Media Sosial (Opsional)</label>
                          <input type="text" placeholder="Contoh: @warungkopi.winong" 
                            value={profilData.social_media} onChange={e => setProfilData({...profilData, social_media: e.target.value})} className={styles.input} />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label>Deskripsi Singkat Usaha *</label>
                        <textarea rows={3} required placeholder="Ceritakan singkat tentang produk/layanan usaha Anda..."
                          value={profilData.description} onChange={e => setProfilData({...profilData, description: e.target.value})} className={styles.textarea}></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: ALAMAT & JAM OPERASIONAL */}
                {currentStep === 2 && (
                  <div className={styles.formStep}>
                    <div className={styles.formCardHeader}>
                      <h2>2. Lokasi & Jam Operasional</h2>
                      <p>Tentukan lokasi usaha, koordinat peta, dan jadwal buka usaha Anda.</p>
                    </div>

                    <div className={styles.formSection}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Dusun *</label>
                          <select value={alamatData.dusun} onChange={e => setAlamatData({...alamatData, dusun: e.target.value})} className={styles.select}>
                            {DUSUN_OPTIONS.map(dusun => (
                              <option key={dusun} value={dusun}>Dusun {dusun}</option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.formGroup}>
                          <label>RT / RW & Detail Alamat *</label>
                          <input type="text" required placeholder="Contoh: RT 01 RW 02, Depan Balai Desa" 
                            value={alamatData.alamat} onChange={e => setAlamatData({...alamatData, alamat: e.target.value})} className={styles.input} />
                        </div>
                      </div>

                      {/* GPS */}
                      <div style={{ background: "var(--surface-container-low)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <div>
                            <strong style={{ fontSize: "0.95rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <MapPin size={18} /> Penandaan Koordinat Presisi
                            </strong>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Klik tombol ini saat Anda sedang berada di lokasi tempat jualan.</p>
                          </div>
                          <button type="button" onClick={handleGetGps} disabled={loadingGps} className="btn btn-outline" style={{ padding: "0.5rem 1rem", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            {loadingGps ? "Mendeteksi..." : <><MapPin size={16} /> Ambil Lokasi Shareloc</>}
                          </button>
                        </div>
                        {gpsDetected && coords.lat !== null && (
                          <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #22C55E", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", color: "#166534", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                            <span className="material-symbols-outlined">check_circle</span> Koordinat Berhasil Disimpan ({coords.lat}, {coords.lng})
                          </div>
                        )}
                      </div>

                      {/* FOTO LOKASI Wajib */}
                      <div className={styles.formGroup}>
                        <label>Foto Lokasi / Tempat Usaha (Wajib) *</label>
                        <p style={{fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem"}}>Foto tampak depan rumah atau tempat jualan Anda agar pembeli mudah mencari.</p>
                        
                        {!previewLokasi ? (
                          <label className={styles.fileUploadArea}>
                            <div className={styles.uploadIcon}><span className="material-symbols-outlined" style={{ fontSize: "3rem" }}>add_a_photo</span></div>
                            <div className={styles.uploadText}>Klik atau Drag Foto Lokasi ke sini</div>
                            <div className={styles.uploadHint}>JPG, PNG atau WebP (Maks 5MB)</div>
                            <input type="file" accept="image/jpeg, image/png, image/webp" className={styles.fileInput} onChange={(e) => handleFileChange(e, setFotoLokasi, setPreviewLokasi)} />
                          </label>
                        ) : (
                          <div style={{ position: "relative" }}>
                            <button type="button" onClick={() => {setFotoLokasi(null); setPreviewLokasi(null)}} className={styles.removeImageBtn} title="Hapus Foto">
                              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                            </button>
                            <img src={previewLokasi} alt="Preview Lokasi" className={styles.imagePreview} style={{ height: "300px", objectFit: "cover", width: "100%" }} />
                          </div>
                        )}
                      </div>

                      {/* JAM OPERASIONAL Grid */}
                      <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                        <label>Jam Operasional *</label>
                        <div className={styles.operationalGrid}>
                          {operationalHours.map((hourObj, idx) => (
                            <div key={hourObj.day} className={styles.dayRow}>
                              <div className={styles.dayToggle}>
                                <input 
                                  type="checkbox" 
                                  id={`day_${hourObj.day}`}
                                  checked={hourObj.isOpen}
                                  onChange={(e) => {
                                    const newHours = [...operationalHours];
                                    newHours[idx].isOpen = e.target.checked;
                                    setOperationalHours(newHours);
                                  }}
                                />
                                <label htmlFor={`day_${hourObj.day}`}>{hourObj.day}</label>
                              </div>
                              
                              {hourObj.isOpen ? (
                                <div className={styles.timeInputs}>
                                  <input 
                                    type="time" 
                                    value={hourObj.openTime}
                                    onChange={(e) => {
                                      const newHours = [...operationalHours];
                                      newHours[idx].openTime = e.target.value;
                                      setOperationalHours(newHours);
                                    }}
                                    className={styles.timeInput}
                                  />
                                  <span>s/d</span>
                                  <input 
                                    type="time" 
                                    value={hourObj.closeTime}
                                    onChange={(e) => {
                                      const newHours = [...operationalHours];
                                      newHours[idx].closeTime = e.target.value;
                                      setOperationalHours(newHours);
                                    }}
                                    className={styles.timeInput}
                                  />
                                </div>
                              ) : (
                                <div style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.9rem" }}>Tutup</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 3: BRANDING */}
                {currentStep === 3 && (
                  <div className={styles.formStep}>
                    <div className={styles.formCardHeader}>
                      <h2>3. Identitas Branding (Opsional)</h2>
                      <p>Tambahkan logo dan foto banner agar toko Anda tampil lebih menarik di katalog.</p>
                    </div>

                    <div className={styles.formSection}>
                      
                      <div className={styles.formRow}>
                        {/* LOGO */}
                        <div className={styles.formGroup}>
                          <label>Logo Usaha</label>
                          {!previewLogo ? (
                            <label className={styles.fileUploadArea} style={{ padding: "1.5rem" }}>
                              <div className={styles.uploadIcon}><span className="material-symbols-outlined" style={{ fontSize: "2rem" }}>account_circle</span></div>
                              <div className={styles.uploadText} style={{ fontSize: "0.85rem" }}>Upload Logo</div>
                              <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleFileChange(e, setLogo, setPreviewLogo)} />
                            </label>
                          ) : (
                            <div style={{ position: "relative" }}>
                              <button type="button" onClick={() => {setLogo(null); setPreviewLogo(null)}} className={styles.removeImageBtn}>
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                              </button>
                              <img src={previewLogo} alt="Logo" className={styles.imagePreview} style={{ height: "150px", objectFit: "contain", background: "#f0f0f0" }} />
                            </div>
                          )}
                        </div>

                        {/* BANNER */}
                        <div className={styles.formGroup}>
                          <label>Foto Sampul / Banner</label>
                          {!previewBanner ? (
                            <label className={styles.fileUploadArea} style={{ padding: "1.5rem" }}>
                              <div className={styles.uploadIcon}><span className="material-symbols-outlined" style={{ fontSize: "2rem" }}>panorama</span></div>
                              <div className={styles.uploadText} style={{ fontSize: "0.85rem" }}>Upload Banner</div>
                              <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleFileChange(e, setBanner, setPreviewBanner)} />
                            </label>
                          ) : (
                            <div style={{ position: "relative" }}>
                              <button type="button" onClick={() => {setBanner(null); setPreviewBanner(null)}} className={styles.removeImageBtn}>
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                              </button>
                              <img src={previewBanner} alt="Banner" className={styles.imagePreview} style={{ height: "150px", objectFit: "cover" }} />
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 4: PRODUK / MENU */}
                {currentStep === 4 && (
                  <div className={styles.formStep}>
                    <div className={styles.formCardHeader}>
                      <h2>4. Detail Produk & Menu</h2>
                      <p>Pilih bagaimana Anda ingin menampilkan produk/layanan Anda kepada pembeli.</p>
                    </div>

                    <div className={styles.formSection}>
                      
                      {/* Opsi Tipe Produk */}
                      <div className={styles.radioCards}>
                        <label className={styles.radioCard}>
                          <input type="radio" name="productMode" value="menu" checked={productMode === "menu"} onChange={() => setProductMode("menu")} />
                          <div className={styles.radioCardContent}>
                            <span className={`material-symbols-outlined ${styles.radioIcon}`}>restaurant_menu</span>
                            <div>
                              <h4>Banyak Menu / Varian</h4>
                              <p>Cocok untuk Warkop, Warung Makan, Seblak Prasmanan, dll.</p>
                            </div>
                          </div>
                        </label>

                        <label className={styles.radioCard}>
                          <input type="radio" name="productMode" value="list" checked={productMode === "list"} onChange={() => setProductMode("list")} />
                          <div className={styles.radioCardContent}>
                            <span className={`material-symbols-outlined ${styles.radioIcon}`}>local_mall</span>
                            <div>
                              <h4>Produk Tertentu / Hasil Bumi</h4>
                              <p>Cocok untuk Hasil Panen, Makanan Ringan Spesifik, Kerajinan, dll.</p>
                            </div>
                          </div>
                        </label>
                      </div>

                      <div style={{ marginTop: "1rem" }}>
                        {/* Tampilan Mode Menu */}
                        {productMode === "menu" ? (
                          <div style={{ background: "var(--surface-container-low)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Upload Daftar Menu Anda</h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                              Jika menu Anda banyak, cukup foto daftar menu/harga (brosur, tulisan dinding) lalu upload di sini.
                            </p>
                            
                            {!previewMenu ? (
                              <label className={styles.fileUploadArea}>
                                <div className={styles.uploadIcon}><span className="material-symbols-outlined" style={{ fontSize: "3rem" }}>receipt_long</span></div>
                                <div className={styles.uploadText}>Klik atau Drag Foto Daftar Menu</div>
                                <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleFileChange(e, setFotoMenu, setPreviewMenu)} />
                              </label>
                            ) : (
                              <div style={{ position: "relative" }}>
                                <button type="button" onClick={() => {setFotoMenu(null); setPreviewMenu(null)}} className={styles.removeImageBtn}>
                                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                                </button>
                                <img src={previewMenu} alt="Menu" className={styles.imagePreview} style={{ height: "400px" }} />
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Tampilan Mode List Produk Terpisah */
                          <div>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                              Masukkan detail produk satu per satu. Anda bisa menambahkan hingga 10 produk.
                            </p>
                            
                            {products.map((prod, idx) => (
                              <div key={prod.id} style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "12px", marginBottom: "1.5rem", background: "#fff" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
                                  <strong style={{ color: "var(--primary)" }}>Produk #{idx + 1}</strong>
                                  {products.length > 1 && (
                                    <button type="button" onClick={() => setProducts(products.filter(p => p.id !== prod.id))} style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}>
                                      Hapus
                                    </button>
                                  )}
                                </div>
                                
                                <div className={styles.formRow}>
                                  <div className={styles.formGroup}>
                                    <label>Nama Produk *</label>
                                    <input type="text" required={idx===0} placeholder="Contoh: Kripik Tempe Rasa BBQ" 
                                      value={prod.nama} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? {...p, nama: e.target.value} : p))} className={styles.input} />
                                  </div>
                                  <div className={styles.formGroup}>
                                    <label>Harga (Opsional)</label>
                                    <input type="text" placeholder="Contoh: 15.000 / bungkus" 
                                      value={prod.harga} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? {...p, harga: e.target.value} : p))} className={styles.input} />
                                  </div>
                                </div>
                                
                                <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                                  <label>Deskripsi Singkat</label>
                                  <input type="text" placeholder="Detail produk..." 
                                    value={prod.deskripsi} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? {...p, deskripsi: e.target.value} : p))} className={styles.input} />
                                </div>
                                
                                <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                                  <label>Foto Produk (Opsional)</label>
                                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                    <label className={styles.fileUploadArea} style={{ padding: "1rem", flex: 1, minHeight: "100px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                      <div className={styles.uploadText} style={{ fontSize: "0.8rem" }}>Upload Foto Produk ini</div>
                                      <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleProductFileChange(e, prod.id)} />
                                    </label>
                                    {prod.preview && (
                                      <img src={prod.preview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }} />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {products.length < 10 && (
                              <button 
                                type="button" 
                                onClick={() => setProducts([...products, { id: Date.now(), nama: "", harga: "", deskripsi: "", foto: null, preview: null }])}
                                className="btn btn-outline"
                                style={{ width: "100%", borderStyle: "dashed" }}
                              >
                                + Tambah Produk Lainnya
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* Form Navigation */}
                <div className={styles.formNavigation}>
                  {currentStep > 1 ? (
                    <button type="button" onClick={handlePrevStep} className="btn btn-outline">
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span> Sebelumnya
                    </button>
                  ) : (
                    <div></div> // Placeholder
                  )}
                  
                  {currentStep < 4 ? (
                    <button type="button" onClick={handleNextStep} className="btn btn-primary">
                      Selanjutnya <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                    </button>
                  ) : (
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ minWidth: "150px" }}>
                      {isSubmitting ? "Mengunggah..." : "Kirim Pendaftaran"}
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
