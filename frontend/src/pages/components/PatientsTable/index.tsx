import { Button } from '@mui/material';
import { DataGrid, GridValueGetterParams, ptBR } from '@mui/x-data-grid';
import { usePatients } from '../../hooks/usePatients';
import { formatDate } from '../../../util/format'
import styles from './styles.module.scss';

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

interface PatientsTableProps {
  onOpenPatientModal: () => void;
}

function getFullAddress(params: GridValueGetterParams) {
  return `
    ${params.row.address.street || ''} -
    ${params.row.address.district || ''}.
  `;
}
function getCity(params: GridValueGetterParams) {
  return `${params.row.address.city || ''}`;
}

function getZipCode(params: GridValueGetterParams) {
  return `${params.row.address.zipCode || ''}`;
}
function getState(params: GridValueGetterParams) {
  return `${params.row.address.state || ''}`;
}

const columns = [
  {
    field: 'name',
    headerName: 'Nome',
    minWidth: 250
  },
  {
    field: 'birthDate',
    headerName: 'Data de Nascimento',
    width: 150,
    valueFormatter: (params) => formatDate(new Date(params.value))
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 300
  },
  {
    field: 'address',
    headerName: 'Endereço',
    minWidth: 400,
    valueGetter: getFullAddress,
  },
  {
    field: 'zipCode',
    headerName: 'CEP',
    width: 100,
    valueGetter: getZipCode,
  },
  {
    field: 'city',
    headerName: 'Cidade',
    width: 100,
    valueGetter: getCity,
  },
  {
    field: 'state',
    headerName: 'Estado',
    width: 100,
    valueGetter: getState,
  }
];

export function PatientsTable({ onOpenPatientModal }: PatientsTableProps) {
  const {
    patients,
    selectedPatient,
    setselectedPatient,
    removePatient
  } = usePatients();

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
      > Cadastrar </Button>

      {
        selectedPatient.id ?
          (
            <>
              <Button
                onClick={handleUpdatePatient}
                variant="contained"
                size="small"
                color="warning"
              > Editar </Button>
              <Button
                onClick={handleRemovePatient}
                variant="contained"
                size="small"
                color="error"
              > Remover </Button>
            </>
          ) : ''
      }

      <DataGrid
        className={styles.patientsTableContainer}
        rows={patients}
        columns={columns}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
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
    </div>
  )
}
