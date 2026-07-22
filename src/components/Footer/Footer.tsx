"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";
import { desaInfo } from "@/data/desa";

export default function Footer() {
  const pathname = usePathname();

  // Hide main Footer on Admin Panel
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brandCol}>
          <div className={styles.brandTitle}>WebDesa {desaInfo.nama}</div>
          <p className={styles.brandDesc}>
            Platform digital pemberdayaan ekonomi desa untuk masa depan Indonesia yang lebih mandiri dan sejahtera.
          </p>
          <div className={styles.socialIcons}>
            <span className={`material-symbols-outlined ${styles.socialBtn}`}>face_nod</span>
            <span className={`material-symbols-outlined ${styles.socialBtn}`}>public</span>
            <span className={`material-symbols-outlined ${styles.socialBtn}`}>mail</span>
          </div>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Navigasi</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/umkm">Catalog UMKM</Link></li>
              <li><Link href="/profil">Profil Desa</Link></li>
              <li><Link href="/daftar">Daftar UMKM</Link></li>
            </ul>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Informasi & Kontak</h4>
            <ul className={styles.linkList}>
              <li><a href={`mailto:${desaInfo.kontak.email}`}>{desaInfo.kontak.email}</a></li>
              <li><span>{desaInfo.kontak.telepon}</span></li>
              <li><span>Kec. {desaInfo.kecamatan}, Kab. {desaInfo.kabupaten}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomContent}`}>
          <p>&copy; {new Date().getFullYear()} WebDesa {desaInfo.nama}. Empowering Local MSMEs.</p>
        </div>
      </div>
    </footer>
  );
}
