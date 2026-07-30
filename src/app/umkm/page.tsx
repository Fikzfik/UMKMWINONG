"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import UMKMCard, { UMKMData } from "@/components/UMKMCard/UMKMCard";
import { createClient } from "@/lib/supabase/client";

const KATEGORI_LIST = ['Semua Kategori', 'Kuliner', 'Kerajinan', 'Fashion', 'Pertanian', 'Jasa', 'Perdagangan'];
const SORT_LIST = ['Terbaru', 'A - Z', 'Z - A'];

export default function UMKMPage() {
  const [umkmList, setUmkmList] = useState<UMKMData[]>([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua Kategori");
  const [sort, setSort] = useState("Terbaru");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchUMKM();
  }, []);

  const fetchUMKM = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("umkm")
      .select("id, business_name, description, logo_url, nib, kategori(nama), produk(foto), galeri(image)")
      .eq("status", "APPROVED")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setUmkmList(data as any);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && !isLoading) {
      window.gsap.fromTo(
        `.${styles.grid} > *`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [kategori, search, sort, isLoading]);

  const filteredUMKM = umkmList.filter((umkm) => {
    const matchesSearch =
      umkm.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      umkm.description?.toLowerCase().includes(search.toLowerCase());
    
    const katNama = umkm.kategori?.nama || "Umum";
    const matchesKategori = kategori === "Semua Kategori" || katNama === kategori;
    
    return matchesSearch && matchesKategori;
  });

  if (sort === "A - Z") {
    filteredUMKM.sort((a, b) => a.business_name.localeCompare(b.business_name));
  } else if (sort === "Z - A") {
    filteredUMKM.sort((a, b) => b.business_name.localeCompare(a.business_name));
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={`container ${styles.headerContent}`}>
          <span className={styles.headerBadge}>Direktori Produk & Jasa</span>
          <h1 className={styles.title}>Katalog UMKM Desa Winong</h1>
          <p className={styles.subtitle}>
            Jelajahi karya otentik dan produk unggulan hasil olahan warga Desa Winong yang penuh dengan kearifan lokal. Seluruh data yang tampil di sini telah diverifikasi.
          </p>
        </div>
      </div>

      <section className={`section-padding ${styles.mainSection}`}>
        <div className={`container ${styles.layoutContainer}`}>
          
          {/* SIDEBAR FILTER (NEW DESIGN) */}
          <aside className={styles.filterSidebar}>
            <div className={`glass-card ${styles.filterCard}`}>
              <h3 className={styles.filterTitle}>Filter Pencarian</h3>
              
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Cari Nama Usaha</label>
                <div className={styles.searchWrapper}>
                  <span className="material-symbols-outlined">search</span>
                  <input
                    type="text"
                    placeholder="Ketik kata kunci..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Kategori Usaha</label>
                <div className={styles.kategoriList}>
                  {KATEGORI_LIST.map((kat) => (
                    <button
                      key={kat}
                      className={`${styles.katBtn} ${kategori === kat ? styles.katActive : ''}`}
                      onClick={() => setKategori(kat)}
                    >
                      {kat}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Urutkan Berdasarkan</label>
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
              
              <button 
                className={`btn btn-outline ${styles.resetBtn}`}
                onClick={() => { setSearch(""); setKategori("Semua Kategori"); setSort("Terbaru"); }}
              >
                Reset Filter
              </button>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className={styles.contentArea}>
            <div className={styles.resultsHeader}>
              <p>
                Menemukan <strong>{filteredUMKM.length}</strong> UMKM terverifikasi{" "}
                {kategori !== "Semua Kategori" && `untuk kategori "${kategori}"`}
              </p>
            </div>

            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Memuat data UMKM...</p>
              </div>
            ) : filteredUMKM.length > 0 ? (
              <>
                <div className={styles.grid}>
                  {filteredUMKM.map((umkm) => (
                    <UMKMCard key={umkm.id} umkm={umkm} />
                  ))}
                </div>

                <div className={styles.pagination}>
                  <button className={styles.pageBtn} disabled>
                    &lt;
                  </button>
                  <button className={`${styles.pageBtn} ${styles.pageActive}`}>1</button>
                  <button className={styles.pageBtn}>&gt;</button>
                </div>
              </>
            ) : (
              <div className={`glass-card ${styles.emptyState}`}>
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
        </div>
      </section>
    </>
  );
}
