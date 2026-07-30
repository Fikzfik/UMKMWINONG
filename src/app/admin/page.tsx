"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { createClient } from "@/lib/supabase/client";
import { MapPin, CheckCircle, Clock, Download, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Aktif" | "Pending">("Semua");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchUMKM();
  }, []);

  const fetchUMKM = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("umkm")
      .select("*, kategori(nama)")
      .order("created_at", { ascending: false });
    
    if (data) {
      setUmkmList(data);
    }
    setIsLoading(false);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleApprove = async (id: string, nama: string) => {
    await supabase.from("umkm").update({ status: "APPROVED" }).eq("id", id);
    setUmkmList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item))
    );
    triggerToast(`UMKM "${nama}" telah di-ACC & resmi terbit di Katalog Publik!`);
  };

  const handleReject = async (id: string, nama: string) => {
    await supabase.from("umkm").update({ status: "REJECTED" }).eq("id", id);
    setUmkmList((prev) => prev.map((item) => (item.id === id ? { ...item, status: "REJECTED" } : item)));
    triggerToast(`Pendaftaran UMKM "${nama}" ditolak.`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredUMKM = umkmList.filter((u) => {
    const matchesSearch =
      u.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.alamat?.toLowerCase().includes(search.toLowerCase());
    
    const mappedStatus = u.status === "APPROVED" ? "Aktif" : (u.status === "PENDING" ? "Pending" : "Ditolak");
    const matchesStatus = statusFilter === "Semua" || mappedStatus === statusFilter;
    
    return matchesSearch && matchesStatus && u.status !== "REJECTED";
  });

  const pendingCount = umkmList.filter((u) => u.status === "PENDING").length;
  const aktifCount = umkmList.filter((u) => u.status === "APPROVED").length;

  const categoryDataMap: Record<string, number> = {};
  umkmList.filter(u => u.status !== "REJECTED").forEach(u => {
    const cat = u.kategori?.nama || "Umum";
    categoryDataMap[cat] = (categoryDataMap[cat] || 0) + 1;
  });
  const categoryData = Object.keys(categoryDataMap).map(key => ({
    name: key,
    value: categoryDataMap[key]
  })).sort((a, b) => b.value - a.value);

  const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#e06385", "#5a92d4"];

  const trendDataMap: Record<string, number> = {};
  umkmList.forEach(u => {
    if (u.created_at) {
      const date = new Date(u.created_at);
      const month = date.toLocaleString("id-ID", { month: "short", year: "numeric" });
      trendDataMap[month] = (trendDataMap[month] || 0) + 1;
    }
  });
  const trendData = Object.keys(trendDataMap).reverse().map(key => ({
    name: key,
    Pendaftar: trendDataMap[key]
  }));

  const handleExportExcel = () => {
    if (filteredUMKM.length === 0) {
      triggerToast("Tidak ada data untuk di-export.");
      return;
    }

    const exportData = filteredUMKM.map((u, index) => ({
      "No": index + 1,
      "Nama Usaha": u.business_name,
      "Nama Pemilik": u.owner_name,
      "NIK": u.nik || "-",
      "No. WhatsApp": u.phone ? `+${u.phone}` : "-",
      "Kategori": u.kategori?.nama || "Umum",
      "Jam Operasional": u.jam_operasional || "-",
      "Status NIB": u.nib && !['belum', 'belum ada', 'tidak', 'tidak ada', '-'].includes(u.nib.toLowerCase().trim()) ? u.nib : "Belum Ada",
      "Status Verifikasi": u.status === "APPROVED" ? "Aktif" : (u.status === "PENDING" ? "Pending" : "Ditolak"),
      "Dusun": u.dusun || "-",
      "Alamat Lengkap": u.alamat
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data UMKM");
    XLSX.writeFile(workbook, "Laporan_Data_UMKM_Desa_Winong.xlsx");
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.brandTitle}>Admin Panel</h1>
          <p className={styles.brandSub}>WebDesa Portal Winong</p>
        </div>

        <nav className={styles.sideNav}>
          <button
            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.active : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "umkm" ? styles.active : ""}`}
            onClick={() => setActiveTab("umkm")}
          >
            <span className="material-symbols-outlined">storefront</span>
            <span>Verifikasi UMKM {pendingCount > 0 && `(${pendingCount})`}</span>
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "settings" ? styles.active : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/daftar" className={styles.navItem}>
            <span className="material-symbols-outlined">add_circle</span>
            <span>Form Pendaftaran</span>
          </Link>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Admin Desa Winong</span>
              <button onClick={handleLogout} className={styles.logoutBtn} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === "dashboard" && (
          <>
            <header className={styles.header}>
              <div>
                <h2 className={styles.pageTitle}>Dashboard Admin</h2>
                <p className={styles.pageSub}>
                  Ringkasan analitik dan statistik data UMKM Desa Winong.
                </p>
              </div>
            </header>

            <section className={styles.statsGrid}>
              <div className={`glass-card ${styles.statCard} ${styles.borderPrimary}`}>
                <div className={styles.statCardTop}>
                  <div className={`${styles.iconWrap} ${styles.iconPrimary}`}>
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <span className={`${styles.badge} ${styles.badgePrimary}`}>Total Aktif</span>
                </div>
                <p className={styles.statLabel}>UMKM Terverifikasi</p>
                <p className={styles.statValue}>{aktifCount} Unit</p>
              </div>

              <div className={`glass-card ${styles.statCard} ${styles.borderSecondary}`}>
                <div className={styles.statCardTop}>
                  <div className={`${styles.iconWrap} ${styles.iconSecondary}`}>
                    <span className="material-symbols-outlined">pending_actions</span>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeSecondary}`}>Menunggu ACC</span>
                </div>
                <p className={styles.statLabel}>Pendaftaran Pending</p>
                <p className={styles.statValue}>{pendingCount} Permohonan</p>
              </div>

              <div className={`glass-card ${styles.statCard} ${styles.borderTertiary}`}>
                <div className={styles.statCardTop}>
                  <div className={`${styles.iconWrap} ${styles.iconTertiary}`}>
                    <span className="material-symbols-outlined">domain</span>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeTertiary}`}>Legalitas</span>
                </div>
                <p className={styles.statLabel}>Memiliki NIB</p>
                <p className={styles.statValue}>{umkmList.filter(u => u.nib).length} UMKM</p>
              </div>
            </section>

            <section className={styles.chartsContainer}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}><PieChartIcon size={20} /> Persebaran Kategori UMKM</h3>
                <div className={styles.chartWrapper}>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: any) => [`${value} UMKM`, "Jumlah"]} />
                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className={styles.emptyChart}>Belum ada data kategori.</p>
                  )}
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}><TrendingUp size={20} /> Tren Pendaftaran UMKM</h3>
                <div className={styles.chartWrapper}>
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#777" }} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#777" }} />
                        <RechartsTooltip cursor={{ stroke: "#d4dfc9", strokeWidth: 2 }} />
                        <Line type="monotone" dataKey="Pendaftar" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className={styles.emptyChart}>Belum ada data pendaftaran.</p>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "umkm" && (
          <>
            <header className={styles.header}>
              <div>
                <h2 className={styles.pageTitle}>Panel Verifikasi & Data UMKM</h2>
                <p className={styles.pageSub}>
                  Verifikasi keaslian pendaftaran warga Desa Winong sebelum diterbitkan di Katalog Publik.
                </p>
              </div>
              <Link href="/daftar" className="btn btn-primary btn-pill">
                <span className="material-symbols-outlined">add</span>
                + Tambah Data UMKM
              </Link>
            </header>

            <section className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <h3 className={styles.tableTitle}>Daftar Verifikasi UMKM</h3>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className={`btn ${statusFilter === "Semua" ? "btn-primary" : "btn-outline"}`}
                      style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                      onClick={() => setStatusFilter("Semua")}
                    >
                      Semua
                    </button>
                    <button
                      className={`btn ${statusFilter === "Pending" ? "btn-primary" : "btn-outline"}`}
                      style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                      onClick={() => setStatusFilter("Pending")}
                    >
                      Pending ({pendingCount})
                    </button>
                    <button
                      className={`btn ${statusFilter === "Aktif" ? "btn-primary" : "btn-outline"}`}
                      style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                      onClick={() => setStatusFilter("Aktif")}
                    >
                      Aktif ({aktifCount})
                    </button>
                  </div>
                </div>

                <div className={styles.searchWrapper}>
                  <button 
                    onClick={handleExportExcel} 
                    className="btn btn-outline" 
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                    title="Unduh data tabel saat ini ke format Excel"
                  >
                    <Download size={16} /> Export Excel
                  </button>
                  
                  <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
                  <input
                    type="text"
                    placeholder="Cari pemilik, nama usaha, atau alamat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              <div className={styles.tableResponsive}>
                {isLoading ? (
                  <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Memuat data UMKM...
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>NO</th>
                        <th>NAMA PEMILIK</th>
                        <th>ALAMAT USAHA</th>
                        <th>NAMA USAHA / KATEGORI</th>
                        <th>STATUS NIB</th>
                        <th>STATUS VERIFIKASI</th>
                        <th style={{ textAlign: "center" }}>AKSI VERIFIKASI (ACC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUMKM.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                            Tidak ada data yang sesuai filter.
                          </td>
                        </tr>
                      ) : filteredUMKM.map((umkm, idx) => (
                        <tr key={umkm.id}>
                          <td><strong>{idx + 1}</strong></td>
                          <td>
                            <span className={styles.ownerTextBold}>{umkm.owner_name}</span>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>WA: +{umkm.phone}</div>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>NIK: {umkm.nik}</div>
                          </td>
                          <td>
                            <span className={styles.addressText}>{umkm.alamat}</span>
                            {umkm.latitude && (
                              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "#166534" }}>
                                <MapPin size={12} /> GPS Presisi Terdaftar
                              </span>
                            )}
                          </td>
                          <td>
                            <div className={styles.businessCell}>
                              <span className={styles.businessName}>{umkm.business_name}</span>
                              <span className={styles.categoryPill}>{umkm.kategori?.nama || "Umum"}</span>
                            </div>
                          </td>
                          <td>
                            <span
                              className={
                                umkm.nib && !['belum', 'belum ada', 'tidak', 'tidak ada', '-'].includes(umkm.nib.toLowerCase().trim())
                                  ? styles.nibBadgeAda
                                  : styles.nibBadgeTidak
                              }
                            >
                              {umkm.nib && !['belum', 'belum ada', 'tidak', 'tidak ada', '-'].includes(umkm.nib.toLowerCase().trim()) ? umkm.nib : "Belum Ada"}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "999px",
                                fontSize: "0.75rem",
                                fontWeight: "700",
                                backgroundColor: umkm.status === "APPROVED" ? "rgba(21, 66, 18, 0.12)" : "rgba(245, 158, 11, 0.15)",
                                color: umkm.status === "APPROVED" ? "#154212" : "#B45309",
                              }}
                            >
                              {umkm.status === "APPROVED" ? (
                                <><CheckCircle size={14} /> Aktif (Terbit)</>
                              ) : (
                                <><Clock size={14} /> Pending Verifikasi</>
                              )}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionsCell}>
                              <Link
                                href={`/admin/umkm/${umkm.id}`}
                                className="btn btn-outline"
                                style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}
                                title="Lihat Detail & Verifikasi"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</span>
                                Detail
                              </Link>

                              {umkm.status === "PENDING" ? (
                                <button
                                  className="btn btn-primary"
                                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                                  onClick={() => handleApprove(umkm.id, umkm.business_name)}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check_circle</span>
                                  ACC
                                </button>
                              ) : (
                                <span style={{ fontSize: "0.8rem", color: "#154212", fontWeight: "600" }}>Terverifikasi</span>
                              )}

                              <button
                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                onClick={() => handleReject(umkm.id, umkm.business_name)}
                                title="Tolak / Hapus"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === "settings" && (
          <section style={{ padding: "2rem", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-xl)" }}>
            <h3>Pengaturan Aplikasi</h3>
            <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Halaman pengaturan saat ini belum tersedia.</p>
          </section>
        )}
      </main>

      {showToast && (
        <div className={styles.toast}>
          <CheckCircle size={20} style={{ color: "#9DD090" }} />
          <span>{toastMessage}</span>
          <button onClick={() => setShowToast(false)} className={styles.toastClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
