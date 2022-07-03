import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../services/api';

interface Address {
  street: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Patient {
  id: string;
  name: string;
  birthDate: Date;
  email: string;
  address: Address;
}

type PatientInput = Omit<Patient, 'id'>;

interface PatientsContextData {
  patients: Patient[];
  selectedPatient: Patient;
  setselectedPatient: (patient: Patient) => void;
  createPatient: (patient: PatientInput) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  removePatient: () => Promise<void>;
}

interface PatientsProviderProps {
  children: ReactNode;
}

const PatientsContext = createContext<PatientsContextData>(
  {} as PatientsContextData
)

export function PatientsProvider({ children }: PatientsProviderProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setselectedPatient] = useState<Patient | null>({} as Patient);

  useEffect(() => {
    api.get('patients').then(
      response => {
        setPatients(
          response.data
        )
      }
    )
  }, []);

  async function createPatient(patientIput: PatientInput) {
    api.post('patients', patientIput).then(
      response => {
        const createdNewPatientId = response.data.id;
        const createdNewPatient = { ...patientIput, id: createdNewPatientId }

        setPatients([
          ...patients,
          createdNewPatient
        ])

        toast.success('Paciente Cadastrado com Sucesso');
      }
    )
  }

  async function updatePatient(patientIput: Patient) {
    api.put('patients', patientIput).then(
      response => {
        const updatedPatientId = response.data.id;
        
        if (response.status === 200) {
          const newPatients = patients.map(
            patient =>
              patient.id === updatedPatientId
                ? patientIput
                : patient
          )
         
          setPatients(newPatients);

          toast.success('Paciente Atualizado com Sucesso');
        }
      }
    )

    setselectedPatient({} as Patient)
  }

  async function removePatient() {
    api.delete(`patients/${selectedPatient.id}`).then(
      response => {
        if (response.status == 200) {
          const storegedPatients = patients;
          const newPatients = storegedPatients.filter(
            patient => patient.id !== selectedPatient.id
          )

          setPatients(newPatients);
          
          toast.success('Paciente Removido com Sucesso');
        }
      }
    )
  }

  return (
    <PatientsContext.Provider
      value={
        {
          patients,
          selectedPatient,
          setselectedPatient,
          createPatient,
          updatePatient,
          removePatient
        }
      }> {children} </PatientsContext.Provider>
  )
}

export function usePatients() {
  const context = useContext(PatientsContext);

  return context;
}