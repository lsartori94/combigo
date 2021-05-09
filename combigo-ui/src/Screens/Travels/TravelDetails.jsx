import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  Button,
  BackButton,
  SmallCrossIcon,
  SavedIcon,
  Combobox,
  FormField,
  Checkbox
} from 'evergreen-ui';

import { LEGAL_STATUS, TRAVEL_STATES } from '../../constants.js';

import {
  getTravelDetails,
  saveTravelDetails,
  createTravel,
  getAvailableDrivers,
  getAvailableAditionals,
  getAvailableVehicles
} from './travelsStore';

export const TravelDetails = () => {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    dateAndTime: "",
    route: "",
    passengers: [
      {
        id: "",
        legalStatus: LEGAL_STATUS.PENDING
      }
    ],
    driver: "",
    vehicle: "",
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: []
  });
  const [oldDetails, setOldDetails] = useState({});
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableAdditionals, setAvailableAdditionals] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [noTravel, setNoTravel] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState({
    dateAndTime: "",
    route: "",
    passengers: [
      {
        id: "",
        legalStatus: LEGAL_STATUS.PENDING
      }
    ],
    driver: "",
    vehicle: "",
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: []
  });
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const drivers = await getAvailableDrivers();
      const additionals = await getAvailableAditionals();
      const vehicles = await getAvailableVehicles();
      setAvailableDrivers(drivers);
      setAvailableAdditionals(additionals);
      setAvailableVehicles(vehicles);
    }
    if (travelId === 'add') {
      setNoTravel(false);
      setCreating(true);
      setLoading(false);
      initializeExtras();
      return;
    };
    async function initialize() {
      try {
        setLoading(true);
        const response = await getTravelDetails(travelId);
        setNoTravel(false);
        setDetails(response);
        setOldDetails(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId]);
  
  useEffect(() => {
    const prev = JSON.stringify(oldDetails);
    const act = JSON.stringify(details);
    const auxErrors = {};
    if (prev !== act) {
      setFormDirty(true);
      for (const [key, value] of Object.entries(details)) {
        switch (key) {
          default:
            if (!value) {
              auxErrors[key] = true;
            } else {
              auxErrors[key] = false;
            }
            break;
        }
      }
      setErrors({...auxErrors});
    } else {
      setFormDirty(false);
    }
  }, [details, oldDetails]);

  const inputCallback = (e, name, skipValidation) => {
    if (skipValidation) {
      setDetails({...details, [name]: e});
    } else {
      const {value} = e.target;
      switch (name) {
        case 'dateAndTime':
          setDetails({...details, dateAndTime: value});
        break;
        case 'route':
          setDetails({...details, route: value});
        break;
        case 'passengers':
          setDetails({...details, passengers: value});
        break;
        case 'driver':
          setDetails({...details, driver: value});
        break;
        case 'vehicle':
          setDetails({...details, vehicle: value});
        break;
        case 'status':
          setDetails({...details, status: value});
        break;
        case 'availableAdditionals':
          setDetails({...details, availableAdditionals: value});
        break;
        default:
        break;
      }
    }
  }

  const handleCheckbox = (e) => {
    const {checked, id} = e.target;
    let newAdditionals;

    if (!checked) {
      newAdditionals = [...details.availableAdditionals.filter(el => el !== id)];
    } else {
      newAdditionals = [...details.availableAdditionals, id];
    }
    setDetails({...details, availableAdditionals: newAdditionals});
  }

  const restoreForm = () => {
    setDetails(oldDetails);
  }

  const saveCallback = async () => {
    if (Object.values(errors).find(val => val)) {
      setShowErrors(true);
      return;
    } else {
      setShowErrors(false);
    }
    try {
      setLoading(true);
      if (creating) {
        await createTravel(details);
      } else {
        await saveTravelDetails(details);
      }
      setLoading(false);
      history.push('/travels');
    } catch (e) {
      setApiError(e.message)
      setSaveError(true);
      setLoading(false);
    }
  }

  const backCallback = () => {
    history.push('/travels');
  }

  const renderAdditionals = () => {
    return availableAdditionals.map(elem => {
      const checked = details.availableAdditionals.find(
        el => el === elem.id
      );
      return (
        <li key={elem.id}>
          <Checkbox
            label={elem.name}
            marginLeft={10}
            id={elem.id}
            checked={checked ? true : false}
            onChange={e => handleCheckbox(e)}
          />
        </li>)
      });
  }

  const renderDetails = (details) => {
    if (noTravel) {
      return (<div>No existe Ruta</div>)
    }
    return (
      <Pane
        marginTop={20}
        marginBottom={100}
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
            disabled
            description="Autogenerada por el sistema"
            value={details.id}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.dateAndTime ? "Campo Requerido" : null}
            label="Fecha y Hora"
            value={details.dateAndTime}
            onChange={e => inputCallback(e, 'dateAndTime')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.route ? "Campo Requerido" : null}
            label="Ruta"
            description="La Ruta ya debe existir en el sistema"
            value={details.route}
            onChange={e => inputCallback(e, 'route')}
          />
          <TextInputField
            width={'65vh'}
            required
            validationMessage={showErrors && errors.passengers ? "Campo Requerido" : null}
            label="Pasajeros"
            value={details.passengers}
            onChange={e => inputCallback(e, 'passengers')}
          />
          <FormField
            width={'65vh'}
            marginBottom={20}
            label="Chofer"
            description="El Chofer ya debe existir en el sistema"
            required
          >
            <Combobox
              items={availableDrivers}
              initialSelectedItem={availableDrivers.find(elem => elem.id === details.driver)}
              label="Chofer"
              onChange={value => inputCallback(value.id, 'driver', true)}
              placeholder="Chofer"
              itemToString={item => item ? `${item.name} (${item.id})` : ''}
            />
          </FormField>
          <FormField
            width={'65vh'}
            marginBottom={20}
            label="Vehiculo"
            description="El vehiculo ya debe existir en el sistema"
            required
          >
            <Combobox
              items={availableVehicles}
              initialSelectedItem={availableVehicles.find(elem => elem.id === details.vehicle)}
              onChange={value => inputCallback(value.id, 'vehicle', true)}
              placeholder="Vehiculo"
              itemToString={item => item ? `${item.name} (${item.id})` : ''}
            />
          </FormField>
          <FormField
            width={'65vh'}
            marginBottom={20}
            label="Adicionales"
            description="El adicional ya debe existir en el sistema"
            required
          >
            <Pane display="flex" flexWrap="wrap">
              <ul>
                {renderAdditionals()}
              </ul>
            </Pane>
          </FormField>
          <TextInputField
            width={'65vh'}
            disabled
            validationMessage={showErrors && errors.status ? "Campo Requerido" : null}
            label="Estado"
            placeholder="Pendiente"
            value={TRAVEL_STATES[details.status]}
            onChange={e => inputCallback(e, 'status')}
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
            disabled={!formDirty}
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
