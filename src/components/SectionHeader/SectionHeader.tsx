import styles from './SectionHeader.module.css';

interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = false }: Props) {
  return (
    <div className={`${styles.header} ${centered ? styles.centered : ''}`}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.line}></div>
    </div>
  );
}
