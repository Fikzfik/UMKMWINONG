import styles from './StatCard.module.css';

interface Props {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

export default function StatCard({ value, label, icon }: Props) {
  return (
    <div className={styles.card}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.value}>{value}</h3>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
