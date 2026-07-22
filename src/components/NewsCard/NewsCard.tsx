import Image from 'next/image';
import Link from 'next/link';
import styles from './NewsCard.module.css';
import { Berita } from '@/data/berita';

export default function NewsCard({ berita }: { berita: Berita }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image 
          src={berita.foto} 
          alt={berita.judul} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image} 
        />
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{berita.tanggal}</span> &bull; <span>{berita.penulis}</span>
        </div>
        <h3 className={styles.title}>
          <Link href={`/berita/${berita.slug}`}>{berita.judul}</Link>
        </h3>
        <p className={styles.desc}>{berita.ringkasan}</p>
      </div>
    </div>
  );
}
