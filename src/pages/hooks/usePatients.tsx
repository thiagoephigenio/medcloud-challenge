import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../../services/api';

const rows = [
  {
    id: 1,
    email: 'Snow', name: 'Jon', birthDate: new Date('2015-08-18T21:11:54')
  },
  {
    id: 2, email: 'Lannister', name: 'Cersei', birthDate: new Date('2021-08-18T21:11:54')
  },
  {
    id: 3, email: 'Lannister', name: 'Jaime', birthDate: new Date('2000-08-18T21:11:54')
  },
  {
    id: 4, email: 'Stark', name: 'Arya', birthDate: new Date('1997-08-18T21:11:54')
  },
  {
    id: 5, email: 'Targaryen', name: 'Daenerys', birthDate: new Date('2015-08-18T21:11:54')
  },
  {
    id: 6, email: 'Melisandre', name: 'asdasd', birthDate: new Date('2008-08-18T21:11:54')
  },
  {
    id: 7, email: 'Clifford', name: 'Ferrara', birthDate: new Date('2003-08-18T21:11:54')
  },
  {
    id: 8, email: 'Frances', name: 'Rossini', birthDate: new Date('2015-08-18T21:11:54')
  },
  {
    id: 9, email: 'Roxie', name: 'Harvey', birthDate: new Date('2015-08-18T21:11:54')
  },
];

interface Patient {
  id: number;
  name: string;
  birthDate: Date;
  email: string;
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
    setPatients(rows)
    // api.get('').then(
    //   response => {
    //     setPatients(
    //       response.data.patients
    //     )
    //   }
    // )
  }, []);

  async function createPatient(patientIput: PatientInput) {
    const id = patients[patients.length - 1].id;
    const newPatient = { ...patientIput, id: id + 1 }
    setPatients([
      ...patients,
      newPatient
    ])
    if (selectedPatient) {
      api.post('patients', patientIput).then(
        response => {
          const { patient } = response.data;

          setPatients([
            ...patients,
            patient
          ])
        }
      )
    }
  }

  async function updatePatient(patientIput: Patient) {
    const newPatients = patients.map(patient =>
      patient.id === patientIput.id
        ? patientIput
        : patient
    )
    setPatients(newPatients)
    setselectedPatient({} as Patient)
    // setPatients([
    //   ...patients,
    //   newPatient
    // ])


    // api.put('patients', patientIput).then(
    //   response => {
    //     const { patient } = response.data;

    //     setPatients([
    //       ...patients,
    //       patient
    //     ])
    //   }
    // )
  }

  async function removePatient() {
    const storegedPatients = patients;

    const newPatients = storegedPatients.filter(
      patient => patient.id !== selectedPatient.id
    )
    setPatients(newPatients)
      
    // api.delete('patients', {
    //   data: patientIput
    // })
  }

  return (
    <PatientsContext.Provider
      value={
        { patients, selectedPatient, setselectedPatient, createPatient, updatePatient, removePatient }
      }>
      {children}
    </PatientsContext.Provider>
  )
}

export function usePatients() {
  const context = useContext(PatientsContext);

  return context;
}