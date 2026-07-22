import { beritaData } from "@/data/berita";
import styles from "./page.module.css";
import NewsCard from "@/components/NewsCard/NewsCard";

export const metadata = {
  title: 'Berita & Pengumuman | Desa Winong',
  description: 'Kumpulan berita dan pengumuman terbaru dari Pemerintah Desa Winong.'
};

export default function BeritaPage() {
  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Berita Desa</h1>
          <p className={styles.subtitle}>Informasi terkini dan pengumuman resmi dari Pemerintah Desa Winong.</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className={styles.grid}>
            {beritaData.map(berita => (
              <NewsCard key={berita.id} berita={berita} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
