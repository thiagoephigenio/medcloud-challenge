import { useState } from 'react'
import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import { PatientsProvider } from './hooks/usePatients'
import { PatientModal } from './components/PatientModal'
import 'react-toastify/dist/ReactToastify.css';
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
      <ToastContainer autoClose={3000} />
      <Component {...pageProps} onOpenPatientModal={handleOpenPatientModal} />
      <PatientModal
        isOpen={isPatientModalOpen}
        onRequestClose={handleClosePatientModal} />
    </PatientsProvider >
  )
}
export default MyApp
