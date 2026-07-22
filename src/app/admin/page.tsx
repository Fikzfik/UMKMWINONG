"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { umkmData as initialUMKMData, UMKM } from "@/data/umkm";

export default function AdminPage() {
  const [umkmList, setUmkmList] = useState<(UMKM & { statusAcc?: 'Aktif' | 'Pending' })[]>(
    initialUMKMData.map((u, i) => ({
      ...u,
      statusAcc: i === 0 || i === 1 || i === 2 || i === 3 ? 'Aktif' : i % 2 === 0 ? 'Aktif' : 'Pending',
    }))
  );

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Aktif" | "Pending">("Semua");
  const [activeTab, setActiveTab] = useState("umkm");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleApprove = (id: string, nama: string) => {
    setUmkmList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, statusAcc: "Aktif" } : item))
    );
    triggerToast(`UMKM "${nama}" telah di-ACC & resmi terbit di Katalog Publik!`);
  };

  const handleReject = (id: string, nama: string) => {
    setUmkmList((prev) => prev.filter((item) => item.id !== id));
    triggerToast(`Pendaftaran UMKM "${nama}" ditolak.`);
  };

  const filteredUMKM = umkmList.filter((u) => {
    const matchesSearch =
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.pemilik.toLowerCase().includes(search.toLowerCase()) ||
      u.alamat.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || u.statusAcc === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = umkmList.filter((u) => u.statusAcc === "Pending").length;
  const aktifCount = umkmList.filter((u) => u.statusAcc === "Aktif").length;

  return (
    <div className={styles.adminLayout}>
      {/* SIDEBAR */}
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
              <Link href="/" className={styles.logoutBtn}>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        {/* HEADER SECTION */}
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

        {/* BENTO GRID STATS OVERVIEW */}
        <section className={styles.statsGrid}>
          <div className={`glass-card ${styles.statCard} ${styles.borderPrimary}`}>
            <div className={styles.statCardTop}>
              <div className={`${styles.iconWrap} ${styles.iconPrimary}`}>
                <span className="material-symbols-outlined">verified</span>
              </div>
              <span className={`${styles.badge} ${styles.badgePrimary}`}>Terbit</span>
            </div>
            <p className={styles.statLabel}>UMKM Aktif (Terverifikasi)</p>
            <p className={styles.statValue}>{aktifCount} Unit</p>
          </div>

          <div className={`glass-card ${styles.statCard} ${styles.borderSecondary}`}>
            <div className={styles.statCardTop}>
              <div className={`${styles.iconWrap} ${styles.iconSecondary}`}>
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <span className={`${styles.badge} ${styles.badgeSecondary}`}>Perlu ACC</span>
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
            <p className={styles.statValue}>126 UMKM</p>
          </div>
        </section>

        {/* TABLE SECTION (Matching Word Document Format + Approval Actions) */}
        <section className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <h3 className={styles.tableTitle}>Daftar Verifikasi UMKM</h3>
              {/* STATUS FILTER BUTTONS */}
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
                {filteredUMKM.map((umkm, idx) => (
                  <tr key={umkm.id}>
                    <td><strong>{idx + 1}</strong></td>
                    <td>
                      <span className={styles.ownerTextBold}>{umkm.pemilik}</span>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>WA: +{umkm.kontak}</div>
                    </td>
                    <td>
                      <span className={styles.addressText}>{umkm.alamat}</span>
                      {umkm.latitude && (
                        <span style={{ display: "block", fontSize: "0.7rem", color: "#166534" }}>📍 GPS Presisi Terdaftar</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.businessCell}>
                        <span className={styles.businessName}>{umkm.nama}</span>
                        <span className={styles.categoryPill}>{umkm.kategori}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={
                          umkm.nib === "Ada"
                            ? styles.nibBadgeAda
                            : styles.nibBadgeTidak
                        }
                      >
                        {umkm.nib || "Tidak"}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          backgroundColor: umkm.statusAcc === "Aktif" ? "rgba(21, 66, 18, 0.12)" : "rgba(245, 158, 11, 0.15)",
                          color: umkm.statusAcc === "Aktif" ? "#154212" : "#B45309",
                        }}
                      >
                        {umkm.statusAcc === "Aktif" ? "✅ Aktif (Terbit)" : "⏳ Pending Verifikasi"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        {umkm.statusAcc === "Pending" ? (
                          <button
                            className="btn btn-primary"
                            style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                            onClick={() => handleApprove(umkm.id, umkm.nama)}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check_circle</span>
                            ACC / Setujui
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.8rem", color: "#154212", fontWeight: "600" }}>Terverifikasi</span>
                        )}

                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleReject(umkm.id, umkm.nama)}
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
          </div>

          <div className={styles.tableFooter}>
            <span>Menampilkan {filteredUMKM.length} unit usaha terdaftar</span>
          </div>
        </section>
      </main>

      {/* NOTIFICATION TOAST */}
      {showToast && (
        <div className={styles.toast}>
          <span className="material-symbols-outlined" style={{ color: "#9DD090" }}>
            check_circle
          </span>
          <span>{toastMessage}</span>
          <button onClick={() => setShowToast(false)} className={styles.toastClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
