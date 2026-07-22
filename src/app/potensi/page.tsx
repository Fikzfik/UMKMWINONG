import Image from "next/image";
import styles from "./page.module.css";
import SectionHeader from "@/components/SectionHeader/SectionHeader";

export const metadata = {
  title: 'Potensi Desa | UMKM Winong',
  description: 'Menjelajahi potensi alam, wisata, dan sumber daya Desa Winong.'
};

export default function PotensiPage() {
  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Potensi Desa</h1>
          <p className={styles.subtitle}>Kekayaan alam dan sumber daya manusia yang menjadi roda penggerak ekonomi Desa Winong.</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className={styles.potensiItem}>
            <div className={styles.imageWrapper}>
              <Image src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Pertanian Kopi" fill className={styles.image} />
            </div>
            <div className={styles.content}>
              <SectionHeader title="Perkebunan Kopi Robusta" />
              <p>Lereng Gunung Wilis memberikan anugerah berupa tanah yang subur dan iklim yang cocok untuk budidaya kopi robusta. Mayoritas warga Desa Winong berprofesi sebagai petani kopi. Kopi Robusta Winong memiliki cita rasa yang khas dan kini mulai dipasarkan secara luas melalui UMKM lokal.</p>
            </div>
          </div>

          <div className={`${styles.potensiItem} ${styles.reverse}`}>
            <div className={styles.imageWrapper}>
              <Image src="https://images.unsplash.com/photo-1623880628286-455bba9bdfbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kerajinan Tangan" fill className={styles.image} />
            </div>
            <div className={styles.content}>
              <SectionHeader title="Sentra Kerajinan Bambu" />
              <p>Ketersediaan bahan baku bambu yang melimpah dimanfaatkan oleh warga untuk membuat berbagai macam kerajinan tangan. Mulai dari perabotan rumah tangga, anyaman, hingga hiasan estetik. Sentra kerajinan bambu ini juga menyerap banyak tenaga kerja lokal dan menekan angka pengangguran.</p>
            </div>
          </div>

          <div className={styles.potensiItem}>
            <div className={styles.imageWrapper}>
              <Image src="https://images.unsplash.com/photo-1542314831-c6a4d14eff48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Wisata Alam" fill className={styles.image} />
            </div>
            <div className={styles.content}>
              <SectionHeader title="Potensi Wisata Alam" />
              <p>Desa Winong memiliki pemandangan alam yang asri dengan udara pegunungan yang sejuk. Terdapat beberapa titik air terjun kecil dan jalur pendakian ringan yang saat ini sedang dikembangkan oleh Kelompok Sadar Wisata (Pokdarwis) untuk menjadi destinasi wisata alam keluarga.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
