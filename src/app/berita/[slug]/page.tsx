import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { beritaData } from "@/data/berita";
import styles from "./page.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const berita = beritaData.find(b => b.slug === resolvedParams.slug);
  if (!berita) return { title: 'Berita Tidak Ditemukan' };
  
  return {
    title: `${berita.judul} | Berita Desa Winong`,
    description: berita.ringkasan,
    openGraph: {
      title: `${berita.judul} | Berita Desa Winong`,
      description: berita.ringkasan,
      images: [
        {
          url: berita.foto,
          width: 800,
          height: 600,
          alt: berita.judul,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${berita.judul} | Berita Desa Winong`,
      description: berita.ringkasan,
      images: [berita.foto],
    },
  };
}

export function generateStaticParams() {
  return beritaData.map((berita) => ({
    slug: berita.slug,
  }));
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const berita = beritaData.find(b => b.slug === resolvedParams.slug);
  
  if (!berita) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <Link href="/berita" className={styles.backLink}>&larr; Kembali ke Berita</Link>
            <h1 className={styles.title}>{berita.judul}</h1>
            <div className={styles.meta}>
              <span>{berita.tanggal}</span>
              <span className={styles.dot}>&bull;</span>
              <span>Oleh: {berita.penulis}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.mainContent}>
          <div className={styles.imageWrapper}>
            <Image src={berita.foto} alt={berita.judul} fill className={styles.image} />
          </div>
          
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: berita.konten }}
          />
        </div>
      </div>
    </article>
  );
}
