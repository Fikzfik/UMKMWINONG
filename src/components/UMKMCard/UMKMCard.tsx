import Link from 'next/link';
import styles from './UMKMCard.module.css';

export interface UMKMData {
  id: string;
  business_name: string;
  description: string;
  logo_url: string | null;
  nib: string | null;
  kategori?: { nama: string };
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Kuliner: { bg: 'rgba(45, 90, 39, 0.15)', text: '#154212' },
  Kerajinan: { bg: 'rgba(125, 86, 45, 0.15)', text: '#7D562D' },
  Fashion: { bg: 'rgba(250, 237, 205, 0.8)', text: '#623F18' },
  Pertanian: { bg: 'rgba(59, 105, 52, 0.15)', text: '#154212' },
  Jasa: { bg: 'rgba(0, 119, 182, 0.15)', text: '#0077B6' },
  Perdagangan: { bg: 'rgba(249, 168, 37, 0.15)', text: '#B7791F' },
};

const fallbackImages: Record<string, string> = {
  Kuliner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  Kerajinan: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  Fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  Pertanian: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  Jasa: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  Perdagangan: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  Umum: 'https://images.unsplash.com/photo-1598442879685-6f81e355c3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

export default function UMKMCard({ umkm }: { umkm: UMKMData }) {
  const katNama = umkm.kategori?.nama || 'Umum';
  const badgeStyle = categoryColors[katNama] || categoryColors['Kuliner'];

  const productPhoto = umkm.produk && umkm.produk.length > 0 && umkm.produk[0].foto ? umkm.produk[0].foto : null;
  const galeriPhoto = umkm.galeri && umkm.galeri.length > 0 ? umkm.galeri[0].image : null;
  const categoryFallback = fallbackImages[katNama] || fallbackImages['Umum'];
  const coverSrc = productPhoto || galeriPhoto || umkm.logo_url || categoryFallback;
  const hasSeparateLogo = (productPhoto || galeriPhoto) && umkm.logo_url;

  return (
    <div className={`organic-shadow hover-lift ${styles.card}`}>
      <div className={styles.imageWrapper}>
        <img src={coverSrc} alt={umkm.business_name} className={styles.image} />
        {umkm.nib && <span className={styles.nibBadge}>⭐ Terverifikasi</span>}
        {hasSeparateLogo && (
          <img src={umkm.logo_url as string} alt="Logo" className={styles.cardLogo} />
        )}
      </div>
      <div className={styles.body}>
        <span 
          className={styles.categoryBadge} 
          style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
        >
          {katNama}
        </span>
        <h3 className={styles.title}>{umkm.business_name}</h3>
        <p className={styles.desc}>{umkm.description}</p>
        <Link href={`/umkm/${umkm.id}`} className={styles.button}>
          Kunjungi Toko
        </Link>
      </div>
    </div>
  );
}
