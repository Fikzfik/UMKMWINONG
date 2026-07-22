import styles from "./Footer.module.css";
import { desaInfo } from "@/data/desa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.column}>
          <h3 className={styles.title}>Desa {desaInfo.nama}</h3>
          <p className={styles.desc}>{desaInfo.deskripsi}</p>
        </div>
        <div className={styles.column}>
          <h4 className={styles.subtitle}>Kontak</h4>
          <p className={styles.text}>{desaInfo.kontak.alamat}</p>
          <p className={styles.text}>Email: {desaInfo.kontak.email}</p>
          <p className={styles.text}>Telp: {desaInfo.kontak.telepon}</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Pemerintah Desa {desaInfo.nama}, Kec. {desaInfo.kecamatan}, Kab. {desaInfo.kabupaten}. All rights reserved.</p>
      </div>
    </footer>
  );
}
