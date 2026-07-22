"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { umkmData } from "@/data/umkm";
import UMKMCard from "@/components/UMKMCard/UMKMCard";

const KATEGORI_LIST = ['Semua Kategori', 'Kuliner', 'Kerajinan', 'Fashion', 'Pertanian', 'Jasa', 'Perdagangan'];
const SORT_LIST = ['Terbaru', 'Unggulan', 'A - Z'];

export default function UMKMPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua Kategori");
  const [sort, setSort] = useState("Terbaru");

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap) {
      window.gsap.fromTo(
        `.${styles.grid} > *`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [kategori, search, sort]);

  const filteredUMKM = umkmData.filter((umkm) => {
    const matchesSearch =
      umkm.nama.toLowerCase().includes(search.toLowerCase()) ||
      umkm.deskripsi.toLowerCase().includes(search.toLowerCase());
    const matchesKategori = kategori === "Semua Kategori" || umkm.kategori === kategori;
    return matchesSearch && matchesKategori;
  });

  if (sort === "Unggulan") {
    filteredUMKM.sort((a, b) => (b.unggulan ? 1 : 0) - (a.unggulan ? 1 : 0));
  } else if (sort === "A - Z") {
    filteredUMKM.sort((a, b) => a.nama.localeCompare(b.nama));
  }

  return (
    <>
      {/* BANNER HEADER */}
      <div className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={`container ${styles.headerContent}`}>
          <span className={styles.headerBadge}>Direktori Produk & Jasa</span>
          <h1 className={styles.title}>Katalog UMKM Desa Winong</h1>
          <p className={styles.subtitle}>
            Jelajahi karya otentik dan produk unggulan hasil olahan warga Desa Winong yang penuh dengan kearifan lokal.
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ paddingTop: "0" }}>
        <div className="container">
          {/* FILTER BAR OVERLAP */}
          <div className={`organic-shadow ${styles.filterBar}`}>
            <div className={styles.filterGroup}>
              <label>Cari Produk / Bisnis</label>
              <input
                type="text"
                placeholder="Ketik nama UMKM atau produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.filterGroup}>
              <label>Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className={styles.selectField}
              >
                {KATEGORI_LIST.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>Urutkan</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={styles.selectField}
              >
                {SORT_LIST.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RESULTS META HEADER */}
          <div className={styles.resultsHeader}>
            <p>
              Menampilkan <strong>{filteredUMKM.length}</strong> unit UMKM{" "}
              {kategori !== "Semua Kategori" && `untuk kategori "${kategori}"`}
            </p>
          </div>

          {/* GRID PRODUCT */}
          {filteredUMKM.length > 0 ? (
            <>
              <div className={styles.grid}>
                {filteredUMKM.map((umkm) => (
                  <UMKMCard key={umkm.id} umkm={umkm} />
                ))}
              </div>

              {/* PAGINATION */}
              <div className={styles.pagination}>
                <button className={styles.pageBtn} disabled>
                  &lt;
                </button>
                <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>&gt;</button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <span className={`material-symbols-outlined ${styles.emptyIcon}`}>search_off</span>
              <h3>UMKM Tidak Ditemukan</h3>
              <p>Maaf, tidak ada produk atau UMKM yang cocok dengan filter pencarian Anda.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setKategori("Semua Kategori");
                }}
                className="btn btn-outline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
