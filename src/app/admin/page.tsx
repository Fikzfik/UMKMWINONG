"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { umkmData } from "@/data/umkm";

export default function AdminPage() {
  const [showToast, setShowToast] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("umkm");

  const filteredUMKM = umkmData.filter(
    (u) =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.pemilik.toLowerCase().includes(search.toLowerCase()) ||
      u.alamat.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

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
            <span>Data UMKM Desa</span>
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
            <span>Tambah Data UMKM</span>
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
            <h2 className={styles.pageTitle}>Manajemen Data UMKM Desa Winong</h2>
            <p className={styles.pageSub}>
              Pendataan unit usaha mikro, kecil, dan menengah di Kecamatan Gemarang, Kab. Madiun.
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
                <span className="material-symbols-outlined">groups</span>
              </div>
              <span className={`${styles.badge} ${styles.badgePrimary}`}>+12%</span>
            </div>
            <p className={styles.statLabel}>Total UMKM Terdaftar</p>
            <p className={styles.statValue}>148 Unit</p>
          </div>

          <div className={`glass-card ${styles.statCard} ${styles.borderSecondary}`}>
            <div className={styles.statCardTop}>
              <div className={`${styles.iconWrap} ${styles.iconSecondary}`}>
                <span className="material-symbols-outlined">verified</span>
              </div>
              <span className={`${styles.badge} ${styles.badgeSecondary}`}>85%</span>
            </div>
            <p className={styles.statLabel}>Memiliki NIB</p>
            <p className={styles.statValue}>126 UMKM</p>
          </div>

          <div className={`glass-card ${styles.statCard} ${styles.borderTertiary}`}>
            <div className={styles.statCardTop}>
              <div className={`${styles.iconWrap} ${styles.iconTertiary}`}>
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <span className={`${styles.badge} ${styles.badgeTertiary}`}>+28%</span>
            </div>
            <p className={styles.statLabel}>Kunjungan Profil Bulan Ini</p>
            <p className={styles.statValue}>8.432 Kali</p>
          </div>
        </section>

        {/* TABLE SECTION (Matching Word Document Format) */}
        <section className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Data Master UMKM (Desa Winong)</h3>
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
                  <th style={{ width: "50px" }}>NO</th>
                  <th>NAMA PEMILIK</th>
                  <th>ALAMAT USAHA</th>
                  <th>JENIS USAHA / KATEGORI</th>
                  <th>PEMASARAN / NIB</th>
                  <th>NO. HP</th>
                  <th style={{ textAlign: "center" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUMKM.map((umkm, idx) => (
                  <tr key={umkm.id}>
                    <td><strong>{idx + 1}</strong></td>
                    <td>
                      <span className={styles.ownerTextBold}>{umkm.pemilik}</span>
                    </td>
                    <td>
                      <span className={styles.addressText}>{umkm.alamat}</span>
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
                        {umkm.nib || "Ada"}
                      </span>
                    </td>
                    <td>
                      <a href={`https://wa.me/${umkm.kontak}`} target="_blank" rel="noopener noreferrer" className={styles.phoneLink}>
                        {umkm.kontak}
                      </a>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button className={styles.actionBtn} onClick={handleAction} title="Edit">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={handleAction}
                          title="Hapus"
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
            <span>Menampilkan 1-{filteredUMKM.length} dari 148 UMKM (Dokumen Resmi Desa Winong)</span>
            <div className={styles.pagination}>
              <button disabled className={styles.pageBtn}>
                &lt;
              </button>
              <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
              <button className={styles.pageBtn}>2</button>
              <button className={styles.pageBtn}>3</button>
              <button className={styles.pageBtn}>&gt;</button>
            </div>
          </div>
        </section>
      </main>

      {/* NOTIFICATION TOAST */}
      {showToast && (
        <div className={styles.toast}>
          <span className="material-symbols-outlined" style={{ color: "#9DD090" }}>
            check_circle
          </span>
          <span>Data UMKM berhasil diperbarui di database Desa Winong.</span>
          <button onClick={() => setShowToast(false)} className={styles.toastClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
