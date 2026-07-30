"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";
import { CheckCircle, Clock, XCircle, Edit, Save, X, Image as ImageIcon } from "lucide-react";

export default function AdminUMKMDetail() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [umkm, setUmkm] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // Media Edit States
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [editingProdukId, setEditingProdukId] = useState<string | null>(null);
  const [produkFormData, setProdukFormData] = useState<any>({});

  useEffect(() => {
    if (id) {
      fetchUMKMDetail(id as string);
    }
  }, [id]);

  const fetchUMKMDetail = async (umkmId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("umkm")
      .select("*, kategori(nama), galeri(image), produk(foto, nama, harga, deskripsi)")
      .eq("id", umkmId)
      .single();

    if (data) {
      setUmkm(data);
      setFormData({
        business_name: data.business_name || "",
        owner_name: data.owner_name || "",
        nik: data.nik || "",
        phone: data.phone || "",
        alamat: data.alamat || "",
        description: data.description || "",
        jam_operasional: data.jam_operasional || "",
        dusun: data.dusun || "",
        logo_url: data.logo_url || "",
      });
    } else {
      console.error(error);
    }
    setIsLoading(false);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleApprove = async () => {
    if (!umkm) return;
    const { error } = await supabase.from("umkm").update({ status: "APPROVED" }).eq("id", umkm.id);
    if (!error) {
      setUmkm({ ...umkm, status: "APPROVED" });
      triggerToast(`UMKM "${umkm.business_name}" berhasil disetujui.`);
    } else {
      triggerToast("Gagal menyetujui UMKM.");
    }
  };

  const handleReject = async () => {
    if (!umkm) return;
    const confirmReject = confirm(`Apakah Anda yakin ingin menolak UMKM "${umkm.business_name}"?`);
    if (confirmReject) {
      const { error } = await supabase.from("umkm").update({ status: "REJECTED" }).eq("id", umkm.id);
      if (!error) {
        setUmkm({ ...umkm, status: "REJECTED" });
        triggerToast(`Pendaftaran UMKM "${umkm.business_name}" ditolak.`);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!umkm) return;
    const { error } = await supabase.from("umkm").update(formData).eq("id", umkm.id);
    if (!error) {
      setUmkm({ ...umkm, ...formData });
      setIsEditing(false);
      triggerToast(`Data UMKM berhasil diperbarui.`);
    } else {
      triggerToast("Gagal menyimpan perubahan.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      business_name: umkm.business_name || "",
      owner_name: umkm.owner_name || "",
      nik: umkm.nik || "",
      phone: umkm.phone || "",
      alamat: umkm.alamat || "",
      description: umkm.description || "",
      jam_operasional: umkm.jam_operasional || "",
      dusun: umkm.dusun || "",
      logo_url: umkm.logo_url || "",
    });
  };

  const handleDeleteMedia = async (type: "galeri" | "produk", id: string, imageUrl: string) => {
    if (!confirm(`Hapus foto ${type} ini?`)) return;
    
    setIsUploadingMedia(true);
    try {
      const res = await fetch(`/api/umkm/media?type=${type}&id=${id}&image_url=${encodeURIComponent(imageUrl)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        if (type === "galeri") {
          setUmkm({ ...umkm, galeri: umkm.galeri.filter((g: any) => g.id !== id) });
        } else {
          setUmkm({ ...umkm, produk: umkm.produk.filter((p: any) => p.id !== id) });
        }
        triggerToast("Foto berhasil dihapus.");
      } else {
        triggerToast("Gagal menghapus foto.");
      }
    } catch (e) {
      triggerToast("Terjadi kesalahan.");
    }
    setIsUploadingMedia(false);
  };

  const handleAddGaleri = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !umkm) return;
    setIsUploadingMedia(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("type", "galeri");
    data.append("umkm_id", umkm.id);
    data.append("file", file);

    try {
      const res = await fetch("/api/umkm/media", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) {
        setUmkm({ ...umkm, galeri: [...(umkm.galeri || []), json.data] });
        triggerToast("Foto galeri berhasil ditambahkan.");
      } else {
        triggerToast("Gagal mengunggah foto.");
      }
    } catch (error) {
      triggerToast("Terjadi kesalahan.");
    }
    setIsUploadingMedia(false);
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !umkm) return;
    setIsUploadingMedia(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("type", "logo");
    data.append("umkm_id", umkm.id);
    data.append("file", file);

    try {
      const res = await fetch("/api/umkm/media", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) {
        setFormData({ ...formData, logo_url: json.data.image });
        triggerToast("Logo berhasil diunggah.");
      } else {
        triggerToast("Gagal mengunggah logo.");
      }
    } catch (error) {
      triggerToast("Terjadi kesalahan.");
    }
    setIsUploadingMedia(false);
  };

  const handleAddProduk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!umkm) return;
    setIsUploadingMedia(true);
    
    const target = e.target as typeof e.target & {
      nama: { value: string };
      harga: { value: string };
      deskripsi: { value: string };
      file: { files: FileList };
    };
    
    const file = target.file.files[0];
    if (!file) {
      triggerToast("Pilih foto produk terlebih dahulu.");
      setIsUploadingMedia(false);
      return;
    }

    const data = new FormData();
    data.append("type", "produk");
    data.append("umkm_id", umkm.id);
    data.append("file", file);
    data.append("nama", target.nama.value);
    data.append("harga", target.harga.value);
    data.append("deskripsi", target.deskripsi.value);

    try {
      const res = await fetch("/api/umkm/media", { method: "POST", body: data });
      const json = await res.json();
      if (res.ok) {
        setUmkm({ ...umkm, produk: [...(umkm.produk || []), json.data] });
        triggerToast("Produk berhasil ditambahkan.");
        (e.target as HTMLFormElement).reset();
      } else {
        triggerToast("Gagal mengunggah produk.");
      }
    } catch (error) {
      triggerToast("Terjadi kesalahan.");
    }
    setIsUploadingMedia(false);
  };

  const handleUpdateProdukText = async (id: string) => {
    setIsUploadingMedia(true);
    try {
      const res = await fetch(`/api/umkm/produk/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produkFormData)
      });
      const json = await res.json();
      if (res.ok) {
        setUmkm({
          ...umkm, 
          produk: umkm.produk.map((p: any) => p.id === id ? { ...p, ...json.data } : p)
        });
        setEditingProdukId(null);
        triggerToast("Data produk berhasil diperbarui.");
      } else {
        triggerToast("Gagal memperbarui produk.");
      }
    } catch (error) {
      triggerToast("Terjadi kesalahan.");
    }
    setIsUploadingMedia(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Memuat detail UMKM...</p>
      </div>
    );
  }

  if (!umkm) {
    return (
      <div className={styles.loadingContainer}>
        <p>Data UMKM tidak ditemukan.</p>
        <Link href="/admin" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Kembali ke Admin
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.detailLayout}>
      <header className={styles.header}>
        <div>
          <Link href="/admin" className={styles.backLink}>
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Panel Admin
          </Link>
          <h1 className={styles.pageTitle}>Detail UMKM</h1>
          <p className={styles.pageSub}>
            Tinjau, verifikasi, atau perbarui data usaha warga Desa Winong.
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.statusBadge} data-status={umkm.status}>
            {umkm.status === "APPROVED" && <><CheckCircle size={16} /> Terverifikasi (Aktif)</>}
            {umkm.status === "PENDING" && <><Clock size={16} /> Menunggu Verifikasi</>}
            {umkm.status === "REJECTED" && <><XCircle size={16} /> Ditolak</>}
          </div>

          {umkm.status === "PENDING" && !isEditing && (
            <div className={styles.actionButtons}>
              <button className="btn btn-outline" style={{ borderColor: "#ba1a1a", color: "#ba1a1a" }} onClick={handleReject}>
                Tolak
              </button>
              <button className="btn btn-primary" onClick={handleApprove}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check_circle</span>
                ACC / Setujui
              </button>
            </div>
          )}

          {!isEditing ? (
            <button className={`btn btn-outline ${styles.editToggleBtn}`} onClick={() => setIsEditing(true)}>
              <Edit size={16} /> Edit Data
            </button>
          ) : (
            <div className={styles.actionButtons}>
              <button className="btn btn-outline" onClick={handleCancelEdit}>
                <X size={16} /> Batal
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                <Save size={16} /> Simpan Perubahan
              </button>
            </div>
          )}
        </div>
      </header>

      <div className={styles.contentGrid}>
        {/* Kolom Kiri: Data Administrasi */}
        <section className={styles.adminDataSection}>
          <h2 className={styles.sectionTitle}>Data Administrasi</h2>
          
          <div className={styles.dataCard}>
            {/* INFORMASI PEMILIK */}
            <div className={styles.dataGroup}>
              <h3 className={styles.dataGroupTitle}>Informasi Pemilik</h3>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Nama Lengkap</span>
                {isEditing ? (
                  <input className={styles.inputField} name="owner_name" value={formData.owner_name} onChange={handleChange} />
                ) : (
                  <span className={styles.dataValue}>{umkm.owner_name}</span>
                )}
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>NIK</span>
                {isEditing ? (
                  <input className={styles.inputField} name="nik" value={formData.nik} onChange={handleChange} />
                ) : (
                  <span className={styles.dataValue}>{umkm.nik}</span>
                )}
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>No. WhatsApp</span>
                {isEditing ? (
                  <input className={styles.inputField} name="phone" value={formData.phone} onChange={handleChange} />
                ) : (
                  <span className={styles.dataValue}>+{umkm.phone}</span>
                )}
              </div>
            </div>

            {/* INFORMASI USAHA */}
            <div className={styles.dataGroup}>
              <h3 className={styles.dataGroupTitle}>Informasi Usaha</h3>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Nama Usaha</span>
                {isEditing ? (
                  <input className={styles.inputField} name="business_name" value={formData.business_name} onChange={handleChange} />
                ) : (
                  <span className={styles.dataValueBold}>{umkm.business_name}</span>
                )}
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Kategori</span>
                <span className={styles.dataValue}>{umkm.kategori?.nama || "Umum"}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Status NIB</span>
                <span className={styles.dataValue}>
                  {umkm.nib ? (
                    <span className={styles.nibBadgeAda}>{umkm.nib}</span>
                  ) : (
                    <span className={styles.nibBadgeTidak}>Belum Ada</span>
                  )}
                </span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Jam Operasional</span>
                {isEditing ? (
                  <input className={styles.inputField} name="jam_operasional" value={formData.jam_operasional} onChange={handleChange} />
                ) : (
                  <span className={styles.dataValue}>{umkm.jam_operasional || "-"}</span>
                )}
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Deskripsi Singkat</span>
                {isEditing ? (
                  <textarea className={styles.inputField} name="description" value={formData.description} onChange={handleChange} rows={3} />
                ) : (
                  <span className={styles.dataValue}>{umkm.description || "-"}</span>
                )}
              </div>
            </div>

            {/* LOKASI */}
            <div className={styles.dataGroup}>
              <h3 className={styles.dataGroupTitle}>Lokasi</h3>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Dusun</span>
                {isEditing ? (
                  <input className={styles.inputField} name="dusun" value={formData.dusun} onChange={handleChange} />
                ) : (
                  <span className={styles.dataValue}>{umkm.dusun || "-"}</span>
                )}
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Alamat Lengkap</span>
                {isEditing ? (
                  <textarea className={styles.inputField} name="alamat" value={formData.alamat} onChange={handleChange} rows={2} />
                ) : (
                  <span className={styles.dataValue}>{umkm.alamat}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Kolom Kanan: Foto & Bukti */}
        <section className={styles.photoEvidenceSection}>
          <h2 className={styles.sectionTitle}>Bukti Foto / Media</h2>
          
          <div className={styles.photoContainer}>
            {/* Logo */}
            <div className={styles.photoBox}>
              <h4 className={styles.photoBoxTitle}><ImageIcon size={16} /> Logo Usaha</h4>
              {isEditing ? (
                <div className={styles.editImgWrapper} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label className="btn btn-outline" style={{ cursor: "pointer", alignSelf: "flex-start" }}>
                    {isUploadingMedia ? "Mengunggah..." : "Pilih File Logo"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUploadLogo} disabled={isUploadingMedia} />
                  </label>
                  {formData.logo_url && <img src={formData.logo_url} alt="Logo Preview" className={styles.evidenceImgPreview} style={{ marginTop: "10px" }} />}
                </div>
              ) : (
                umkm.logo_url ? <img src={umkm.logo_url} alt="Logo Usaha" className={styles.evidenceImg} /> : <p className={styles.textMuted}>Tidak ada logo.</p>
              )}
            </div>

            {/* Galeri */}
            <div className={styles.photoBox}>
              <h4 className={styles.photoBoxTitle}><ImageIcon size={16} /> Foto Lokasi / Menu</h4>
              
              <div className={styles.evidenceGrid}>
                {umkm.galeri?.map((g: any, i: number) => (
                  <div key={g.id || i} style={{ position: "relative" }}>
                    <img src={g.image} alt={`Galeri ${i+1}`} className={styles.evidenceImg} />
                    {isEditing && (
                      <button 
                        className={`btn ${styles.deleteBtn}`} 
                        style={{ position: "absolute", top: "5px", right: "5px", padding: "5px", background: "white", color: "red", border: "1px solid red", borderRadius: "50%" }}
                        onClick={() => handleDeleteMedia("galeri", g.id, g.image)}
                        disabled={isUploadingMedia}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div style={{ marginTop: "1rem", padding: "1rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                  <label className="btn btn-outline" style={{ cursor: "pointer" }}>
                    {isUploadingMedia ? "Mengunggah..." : "+ Tambah Foto Galeri"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAddGaleri} disabled={isUploadingMedia} />
                  </label>
                </div>
              )}
            </div>

            {/* Produk */}
            <div className={styles.photoBox}>
              <h4 className={styles.photoBoxTitle}><ImageIcon size={16} /> Katalog Produk</h4>
              <div className={styles.evidenceGrid}>
                {umkm.produk?.map((p: any, i: number) => (
                  <div key={p.id || i} className={styles.productCard} style={{ position: "relative" }}>
                    {p.foto && <img src={p.foto} alt={p.nama} className={styles.productCardImg} />}
                    {isEditing && (
                      <button 
                        className={`btn ${styles.deleteBtn}`} 
                        style={{ position: "absolute", top: "5px", right: "5px", padding: "5px", background: "white", color: "red", border: "1px solid red", borderRadius: "50%" }}
                        onClick={() => handleDeleteMedia("produk", p.id, p.foto)}
                        disabled={isUploadingMedia}
                      >
                        <X size={14} />
                      </button>
                    )}
                    
                    {editingProdukId === p.id ? (
                      <div className={styles.productInfo} style={{ padding: "10px", gap: "5px", display: "flex", flexDirection: "column" }}>
                        <input className={styles.inputField} style={{ padding: "5px", fontSize: "0.8rem" }} value={produkFormData.nama || ""} onChange={(e) => setProdukFormData({...produkFormData, nama: e.target.value})} placeholder="Nama" />
                        <input className={styles.inputField} style={{ padding: "5px", fontSize: "0.8rem" }} type="number" value={produkFormData.harga || ""} onChange={(e) => setProdukFormData({...produkFormData, harga: e.target.value})} placeholder="Harga" />
                        <textarea className={styles.inputField} style={{ padding: "5px", fontSize: "0.8rem" }} value={produkFormData.deskripsi || ""} onChange={(e) => setProdukFormData({...produkFormData, deskripsi: e.target.value})} placeholder="Deskripsi" rows={2} />
                        <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                          <button className="btn btn-primary" style={{ flex: 1, padding: "5px", fontSize: "0.7rem" }} onClick={() => handleUpdateProdukText(p.id)}>Simpan</button>
                          <button className="btn btn-outline" style={{ flex: 1, padding: "5px", fontSize: "0.7rem" }} onClick={() => setEditingProdukId(null)}>Batal</button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{p.nama}</span>
                        {p.harga && <span className={styles.productPrice}>Rp{p.harga.toLocaleString("id-ID")}</span>}
                        {p.deskripsi && <span style={{ fontSize: "0.7rem", color: "gray" }}>{p.deskripsi}</span>}
                        
                        {isEditing && (
                          <button 
                            className="btn btn-outline" 
                            style={{ marginTop: "10px", padding: "4px 8px", fontSize: "0.7rem" }}
                            onClick={() => {
                              setEditingProdukId(p.id);
                              setProdukFormData({ nama: p.nama, harga: p.harga, deskripsi: p.deskripsi });
                            }}
                          >
                            Edit Teks
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div style={{ marginTop: "1rem", padding: "1rem", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)" }}>
                  <h5 style={{ marginBottom: "10px" }}>Tambah Produk Baru</h5>
                  <form onSubmit={handleAddProduk} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input name="nama" className={styles.inputField} placeholder="Nama Produk" required disabled={isUploadingMedia} />
                    <input name="harga" type="number" className={styles.inputField} placeholder="Harga (Opsional)" disabled={isUploadingMedia} />
                    <textarea name="deskripsi" className={styles.inputField} placeholder="Deskripsi (Opsional)" rows={2} disabled={isUploadingMedia}></textarea>
                    <input name="file" type="file" accept="image/*" required disabled={isUploadingMedia} />
                    <button type="submit" className="btn btn-primary" disabled={isUploadingMedia}>
                      {isUploadingMedia ? "Menyimpan..." : "+ Simpan Produk"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {!isEditing && !umkm.logo_url && (!umkm.galeri || umkm.galeri.length === 0) && (!umkm.produk || umkm.produk.length === 0) && (
              <div className={styles.emptyPhoto}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--border-light)" }}>no_photography</span>
                <p>Tidak ada lampiran foto untuk UMKM ini.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* NOTIFICATION TOAST */}
      {showToast && (
        <div className={styles.toast}>
          <CheckCircle size={20} style={{ color: "#9DD090" }} />
          <span>{toastMessage}</span>
          <button onClick={() => setShowToast(false)} className={styles.toastClose}>
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
