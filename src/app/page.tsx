"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { umkmData } from "@/data/umkm";
import UMKMCard from "@/components/UMKMCard/UMKMCard";

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

export default function Home() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroActionsRef = useRef<HTMLDivElement>(null);
  const unggulanUMKM = umkmData.filter((u) => u.unggulan).slice(0, 3);

  useEffect(() => {
    // GSAP ScrollTrigger Animations
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.gsap) {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        if (ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
        }

        // Hero Entrance Animation
        gsap.fromTo(
          heroTitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );
        gsap.fromTo(
          heroDescRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" }
        );
        gsap.fromTo(
          heroActionsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: "power3.out" }
        );

        // Scroll reveal sections
        const sections = document.querySelectorAll(".gsap-reveal");
        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Stagger categories
        gsap.fromTo(
          ".gsap-cat-card",
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: ".gsap-cat-grid",
              start: "top 80%",
            },
          }
        );
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBgImage}></div>
        <div className={styles.heroGradient}></div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroTextWrap}>
            <h1 ref={heroTitleRef} className={styles.heroTitle}>
              Pemberdayaan UMKM Desa: Dari Akar Rumput Menuju Global
            </h1>
            <p ref={heroDescRef} className={styles.heroDesc}>
              Membangun ekosistem ekonomi digital yang inklusif untuk mendorong produk lokal Desa Winong bersaing di kancah internasional dengan tetap menjaga kearifan lokal.
            </p>
            <div ref={heroActionsRef} className={styles.heroActions}>
              <Link href="/umkm" className="btn btn-primary btn-pill">
                Jelajahi Produk
              </Link>
              <Link href="/profil" className="btn btn-outline-white btn-pill">
                Pelajari Visi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT / VISI SECTION (TERTIARY BG) */}
      <section className={`section-padding tertiary-bg gsap-reveal ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImageCol}>
              <div className={`organic-shadow ${styles.aboutImageCard}`}>
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Pengrajin Desa Winong"
                  className={styles.aboutImage}
                />
              </div>
            </div>
            <div className={styles.aboutTextCol}>
              <span className={styles.sectionBadge}>Visi Kami</span>
              <h2 className={styles.sectionHeading}>
                Menumbuhkan Kebanggaan Lokal Melalui Inovasi Digital
              </h2>
              <p className={styles.bodyText}>
                WebDesa hadir sebagai jembatan bagi para pelaku UMKM di pelosok Desa Winong untuk mengakses pasar yang lebih luas. Kami percaya bahwa produk buatan tangan dan hasil bumi desa memiliki nilai otentisitas yang tak tertandingi.
              </p>
              <p className={styles.bodyText}>
                Melalui pendampingan, standarisasi kualitas, dan platform digital yang user-friendly, kami memastikan setiap pengusaha kecil memiliki kesempatan yang sama untuk tumbuh dan memberdayakan komunitas sekitarnya.
              </p>
              <div className={styles.statGroup}>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>150+</span>
                  <span className={styles.statLabel}>Mitra UMKM</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>12</span>
                  <span className={styles.statLabel}>Kategori Produk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KATEGORI UNGGULAN SECTION */}
      <section className={`section-padding gsap-reveal ${styles.catSection}`}>
        <div className="container text-center">
          <h2 className={styles.sectionHeadingCenter}>Kategori Unggulan</h2>
          <p className={styles.sectionSubCenter}>
            Temukan keberagaman karya dan hasil bumi terbaik dari jantung Desa Winong.
          </p>
          
          <div className={`gsap-cat-grid ${styles.catGrid}`}>
            {/* Kuliner */}
            <div className={`hover-lift ${styles.catCard} gsap-cat-card`}>
              <div className={`${styles.catIconWrap} ${styles.iconPrimary}`}>
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <h3 className={styles.catTitle}>Kuliner</h3>
              <p className={styles.catSub}>Makanan Ringan & Minuman Herbal</p>
            </div>

            {/* Kerajinan */}
            <div className={`hover-lift ${styles.catCard} gsap-cat-card`}>
              <div className={`${styles.catIconWrap} ${styles.iconSecondary}`}>
                <span className="material-symbols-outlined">precision_manufacturing</span>
              </div>
              <h3 className={styles.catTitle}>Kerajinan</h3>
              <p className={styles.catSub}>Anyaman & Seni Ukir Tradisional</p>
            </div>

            {/* Fashion */}
            <div className={`hover-lift ${styles.catCard} gsap-cat-card`}>
              <div className={`${styles.catIconWrap} ${styles.iconTertiary}`}>
                <span className="material-symbols-outlined">apparel</span>
              </div>
              <h3 className={styles.catTitle}>Fashion</h3>
              <p className={styles.catSub}>Batik & Tenun Tangan Asli</p>
            </div>

            {/* Pertanian */}
            <div className={`hover-lift ${styles.catCard} gsap-cat-card`}>
              <div className={`${styles.catIconWrap} ${styles.iconGreen}`}>
                <span className="material-symbols-outlined">agriculture</span>
              </div>
              <h3 className={styles.catTitle}>Pertanian</h3>
              <p className={styles.catSub}>Hasil Bumi & Pupuk Organik</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED UMKM BENTO GRID SECTION */}
      <section className={`section-padding gsap-reveal ${styles.featuredSection}`}>
        <div className="container">
          <div className={styles.featuredHeader}>
            <div>
              <h2 className={styles.sectionHeading}>UMKM Pilihan Bulan Ini</h2>
              <p className={styles.bodyText}>Dukung pengusaha lokal yang berprestasi dan inovatif.</p>
            </div>
            <Link href="/umkm" className={styles.seeAllLink}>
              Lihat Semua <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className={styles.grid3}>
            {unggulanUMKM.map((umkm) => (
              <UMKMCard key={umkm.id} umkm={umkm} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY SUPPORT LOCAL SECTION (PRIMARY DEEP GREEN BG) */}
      <section className={`section-padding gsap-reveal ${styles.whySection}`}>
        <div className="container">
          <div className={styles.whyGrid}>
            <div className={styles.whyTextCol}>
              <h2 className={styles.whyTitle}>Mengapa Membeli Produk Lokal Desa?</h2>
              <div className={styles.whyList}>
                <div className={styles.whyItem}>
                  <span className={`material-symbols-outlined ${styles.whyIcon}`}>eco</span>
                  <div>
                    <h4 className={styles.whyItemTitle}>Berkelanjutan & Alami</h4>
                    <p className={styles.whyItemDesc}>
                      Produk kami berasal dari bahan alam yang dikelola secara bertanggung jawab tanpa merusak ekosistem desa.
                    </p>
                  </div>
                </div>

                <div className={styles.whyItem}>
                  <span className={`material-symbols-outlined ${styles.whyIcon}`}>groups</span>
                  <div>
                    <h4 className={styles.whyItemTitle}>Pemberdayaan Ekonomi</h4>
                    <p className={styles.whyItemDesc}>
                      Setiap rupiah yang Anda belanjakan langsung berdampak pada kesejahteraan keluarga petani dan pengrajin desa.
                    </p>
                  </div>
                </div>

                <div className={styles.whyItem}>
                  <span className={`material-symbols-outlined ${styles.whyIcon}`}>verified</span>
                  <div>
                    <h4 className={styles.whyItemTitle}>Kualitas Terjamin</h4>
                    <p className={styles.whyItemDesc}>
                      Kami melakukan kurasi ketat untuk memastikan setiap produk memenuhi standar kualitas nasional maupun global.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.whyImgCol}>
              <div className={`organic-shadow ${styles.whyImgCard}`}>
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Warga Desa Winong"
                  className={styles.whyImg}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER / CTA SECTION (TERTIARY BG) */}
      <section className={`section-padding tertiary-bg gsap-reveal ${styles.ctaSection}`}>
        <div className="container text-center" style={{ maxWidth: "700px" }}>
          <h2 className={styles.sectionHeadingCenter}>Jadilah Bagian dari Perubahan</h2>
          <p className={styles.sectionSubCenter} style={{ marginBottom: "2.5rem" }}>
            Dapatkan info terbaru tentang produk unik dan cerita inspiratif dari UMKM desa kami langsung di email Anda.
          </p>
          <form className={styles.ctaForm} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Alamat Email Anda"
              className={styles.ctaInput}
              required
            />
            <button type="submit" className="btn btn-primary btn-pill">
              Berlangganan
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
