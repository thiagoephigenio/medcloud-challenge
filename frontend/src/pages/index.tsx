import { Header } from './components/Header'
import { PatientsTable } from './components/PatientsTable'
import styles from './home.module.scss';

interface HomeProps {
  onOpenPatientModal: () => void;
}

export default function Home({ onOpenPatientModal }: HomeProps) {
  return (
    <>
      <Header />
      <main className={styles.homeContainer}>
        <PatientsTable onOpenPatientModal={onOpenPatientModal} />
      </main>
    </>
  )
}
