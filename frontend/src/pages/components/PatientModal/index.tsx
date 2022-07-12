import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';
import { apiSearchAddress } from '../../../services/api';
import pt from 'date-fns/locale/pt';
import { Box, Button, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  DesktopDatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { usePatients } from '../../hooks/usePatients';
import styles from './styles.module.scss';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInputText } from '../FormControl/FormInputText';

interface PatientModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

interface AddressFormatInput {
  street: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

interface IFormInput {
  textValue: string;
  radioValue: string;
  checkboxValue: string[];
  dateValue: Date;
  dropdownValue: string;
  sliderValue: number;
}

const defaultValues = {
  textValue: "",
  radioValue: "",
  checkboxValue: [],
  dateValue: new Date(),
  dropdownValue: "",
  sliderValue: 0,
};

export function PatientModal({ isOpen, onRequestClose }: PatientModalProps) {
  const { createPatient, updatePatient, selectedPatient } = usePatients();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isValidBirthDate, setIsValidBirthDate] = useState(true);
  const [email, setEmail] = useState('');

  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isValidZipCode, setIsValidZipCode] = useState(true);

  useEffect(() => {
    setId(selectedPatient?.id || '');
    setStreet(selectedPatient.address?.street || '');
    setName(selectedPatient?.name || '');
    setBirthDate(selectedPatient?.birthDate || null);
    setEmail(selectedPatient?.email || '');
    setDistrict(selectedPatient.address?.district || '');
    setCity(selectedPatient.address?.city || '');
    setState(selectedPatient.address?.state || '');
    setZipCode(selectedPatient.address?.zipCode || '');
    setIsValidBirthDate(true);
  }, [selectedPatient]);

  useEffect(() => {
    if (zipCode.length === 8) {
      apiSearchAddress.get(`${zipCode}/json`).then(addressResult => {
        if (!addressResult.data.erro) {
          setStreet(addressResult.data.logradouro);
          setDistrict(addressResult.data.bairro);
          setCity(addressResult.data.localidade);
          setState(addressResult.data.uf);
          setIsValidZipCode(true);
        } else {
          setIsValidZipCode(false);
        }
      });
    } else if (zipCode.length > 0) {
      setIsValidZipCode(false);
    }
  }, [zipCode]);

  function onChangeBirthDate(newBirthDate: Date | null) {
    setBirthDate(newBirthDate);
  }

  async function handleCreateNewPatient(event: FormEvent) {
    event.preventDefault();

    const address: AddressFormatInput = {
      street: street,
      district: district,
      city: city,
      state: state,
      zipCode: zipCode,
    }

    if (isValidBirthDate && isValidZipCode) {
      await createPatient({
        name,
        birthDate,
        email,
        address
      })
      closeModal();
    }
  }

  async function handleUpdatePatient(event: FormEvent) {
    event.preventDefault();

    const address: AddressFormatInput = {
      street: street,
      district: district,
      city: city,
      state: state,
      zipCode: zipCode,
    }

    if (isValidBirthDate && isValidZipCode) {
      await updatePatient({
        id,
        name,
        birthDate,
        email,
        address
      })
      closeModal();
    }
  }

  function closeModal() {
    cleanFormPatientData();
    onRequestClose();
  }

  function cleanFormPatientData() {
    setId(selectedPatient.id || '');
    setName(selectedPatient.name || '');
    setEmail(selectedPatient.email || '');
    setBirthDate(selectedPatient.birthDate || null);
    setStreet(selectedPatient.address?.street || '');
    setDistrict(selectedPatient.address?.district || '');
    setCity(selectedPatient.address?.city || '');
    setState(selectedPatient.address?.state || '');
    setZipCode(selectedPatient.address?.zipCode || '');
    setIsValidZipCode(true);
    setIsValidBirthDate(true);
  }
  const methods = useForm<IFormInput>({ defaultValues: defaultValues });
  const { handleSubmit, reset, control, setValue, watch } = methods;
  const onSubmit = (data: IFormInput) => console.log(data);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      overlayClassName="reactModalOverlay"
      className="reactModalContent"
    >
      <button
        type="button"
        onClick={closeModal}
        className="reactModalClose"
      >
        <Image
          src="/images/close.svg"
          alt="Fechar modal"
          width={40}
          height={40}
        />
      </button>
      {/* <form
        onSubmit={
          selectedPatient.id
            ? handleUpdatePatient
            : handleCreateNewPatient
        }
        className={styles.patientModalContentForm}
      > */}
        <h2>Dados do Paciente</h2>
        <Stack spacing={2}>
          <FormProvider {...methods}>
            <FormInputText name="textValue" control={control} label="Text Input" />
            <FormInputText name="oi" control={control} label="Text Input2" />

          </FormProvider>

          {/* <TextField
            id="outlined-basic"
            label="Nome"
            variant="outlined"
            size="small"
            required
            value={name}
            onChange={event => setName(event.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            size="small"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={pt}
          >
            <DesktopDatePicker
              label="Data de nascimento"
              inputFormat="dd/MM/yyyy"
              maxDate={new Date()}
              value={birthDate}
              onChange={onChangeBirthDate}
              onError={(error, date) => {
                !error && date ?
                  setIsValidBirthDate(true) :
                  setIsValidBirthDate(false)
              }}
              renderInput={(params) =>
                <TextField
                  {...params}
                  required
                  size="small"
                  helperText={
                    !isValidBirthDate ?
                      'Formato de data inválido.' :
                      ''
                  }
                  inputProps={
                    {
                      ...params.inputProps,
                      placeholder: "dd/mm/aaaa"
                    }
                  }
                />
              }
            />
          </LocalizationProvider>
          <Box className={styles.boxContainer}>
            <TextField
              id="outlined-basic"
              label="CEP"
              variant="outlined"
              size="small"
              error={!isValidZipCode}
              helperText={
                !isValidZipCode ?
                  'CEP inválido.' :
                  ''
              }
              required
              value={zipCode}
              onChange={event => {
                setZipCode(event.target.value.replace(/\D/g, ""));
              }}
              inputProps={{ maxLength: 8 }}
            />
            <TextField
              id="outlined-basic"
              label="UF"
              variant="outlined"
              size="small"
              required
              value={state}
              inputProps={{ maxLength: 2 }}
              onChange={event => setState(event.target.value)}
            />
          </Box>
          <TextField
            id="outlined-basic"
            label="Rua"
            variant="outlined"
            size="small"
            required
            value={street}
            onChange={event => setStreet(event.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Bairro"
            variant="outlined"
            size="small"
            required
            value={district}
            onChange={event => setDistrict(event.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Cidade"
            variant="outlined"
            size="small"
            required
            value={city}
            onChange={event => setCity(event.target.value)}
          /> */}
          <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
            {" "}
            Submit{" "}
          </Button>
          {/* <Button
            type="submit"
            variant="contained"
            size="small"
            color="info"
          > Salvar </Button> */}
        </Stack>
      {/* </form> */}
    </Modal >
  )
}