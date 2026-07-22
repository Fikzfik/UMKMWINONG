import Link from 'next/link';
import styles from './UMKMCard.module.css';
import { UMKM } from '@/data/umkm';

const categoryColors: Record<string, { bg: string; text: string }> = {
  Kuliner: { bg: 'rgba(45, 90, 39, 0.15)', text: '#154212' },
  Kerajinan: { bg: 'rgba(125, 86, 45, 0.15)', text: '#7D562D' },
  Fashion: { bg: 'rgba(250, 237, 205, 0.8)', text: '#623F18' },
  Pertanian: { bg: 'rgba(59, 105, 52, 0.15)', text: '#154212' },
  Jasa: { bg: 'rgba(0, 119, 182, 0.15)', text: '#0077B6' },
  Perdagangan: { bg: 'rgba(249, 168, 37, 0.15)', text: '#B7791F' },
};

const fallbackImages: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1598442879685-6f81e355c3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '2': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '3': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '4': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '5': 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '6': 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

export default function UMKMCard({ umkm }: { umkm: UMKM }) {
  const imgSrc = (umkm.foto && umkm.foto[0] && !umkm.foto[0].startsWith('/placeholder')) 
    ? umkm.foto[0] 
    : (fallbackImages[umkm.id] || fallbackImages['1']);

  const badgeStyle = categoryColors[umkm.kategori] || categoryColors['Kuliner'];

  return (
    <div className={`organic-shadow hover-lift ${styles.card}`}>
      <div className={styles.imageWrapper}>
        <img src={imgSrc} alt={umkm.nama} className={styles.image} />
        {umkm.unggulan && <span className={styles.unggulanBadge}>⭐ Unggulan</span>}
      </div>
      <div className={styles.body}>
        <span 
          className={styles.categoryBadge} 
          style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
        >
          {umkm.kategori}
        </span>
        <h3 className={styles.title}>{umkm.nama}</h3>
        <p className={styles.desc}>{umkm.deskripsi}</p>
        <Link href={`/umkm/${umkm.slug}`} className={styles.button}>
          Kunjungi Toko
        </Link>
      </div>
    </div>
  );
}
