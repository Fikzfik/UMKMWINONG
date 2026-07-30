"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import UMKMCard, { UMKMData } from "@/components/UMKMCard/UMKMCard";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

export default function Home() {
  const heroBadgeRef = useRef<HTMLSpanElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const heroActionsRef = useRef<HTMLDivElement>(null);
  
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const overlayImgRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);

  const whyImgRef = useRef<HTMLImageElement>(null);
  const whySectionRef = useRef<HTMLDivElement>(null);
  
  const [unggulanUMKM, setUnggulanUMKM] = useState<UMKMData[]>([]);

  useEffect(() => {
    const fetchUMKM = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("umkm")
        .select("id, business_name, description, logo_url, nib, kategori(nama), produk(foto), galeri(image)")
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data && !error) {
        setUnggulanUMKM(data as any);
      }
    };
    fetchUMKM();
  }, []);

  useEffect(() => {
    // GSAP ScrollTrigger Animations
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.gsap) {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        if (ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
        }

        // ----------------------------------------------------
        // 1. HERO SECTION ENTRANCE ANIMATIONS
        // ----------------------------------------------------
        const tlHero = gsap.timeline();
        tlHero
          .fromTo(
            heroBadgeRef.current,
            { opacity: 0, scale: 0.8, y: -20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
          )
          .fromTo(
            heroTitleRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.3"
          )
          .fromTo(
            heroDescRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.5"
          )
          .fromTo(
            heroActionsRef.current?.children || [],
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)" },
            "-=0.4"
          );

        // Parallax background on Hero
        gsap.to(`.${styles.heroBgImage}`, {
          yPercent: 25,
          ease: "none",
          scrollTrigger: {
            trigger: `.${styles.hero}`,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // ----------------------------------------------------
        // 2. VISI KAMI SECTION - DUAL IMAGE CURTAIN + COUNTER REVEAL
        // ----------------------------------------------------
        if (overlayImgRef.current && aboutSectionRef.current) {
          gsap.fromTo(
            overlayImgRef.current,
            { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)" },
            {
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              ease: "none",
              scrollTrigger: {
                trigger: aboutSectionRef.current,
                start: "top 80%",
                end: "center 45%",
                scrub: 0.8,
              },
            }
          );
        }

        // About Text & Stats Entrance
        gsap.fromTo(
          `.${styles.aboutTextCol} > *`,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `.${styles.aboutTextCol}`,
              start: "top 80%",
            },
          }
        );

        // Counter Animated Text
        if (stat1Ref.current && stat2Ref.current) {
          gsap.fromTo(
            { val: 0 },
            { val: 150 },
            {
              val: 150,
              duration: 2,
              ease: "power1.out",
              scrollTrigger: {
                trigger: stat1Ref.current,
                start: "top 90%",
              },
              onUpdate: function () {
                if (stat1Ref.current) stat1Ref.current.innerText = Math.floor(this.targets()[0].val) + "+";
              },
            }
          );
          gsap.fromTo(
            { val: 0 },
            { val: 12 },
            {
              val: 12,
              duration: 1.8,
              ease: "power1.out",
              scrollTrigger: {
                trigger: stat2Ref.current,
                start: "top 90%",
              },
              onUpdate: function () {
                if (stat2Ref.current) stat2Ref.current.innerText = Math.floor(this.targets()[0].val).toString();
              },
            }
          );
        }

        // ----------------------------------------------------
        // 3. KATEGORI UNGGULAN - 3D FLIP STAGGER
        // ----------------------------------------------------
        gsap.fromTo(
          `.gsap-cat-card`,
          { opacity: 0, y: 50, rotateX: 25 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.gsap-cat-grid`,
              start: "top 80%",
            },
          }
        );

        // ----------------------------------------------------
        // 4. UMKM PILIHAN (BENTO GRID) - ROTATED SLIDE UP
        // ----------------------------------------------------
        gsap.fromTo(
          `.gsap-umkm-card`,
          { opacity: 0, y: 60, scale: 0.92, rotate: -2 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: `.${styles.grid3}`,
              start: "top 80%",
            },
          }
        );

        // ----------------------------------------------------
        // 5. MENGAPA MEMBELI PRODUK LOKAL - FEATURE ITEMS STAGGER & PARALLAX
        // ----------------------------------------------------
        gsap.fromTo(
          `.${styles.whyItem}`,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.${styles.whyList}`,
              start: "top 80%",
            },
          }
        );

        // Photo zoom effect on scroll
        if (whyImgRef.current && whySectionRef.current) {
          gsap.fromTo(
            whyImgRef.current,
            { scale: 1.2 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: whySectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        // ----------------------------------------------------
        // 6. NEWSLETTER / CTA SECTION - BOUNCE POP
        // ----------------------------------------------------
        gsap.fromTo(
          `.${styles.ctaSection} .container`,
          { opacity: 0, scale: 0.9, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: `.${styles.ctaSection}`,
              start: "top 85%",
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
            <span ref={heroBadgeRef} className={styles.heroBadge}>
              Pemberdayaan UMKM Desa
            </span>
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

      {/* 2. ABOUT / VISI SECTION (WITH GSAP DUAL-IMAGE OVERLAY CURTAIN REVEAL) */}
      <section
        ref={aboutSectionRef}
        className={`section-padding tertiary-bg ${styles.aboutSection}`}
      >
        <div className="container">
          <div className={styles.aboutGrid}>
            {/* DUAL IMAGE OVERLAY STACK WITH GSAP REVEAL */}
            <div className={styles.aboutImageCol}>
              <div className={`organic-shadow ${styles.dualImageContainer}`}>
                {/* PHOTO 1: BASE IMAGE (Pengrajin Tradisional) */}
                <div className={styles.baseImgWrap}>
                  <img
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Pengrajin Desa Winong"
                    className={styles.aboutImage}
                  />
                  <span className={styles.imgBadge}>1. Proses Tradisional</span>
                </div>

                {/* PHOTO 2: OVERLAY IMAGE (Tertimpa dari atas saat scroll) */}
                <div ref={overlayImgRef} className={styles.overlayImgWrap}>
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Hasil Produk Kerajinan Premium"
                    className={styles.aboutImage}
                  />
                  <span className={styles.imgBadgeOverlay}>2. Hasil Produk Premium</span>
                </div>
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
                  <span ref={stat1Ref} className={styles.statNum}>
                    0+
                  </span>
                  <span className={styles.statLabel}>Mitra UMKM</span>
                </div>
                <div className={styles.statItem}>
                  <span ref={stat2Ref} className={styles.statNum}>
                    0
                  </span>
                  <span className={styles.statLabel}>Kategori Produk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KATEGORI UNGGULAN SECTION */}
      <section className={`section-padding ${styles.catSection}`}>
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
      <section className={`section-padding ${styles.featuredSection}`}>
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
              <div key={umkm.id} className="gsap-umkm-card">
                <UMKMCard umkm={umkm} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY SUPPORT LOCAL SECTION (PRIMARY DEEP GREEN BG WITH PARALLAX) */}
      <section ref={whySectionRef} className={`section-padding ${styles.whySection}`}>
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
                  ref={whyImgRef}
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
      <section className={`section-padding tertiary-bg ${styles.ctaSection}`}>
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
