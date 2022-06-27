import { AppProps } from 'next/app'
import { useState } from 'react'
import { PatientModal } from './components/PatientModal'
import { PatientsProvider } from './hooks/usePatients'
import '../../styles/global.scss'


function MyApp({ Component, pageProps }: AppProps) {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  function handleOpenPatientModal() {
    setIsPatientModalOpen(true);
  }
  function handleClosePatientModal() {
    setIsPatientModalOpen(false);
  }

  return (
    <PatientsProvider>
      <Component {...pageProps} onOpenPatientModal={handleOpenPatientModal}/>
      <PatientModal
        isOpen={isPatientModalOpen}
        onRequestClose={handleClosePatientModal} />
    </PatientsProvider >
  )
}
export default MyApp
