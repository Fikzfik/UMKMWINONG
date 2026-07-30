import Image from "next/image";
import styles from "./page.module.css";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import { desaInfo } from "@/data/desa";

export const metadata = {
  title: `Tentang Kami | WebDesa UMKM ${desaInfo.nama}`,
  description: `Pelajari visi, misi, dan perjalanan platform WebDesa UMKM dalam memberdayakan masyarakat ${desaInfo.nama}.`
};

export default function AboutPage() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerOverlay}></div>
        <div className={`container ${styles.headerContent}`}>
          <h1 className={styles.title}>Tentang WebDesa</h1>
          <p className={styles.subtitle}>
            Sebuah inisiatif digital untuk mengangkat potensi lokal dan memberdayakan pengusaha kecil menengah di Desa {desaInfo.nama}.
          </p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className={styles.contentGrid}>
            <div>
              <SectionHeader title="Misi Pemberdayaan Lokal" />
              <div className={styles.textBlock}>
                <p>
                  Platform WebDesa UMKM lahir dari keresahan akan potensi luar biasa desa yang belum mendapatkan panggung yang layak di era digital. Desa {desaInfo.nama} memiliki hasil bumi, karya kerajinan tangan, dan inovasi kuliner yang pantas bersaing.
                </p>
                <p>
                  Tujuan utama kami adalah memberikan fasilitas pemasaran, pendampingan kualitas, dan wadah direktori yang menghubungkan pembeli langsung dengan pembuatnya—tanpa perantara, sehingga kesejahteraan warga bisa meningkat.
                </p>
                <p>
                  Melalui sistem yang terintegrasi, setiap produk yang tampil telah melewati proses kurasi untuk memastikan kualitas terbaik bagi Anda.
                </p>
              </div>
            </div>
            <div className={styles.imageWrapper}>
              <Image 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Pemberdayaan Masyarakat" 
                fill 
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`section-padding ${styles.bgLight}`}>
        <div className="container">
          <SectionHeader title="Tiga Pilar Utama" centered subtitle="Prinsip dasar kami dalam membangun ekosistem ekonomi desa." />
          <div className={styles.visionGrid}>
            <div className={styles.visionCard}>
              <div className={styles.iconWrapper}>
                <span className="material-symbols-outlined">verified</span>
              </div>
              <h3 className={styles.visionTitle}>Kualitas & Otentisitas</h3>
              <p className={styles.visionDesc}>Setiap produk dijaga keasliannya dan dibuat dengan sentuhan tradisi yang turun temurun.</p>
            </div>
            
            <div className={styles.visionCard}>
              <div className={styles.iconWrapper}>
                <span className="material-symbols-outlined">group_add</span>
              </div>
              <h3 className={styles.visionTitle}>Pemberdayaan Komunitas</h3>
              <p className={styles.visionDesc}>Fokus pada peningkatan kapasitas pengusaha lokal melalui pelatihan dan pendampingan.</p>
            </div>
            
            <div className={styles.visionCard}>
              <div className={styles.iconWrapper}>
                <span className="material-symbols-outlined">public</span>
              </div>
              <h3 className={styles.visionTitle}>Akses Pasar Luas</h3>
              <p className={styles.visionDesc}>Menjembatani produk lokal desa ke panggung nasional maupun pasar internasional.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
          <SectionHeader title="Ingin Usaha Anda Tampil di Sini?" centered subtitle="Bergabunglah dengan puluhan UMKM lainnya di Desa Winong dan kembangkan jangkauan pasar Anda." />
          
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>1</div>
              <h4>Isi Formulir</h4>
              <p>Lengkapi profil usaha dan informasi produk Anda secara gratis.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>2</div>
              <h4>Verifikasi</h4>
              <p>Tim admin desa akan memverifikasi keaslian data UMKM Anda.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>3</div>
              <h4>Terbit!</h4>
              <p>Usaha Anda siap dilihat oleh ribuan calon pelanggan.</p>
            </div>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <a href="/daftar" className="btn btn-primary btn-pill" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
              Daftarkan UMKM Sekarang
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
