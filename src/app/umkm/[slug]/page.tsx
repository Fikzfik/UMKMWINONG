import Link from "next/link";
import { notFound } from "next/navigation";
import { umkmData } from "@/data/umkm";
import styles from "./page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();
  
  const umkm = umkmData.find(
    (u) => u.slug === decodedSlug || u.slug.replace(/-/g, " ") === decodedSlug
  );

  if (!umkm) return { title: "UMKM Tidak Ditemukan" };
  return {
    title: `${umkm.nama} | WebDesa Winong`,
    description: umkm.deskripsi,
  };
}

export function generateStaticParams() {
  return umkmData.map((umkm) => ({
    slug: umkm.slug,
  }));
}

export default async function UMKMDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();

  const umkm = umkmData.find(
    (u) => u.slug === decodedSlug || u.slug.replace(/-/g, " ") === decodedSlug
  );

  if (!umkm) {
    notFound();
  }

  const waLink = `https://wa.me/${umkm.kontak.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(
    umkm.nama
  )},%20saya%20tertarik%20dengan%20produk%20Anda%20di%20WebDesa%20Winong.`;

  // Dynamic Google Maps Search & Directions Link based on UMKM Address
  const fullAddressQuery = `${umkm.alamat}, Desa Winong, Kec. Gemarang, Kab. Madiun`;
  const gmapsDirLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddressQuery)}`;
  const gmapsEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddressQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const heroImg =
    umkm.foto && umkm.foto[0] && umkm.foto[0].startsWith("http")
      ? umkm.foto[0]
      : "https://images.unsplash.com/photo-1598442879685-6f81e355c3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  return (
    <>
      {/* 1. BUSINESS HEADER BANNER */}
      <section className={styles.heroSection}>
        <div className={styles.heroBanner}>
          <img src={heroImg} alt={umkm.nama} className={styles.heroBg} />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={`container ${styles.headerOverlap}`}>
          <div className={styles.headerFlex}>
            <div className={`organic-shadow ${styles.logoCard}`}>
              <img src={heroImg} alt={umkm.nama} className={styles.logoImg} />
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.businessTitle}>{umkm.nama}</h1>
              <div className={styles.categoryBadgeRow}>
                <span className={`material-symbols-outlined ${styles.verifyIcon}`}>verified</span>
                <span className={styles.categoryBadgeText}>Kategori: {umkm.kategori}</span>
                {umkm.nib === "Ada" && (
                  <span className={styles.nibBadgeHeader}>NIB Terverifikasi</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CERITA DI BALIK PRODUK */}
      <section className="section-padding">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyTextCol}>
              <h2 className={styles.storyHeading}>Cerita di Balik Produk</h2>
              <div className={styles.storyContent}>
                <p>{umkm.deskripsi}</p>
                <p>
                  "Bagi kami, setiap karya bukan sekadar produk komersial, melainkan wujud melestarikan tradisi desa dan meningkatkan kesejahteraan keluarga." — {umkm.pemilik}
                </p>
              </div>

              <div className={styles.featureBadges}>
                <div className={styles.badgeItem}>
                  <span className="material-symbols-outlined">eco</span>
                  <span>Bahan Alami</span>
                </div>
                <div className={styles.badgeItem}>
                  <span className="material-symbols-outlined">groups</span>
                  <span>Pemberdayaan Warga</span>
                </div>
                <div className={styles.badgeItem}>
                  <span className="material-symbols-outlined">workspace_premium</span>
                  <span>Kualitas Desa Winong</span>
                </div>
              </div>
            </div>

            <div className={styles.storyImgCol}>
              <div className={`organic-shadow ${styles.storyImgCard}`}>
                <img
                  src={
                    umkm.foto && umkm.foto[1] && umkm.foto[1].startsWith("http")
                      ? umkm.foto[1]
                      : "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  }
                  alt="Proses Pembuatan Usaha"
                  className={styles.storyImg}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KOLEKSI UNGGULAN GALLERY */}
      <section className="section-padding" style={{ backgroundColor: "var(--surface-container-low)" }}>
        <div className="container">
          <div className={styles.galleryHeader}>
            <div>
              <h2 className={styles.galleryHeading}>Koleksi Unggulan</h2>
              <p className={styles.gallerySub}>Karya terbaik dari tangan pengrajin kami.</p>
            </div>
            <Link href="/umkm" className={styles.backLink}>
              Lihat Semua UMKM &rarr;
            </Link>
          </div>

          <div className={styles.productGrid}>
            {/* Product 1 */}
            <div className={`hover-lift ${styles.productCard}`}>
              <div className={styles.productImgWrap}>
                <img
                  src={heroImg}
                  alt="Produk Utama"
                  className={styles.productImg}
                />
              </div>
              <div className={styles.productBody}>
                <span className={styles.productTag}>Best Seller</span>
                <h3 className={styles.productTitle}>Produk Spesial {umkm.nama}</h3>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>Rp 25.000</span>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.cartBtn}>
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className={`hover-lift ${styles.productCard}`}>
              <div className={styles.productImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Produk 2"
                  className={styles.productImg}
                />
              </div>
              <div className={styles.productBody}>
                <span className={styles.productTag}>Paket Hemat</span>
                <h3 className={styles.productTitle}>Paket Oleh-Oleh khas Winong</h3>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>Rp 65.000</span>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.cartBtn}>
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className={`hover-lift ${styles.productCard}`}>
              <div className={styles.productImgWrap}>
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Produk 3"
                  className={styles.productImg}
                />
              </div>
              <div className={styles.productBody}>
                <span className={styles.productTag}>Custom Order</span>
                <h3 className={styles.productTitle}>Pesanan Khusus / Grosir</h3>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>Hubungi Penjual</span>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.cartBtn}>
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HUBUNGI PENJUAL & INTEGRASI GOOGLE MAPS */}
      <section className="section-padding" id="lokasi-gmaps">
        <div className="container">
          <div className={`organic-shadow ${styles.contactBox}`}>
            <div className={styles.contactInfoCol}>
              <h2 className={styles.contactTitle}>Hubungi Penjual & Lokasi</h2>
              <p className={styles.contactSub}>
                Ingin datang langsung ke tempat usaha atau berkonsultasi dengan {umkm.pemilik}? Gunakan petunjuk peta di bawah ini.
              </p>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={`material-symbols-outlined ${styles.contactIcon}`}>location_on</span>
                  <div>
                    <h4 className={styles.contactItemTitle}>Alamat Usaha</h4>
                    <p className={styles.contactItemDesc}>{fullAddressQuery}</p>
                    
                    {/* TOMBOL GOOGLE MAPS DIRECTION */}
                    <a
                      href={gmapsDirLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.gmapsActionLink}
                    >
                      <span className="material-symbols-outlined">near_me</span>
                      Buka Petunjuk Arah di Google Maps App
                    </a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <span className={`material-symbols-outlined ${styles.contactIcon}`}>schedule</span>
                  <div>
                    <h4 className={styles.contactItemTitle}>Jam Operasional</h4>
                    <p className={styles.contactItemDesc}>Senin - Sabtu: 08.00 - 17.00 WIB</p>
                  </div>
                </div>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary ${styles.waActionBtn}`}
              >
                <span className="material-symbols-outlined">chat_bubble</span>
                Chat WhatsApp ({umkm.kontak})
              </a>
            </div>

            {/* DYNAMIC GOOGLE MAPS EMBEDDED IFRAME */}
            <div className={styles.mapCol}>
              <div className={styles.mapCard}>
                <iframe
                  title={`Map ${umkm.nama}`}
                  src={gmapsEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
