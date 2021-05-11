import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SmallCrossIcon,
  SavedIcon
} from 'evergreen-ui';

import { getVehicleDetails, saveVehiculeDetails, createVehicle } from '../vehiclesStore';

export const VehicleDetails = () => {
  let { vehicleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [oldDetails, setOldDetails] = useState({});
  const [noVehicle, setNoVehicle] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const history = useHistory();
  const plateRegex = /^[a-z0-9]{0,8}$/i;

  useEffect(() => {
    if (vehicleId === 'add') {
      setNoVehicle(false);
      setCreating(true);
      setLoading(false);
      return;
    };
    async function initialize() {
      try {
        setLoading(true);
        const response = await getVehicleDetails(vehicleId);
        setNoVehicle(false);
        setDetails(response);
        setOldDetails(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [vehicleId]);
  
  useEffect(() => {
    const prev = JSON.stringify(oldDetails);
    const act = JSON.stringify(details);
    if (prev !== act) {
      setFormDirty(true);
      if (Object.values(details).find(val => val === "") !== undefined) {
        setErrors(true);
      } else {
        setErrors(false);
      }
    } else {
      setFormDirty(false);
    }
  }, [details, oldDetails]);

  const inputCallback = (e, name) => {
    const {value} = e.target;
    switch (name) {
      case 'name':
        setDetails({...details, name: value});
        break;
      case 'brand':
        setDetails({...details, brand: value});
        break;
      case 'plate':
        if (plateRegex.test(value)) {
          setDetails({...details, plate: value});
        }
        break;
      case 'capacity':
        if (!isNaN(+value)) {
          setDetails({...details, capacity: +value});
        }
        break;
      default:
        break;
    }
  }

  const restoreForm = () => {
    setDetails(oldDetails);
  }

  const saveCallback = async () => {
    try {
      setLoading(true);
      if (creating) {
        await createVehicle(details);
      } else {
        await saveVehiculeDetails(details);
      }
      setLoading(false);
      history.push('/vehicles');
    } catch (e) {
      setApiError(e.message)
      setSaveError(true);
      setLoading(false);
    }
  }

  const backCallback = () => {
    history.push('/vehicles');
  }

  const renderDetails = (veh) => {
    if (noVehicle) {
      return (<div>No existe Vehiculo</div>)
    }
    return (
      <Pane
        marginTop={20}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <BackButton
          appearance="minimal"
          alignSelf="flex-start"
          marginLeft={10}
          marginBottom={10}
          onClick={() => backCallback()}
        >
          Volver
        </BackButton>
        {saveError && (<div>Error al guardar: {apiError}</div>)}
        {!saveError && (<div>
          <TextInputField
            width={'65vh'}
            label="ID"
            description="Autogenerado por el sistema"
            disabled
            value={veh.id}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Nombre"
            placeholder="Nombre"
            description="Nombre del vehículo"
            value={veh.name}
            onChange={e => inputCallback(e, 'name')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Marca"
            placeholder="Marca"
            description="Marca del vehículo"
            value={veh.brand}
            onChange={e => inputCallback(e, 'brand')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Patente"
            placeholder="AAAA0000"
            description="Solo caracteres alfanumericos, maxima longitud de 8 caracteres"
            value={veh.plate}
            onChange={e => inputCallback(e, 'plate')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage="Campo Requerido"
            label="Capacidad"
            placeholder="5"
            description="Cantidad de asientos para pasajeros"
            onChange={e => inputCallback(e, 'capacity')}
            value={veh.capacity}
          />
          <Button
            width={'65vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="none"
            iconBefore={SmallCrossIcon}
            marginBottom={10}
            onClick={() => restoreForm()}
          >
            Cancelar
          </Button>
          <Button
            width={'65vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="warning"
            iconBefore={SavedIcon}
            onClick={() => saveCallback()}
            disabled={(!formDirty) || (formDirty && errors)}
          >
            Guardar
          </Button>
        </div>)}
      </Pane>
    );
  };

  return (
    <div>
      { loading && <Spinner /> }
      { !loading &&  renderDetails(details) }
    </div>
  );
};
