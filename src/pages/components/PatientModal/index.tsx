import { Button, Stack, TextField } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { usePatients } from '../../hooks/usePatients';

import styles from './styles.module.scss';
import Image from 'next/image';


interface PatientModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function PatientModal({ isOpen, onRequestClose }: PatientModalProps) {
  const { createPatient, updatePatient, selectedPatient } = usePatients();
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (Object.keys(selectedPatient).length !== 0) {
      setId(selectedPatient.id);
      setName(selectedPatient.name);
      setBirthDate(selectedPatient.birthDate);
      setEmail(selectedPatient.email);
    } else {
      setId(0);
      setName('');
      setBirthDate(null);
      setEmail('');
    }
  }, [selectedPatient])

  function handleChangeBirthDate(newBirthDate: Date | null) {
    setBirthDate(newBirthDate);
  }

  async function handleCreateNewPatient(event: FormEvent) {
    event.preventDefault();
    await createPatient({
      name,
      birthDate,
      email
    })

    setName('');
    setEmail('');
    setBirthDate(null);
    onRequestClose();
  }
  async function handleUpdatePatient(event: FormEvent) {
    event.preventDefault();
    await updatePatient({
      id,
      name,
      birthDate,
      email
    })

    setId(0);
    setName('');
    setEmail('');
    setBirthDate(null);
    onRequestClose();
    // setselectedPatient()
  }

  return (

    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      overlayClassName="reactModalOverlay"
      className="reactModalContent"
    >
      <button
        type="button"
        onClick={onRequestClose}
        className="reactModalClose"
      >
        <Image
          src="/images/close.svg"
          alt="Fechar modal"
          width={40}
          height={40}
        />
      </button>
      <form
        onSubmit={
          selectedPatient.id
            ? handleUpdatePatient
            : handleCreateNewPatient
        }
        className={styles.patientModalContentForm}
      >
        <h2>Dados do Paciente</h2>

        <Stack spacing={3}>
          <TextField
            id="outlined-basic"
            label="Nome"
            variant="outlined"
            required
            value={name}
            onChange={event => setName(event.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}
          >
            <DesktopDatePicker
              label="Data de nascimento"
              inputFormat="dd/MM/yyyy"
              maxDate={new Date()}
              value={birthDate}
              onChange={handleChangeBirthDate}
              renderInput={(params) => <TextField {...params} required />}
            />
          </LocalizationProvider>
          <Button
            type="submit"
            variant="contained"
            color="info"
          >
            Salvar
          </Button>
        </Stack>

      </form>
    </Modal >
  )
}