import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.slug;
  
  const supabase = await createClient();
  const { data: umkm } = await supabase
    .from("umkm")
    .select("business_name, description")
    .eq("id", id)
    .single();

  if (!umkm) return { title: "UMKM Tidak Ditemukan" };
  
  return {
    title: `${umkm.business_name} | WebDesa Winong`,
    description: umkm.description,
  };
}

export default async function UMKMDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.slug;

  const supabase = await createClient();
  
  const { data: umkm, error } = await supabase
    .from("umkm")
    .select("*, kategori(nama), galeri(image), produk(*)")
    .eq("id", id)
    .single();

  if (error || !umkm) {
    notFound();
  }

  const cleanPhone = umkm.phone?.replace(/[^0-9]/g, "") || "";
  const waLink = `https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(
    umkm.business_name
  )},%20saya%20tertarik%20dengan%20produk%20Anda%20di%20WebDesa%20Winong.`;

  // Dynamic Google Maps Search & Directions Link based on Coordinates OR Address
  const fullAddressQuery = `${umkm.alamat}, Desa Winong, Kec. Gemarang, Kab. Madiun`;
  const locationTarget = umkm.latitude && umkm.longitude 
    ? `${umkm.latitude},${umkm.longitude}` 
    : fullAddressQuery;

  const gmapsDirLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationTarget)}`;
  const gmapsEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locationTarget)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const fallbackImages: Record<string, string> = {
    Kuliner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    Kerajinan: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    Pertanian: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    Jasa: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    Perdagangan: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    Umum: 'https://images.unsplash.com/photo-1598442879685-6f81e355c3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  };

  const katNama = umkm.kategori?.nama || 'Umum';
  const categoryFallback = fallbackImages[katNama] || fallbackImages['Umum'];

  const galeriImages = umkm.galeri?.map((g: any) => g.image) || [];
  const heroImg = galeriImages.length > 0 ? galeriImages[0] : categoryFallback;
  const logoImg = umkm.logo_url || categoryFallback;

  return (
    <>
      {/* 1. BUSINESS HEADER BANNER */}
      <section className={styles.heroSection}>
        <div className={styles.heroBanner}>
          <img src={heroImg} alt={`${umkm.business_name} Banner`} className={styles.heroBg} />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={`container ${styles.headerOverlap}`}>
          <div className={styles.headerFlex}>
            <div className={`organic-shadow ${styles.logoCard}`}>
              <img src={logoImg} alt={umkm.business_name} className={styles.logoImg} />
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.businessTitle}>{umkm.business_name}</h1>
              <div className={styles.categoryBadgeRow}>
                <span className={`material-symbols-outlined ${styles.verifyIcon}`}>verified</span>
                <span className={styles.categoryBadgeText}>Kategori: {umkm.kategori?.nama || "Umum"}</span>
                {umkm.nib && (
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
              <h2 className={styles.storyHeading}>Tentang Usaha</h2>
              <div className={styles.storyContent}>
                <p>{umkm.description}</p>
                <p>
                  Pemilik: <strong>{umkm.owner_name}</strong>
                </p>
              </div>

              <div className={styles.featureBadges}>
                <div className={styles.badgeItem}>
                  <span className="material-symbols-outlined">eco</span>
                  <span>Produk Lokal</span>
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
              <div className={styles.galleryGrid} data-multiple={galeriImages.length > 1}>
                {galeriImages.length > 0 ? (
                  galeriImages.map((img: string, idx: number) => (
                    <div key={idx} className={`organic-shadow ${styles.storyImgCard}`}>
                      <img
                        src={img}
                        alt={`Galeri ${idx + 1}`}
                        className={styles.storyImg}
                      />
                    </div>
                  ))
                ) : (
                  <div className={`organic-shadow ${styles.storyImgCard}`}>
                    <img
                      src={categoryFallback}
                      alt="Proses Pembuatan Usaha"
                      className={styles.storyImg}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KOLEKSI UNGGULAN GALLERY */}
      {umkm.produk && umkm.produk.length > 0 && (
        <section className="section-padding" style={{ backgroundColor: "var(--surface-container-low)" }}>
          <div className="container">
            <div className={styles.galleryHeader}>
              <div>
                <h2 className={styles.galleryHeading}>Katalog Produk</h2>
                <p className={styles.gallerySub}>Karya terbaik dari tangan pengrajin kami.</p>
              </div>
              <Link href="/umkm" className={styles.backLink}>
                Lihat Semua UMKM &rarr;
              </Link>
            </div>

            <div className={styles.productGrid}>
              {umkm.produk.map((prod: any, idx: number) => (
                <div key={idx} className={`hover-lift ${styles.productCard}`}>
                  <div className={styles.productImgWrap}>
                    <img
                      src={prod.foto || "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                      alt={prod.nama}
                      className={styles.productImg}
                    />
                  </div>
                  <div className={styles.productBody}>
                    <h3 className={styles.productTitle}>{prod.nama}</h3>
                    {prod.deskripsi && <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{prod.deskripsi}</p>}
                    <div className={styles.productFooter}>
                      <span className={styles.productPrice}>
                        {prod.harga ? `Rp ${prod.harga.toLocaleString('id-ID')}` : "Hubungi Penjual"}
                      </span>
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.cartBtn}>
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. HUBUNGI PENJUAL & INTEGRASI GOOGLE MAPS */}
      <section className="section-padding" id="lokasi-gmaps">
        <div className="container">
          <div className={`organic-shadow ${styles.contactBox}`}>
            <div className={styles.contactInfoCol}>
              <h2 className={styles.contactTitle}>Hubungi Penjual & Lokasi</h2>
              <p className={styles.contactSub}>
                Ingin datang langsung ke tempat usaha atau berkonsultasi dengan {umkm.owner_name}? Gunakan petunjuk peta di bawah ini.
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
                    <p className={styles.contactItemDesc}>{umkm.jam_operasional || "Setiap Hari"}</p>
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
                Chat WhatsApp ({umkm.phone})
              </a>
            </div>

            {/* DYNAMIC GOOGLE MAPS EMBEDDED IFRAME */}
            <div className={styles.mapCol}>
              <div className={styles.mapCard}>
                <iframe
                  title={`Map ${umkm.business_name}`}
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
