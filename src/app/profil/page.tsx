import Image from "next/image";
import styles from "./page.module.css";
import { desaInfo } from "@/data/desa";
import SectionHeader from "@/components/SectionHeader/SectionHeader";

export const metadata = {
  title: `Profil Desa | ${desaInfo.nama}`,
  description: `Sejarah dan struktur pemerintahan Desa ${desaInfo.nama}.`
};

export default function ProfilPage() {
  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Profil Desa {desaInfo.nama}</h1>
          <p className={styles.subtitle}>Mengenal lebih dekat sejarah, visi misi, dan jajaran perangkat desa kami.</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className={styles.contentGrid}>
            <div>
              <SectionHeader title="Sejarah Desa" />
              <div className={styles.textBlock}>
                <p>{desaInfo.sejarah}</p>
                <p>Kini, Desa Winong terus berkembang menjadi desa mandiri dengan mengutamakan pemberdayaan ekonomi masyarakat melalui UMKM dan sektor pertanian.</p>
              </div>
            </div>
            <div className={styles.imageWrapper}>
              <Image 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Pemandangan Desa" 
                fill 
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`section-padding ${styles.bgLight}`}>
        <div className="container">
          <SectionHeader title="Struktur Perangkat Desa" centered subtitle="Para abdi masyarakat yang berdedikasi untuk kemajuan Desa Winong." />
          <div className={styles.perangkatGrid}>
            {desaInfo.perangkat?.map((p, index) => (
              <div key={index} className={styles.perangkatCard}>
                <div className={styles.fotoWrapper}>
                  <div className={styles.fotoPlaceholder}>
                    {p.nama.charAt(0)}
                  </div>
                </div>
                <h3 className={styles.nama}>{p.nama}</h3>
                <p className={styles.jabatan}>{p.jabatan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
