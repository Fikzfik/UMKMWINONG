"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  // Hide main Navbar on Admin Panel
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>WebDesa</span>
          <span className={styles.logoBadge}>Winong</span>
        </Link>
        
        <div className={styles.links}>
          <Link href="/" className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}>
            Home
          </Link>
          <Link href="/umkm" className={`${styles.link} ${pathname.startsWith("/umkm") ? styles.active : ""}`}>
            Catalog
          </Link>
          <Link href="/about" className={`${styles.link} ${pathname === "/about" || pathname === "/profil" ? styles.active : ""}`}>
            About
          </Link>
          <Link href="/daftar" className={`${styles.link} ${pathname === "/daftar" ? styles.active : ""}`}>
            Daftar UMKM
          </Link>
        </div>

        <div className={styles.actions}>
          <Link href="/admin" className={styles.adminBtn}>
            Admin Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
