import Image from 'next/image';
import styles from './styles.module.scss';

export function Header() {
  return (
    <>
      <header
        className={styles.headerContent}
      >
        <Image src="/images/medcloud.svg" alt="Logo Medcloud" width={358} height={47} />
      </header>
    </>
  )
}