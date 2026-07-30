"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide main Navbar on Admin Panel
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/Logo-Madiun.gif" 
            alt="Logo Madiun" 
            width={40} 
            height={40} 
            style={{ objectFit: "contain" }}
          />
          <span className={styles.logoText}>WebDesa</span>
          <span className={styles.logoBadge}>Winong</span>
        </Link>
        
        {/* Desktop Links */}
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
          
          {/* Hamburger Button (Mobile Only) */}
          <button 
            className={styles.hamburgerBtn} 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileMenuHeader}>
          <span className={styles.logoText}>WebDesa</span>
          <button className={styles.closeBtn} onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className={styles.mobileLinks}>
          <Link href="/" className={`${styles.mobileLink} ${pathname === "/" ? styles.active : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/umkm" className={`${styles.mobileLink} ${pathname.startsWith("/umkm") ? styles.active : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
            Catalog
          </Link>
          <Link href="/about" className={`${styles.mobileLink} ${pathname === "/about" || pathname === "/profil" ? styles.active : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
            About
          </Link>
          <Link href="/daftar" className={`${styles.mobileLink} ${pathname === "/daftar" ? styles.active : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
            Daftar UMKM
          </Link>
        </div>
        
        <div className={styles.mobileFooter}>
          <Link href="/admin" className="btn btn-primary" style={{ width: "100%", textAlign: "center" }} onClick={() => setIsMobileMenuOpen(false)}>
            Admin Login
          </Link>
        </div>
      </div>
    </header>
  );
}
