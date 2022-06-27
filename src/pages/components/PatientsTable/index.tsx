import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { usePatients } from '../../hooks/usePatients';
// import * as locale from '@mui/material/locale'

import styles from './styles.module.scss';


interface Patient {
  id: number;
  name: string;
  birthDate: Date;
  email: string;
}

interface PatientsTableProps {
  onOpenPatientModal: () => void;
}

const columns = [
  { field: 'name', headerName: 'Nome', width: 250 },
  {
    field: 'birthDate', headerName: 'Data de Nascimento', width: 150, valueFormatter: (params) =>
      new Intl.DateTimeFormat('pt-BR').format(
        new Date(params.value)
      )
  },
  { field: 'email', headerName: 'Email', width: 300 }
];

export function PatientsTable({ onOpenPatientModal }: PatientsTableProps) {
  const { patients, selectedPatient, setselectedPatient, removePatient } = usePatients();

  function handleCreateNewPatient() {
    setselectedPatient({} as Patient);
    onOpenPatientModal();
  }

  function handleUpdatePatient() {
    onOpenPatientModal();
  }

  function handleRemovePatient() {
    removePatient()
  }

  return (
    <div style={{ height: 500, width: '100%' }} className={styles.patientsTableContainer}>
      <Button
        onClick={handleCreateNewPatient}
        variant="contained"
        size="small"
        color="info"
      >
        Cadastrar
      </Button>

      {
        selectedPatient.id ?
          (
            <>
              <Button
                onClick={handleUpdatePatient}
                variant="contained"
                size="small"
                color="warning"
              >
                Editar
              </Button>
              <Button
                onClick={handleRemovePatient}
                variant="contained"
                size="small"
                color="error"
              >
                Remover
              </Button>
            </>
          ) : ''
      }

      <DataGrid
        className={styles.patientsTableContainer}
        rows={patients}
        columns={columns}
        // disableColumnSelector
        // pageSize={5}
        // rowsPerPageOptions={[5,100, 200]}
        onSelectionModelChange={(id) => {
          const selectedID = new Set(id);
          const [selectedRow] = patients.filter((row) =>
            selectedID.has(row.id),
          );
          selectedRow
            ? setselectedPatient(selectedRow)
            : setselectedPatient({} as Patient)
        }}
      />
      {/* <pre style={{ fontSize: 10 }}>
        {JSON.stringify(selectedPatient, null, 4)}
      </pre> */}
    </div>
  )
}
