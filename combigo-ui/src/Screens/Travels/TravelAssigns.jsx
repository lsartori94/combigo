import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  Spinner,
  Button,
  BackButton,
  SmallCrossIcon,
  SavedIcon,
  Combobox,
  FormField,
  Alert
} from 'evergreen-ui';

import { TRAVEL_STATES } from '../../constants.js';

import {
  getTravelDetails,
  saveTravelVehicle,
  saveTravelDriver,
  getAvailableDrivers,
  getAvailableVehicles,
  getTravels,
} from './travelsStore';
import { getRoutes } from '../Routes/routesStore.js';

export const TravelAssigns = () => {
  let { travelId } = useParams();
  let { assign } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    driver: "",
    vehicle: "",
    status: "",
    dateAndTime: ""
  });
  const [oldDetails, setOldDetails] = useState({});
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [noTravel, setNoTravel] = useState(true);
  const [formDirty, setFormDirty] = useState(false);
  const [errors, setErrors] = useState({
    driver: "",
    vehicle: "",
    status: "",
    dateAndTime: ""
  });
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [apiError, setApiError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const drivers = await getAvailableDrivers();
      const vehicles = await getAvailableVehicles();
      const allTravels = await getTravels();
      const allRoutes = await getRoutes();
      const travelDetails = await getTravelDetails(travelId);
      // si se intenta asignar chofer/combi a un viaje con ruta eliminada, este if evita que validDrivers() intente hacer cosas con rutas no activas (que la api no te devuelve)
      if (travelDetails.status === TRAVEL_STATES.NOT_STARTED) {
        setAvailableDrivers(validDrivers(drivers, allTravels, allRoutes, travelDetails));
        setAvailableVehicles(validVehicles(vehicles, allTravels, allRoutes, travelDetails));
      }
      else {
        setAvailableDrivers(drivers);
        setAvailableVehicles(vehicles);
      };
    }
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
  }, [travelId]); // eslint-disable-line
  
  useEffect(() => {
    const prev = JSON.stringify(oldDetails);
    const act = JSON.stringify(details);
    const auxErrors = {};
    if (prev !== act) {
      setFormDirty(true);
      for (const [key, value] of Object.entries(details)) {
        if (key === assign && !value) {
              auxErrors[key] = true;
            } else {
              auxErrors[key] = false;
            }
      }
      setErrors({...auxErrors});
    } else {
      setFormDirty(false);
    }
  }, [details, oldDetails]); // eslint-disable-line

  const inputCallback = (e, name, skipValidation) => {
    if (skipValidation) {
      setDetails({...details, [name]: e});
    } else {
      const {value} = e.target;
      switch (name) {
        case 'driver':
          setDetails({...details, driver: value});
        break;
        case 'vehicle':
          setDetails({...details, vehicle: value});
        break;
        default:
        break;
      }
    }
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
      if (assign === 'vehicle') {
        await saveTravelVehicle(details);
      } else {
        await saveTravelDriver(details);
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

  function validDrivers(drivers, allTravels, allRoutes, travelDetails) {
    const overlappedTravels = allTravels.filter(travel => datesOverlap(travel, travelDetails, allRoutes));
    const validDrivers = drivers.filter(driver => !overlappedTravels.some( travel => travel.driver === driver.id));
    return validDrivers;
  };

  function validVehicles(vehicles, allTravels, allRoutes, travelDetails) {
    const overlappedTravels = allTravels.filter(travel => datesOverlap(travel, travelDetails, allRoutes));
    const validVehicles = vehicles.filter(veh => !overlappedTravels.some(travel => travel.vehicle === veh.id));
    return validVehicles;
  };

  function datesOverlap(travel1, travel2, allRoutes) {
    if (travel1.id === travel2.id) 
      return false;
    const route1 = allRoutes.find(route => route.id === travel1.route);
    const route2 = allRoutes.find(route => route.id === travel2.route);
    const duration1 = route1.durationMin * 60000;
    const duration2 = route2.durationMin * 60000;
    const start1 = Date.parse(travel1.dateAndTime);
    const start2 = Date.parse(travel2.dateAndTime);
    const end1 = start1 + duration1;
    const end2 = start2 + duration2;
    if ((start1 <= end2) && (end1 >= start2)) 
      return true;
    return false;
  };

  const disableTravel = (status) =>
    !(status === TRAVEL_STATES.NOT_STARTED
    || status === TRAVEL_STATES.NO_VEHICLE);

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
        {!saveError && (
        <div>

          {disableTravel(details.status) && 
          (<Alert
            title='El viaje ya finalizó, no se puede asignar un chofer o combi.'
            intent='danger'
            appearance='card'
            marginBottom={32}
          />)}

          {assign === "driver" && (  
          <FormField
            width={'65vh'}
            marginBottom={20}
            label="Chofer"
            description="El Chofer ya debe existir en el sistema"
            validationMessage={showErrors && errors.driver ? "Campo Requerido" : null}
          >
            <Combobox
              disabled={disableTravel(details.status)}
              items={availableDrivers}
              selectedItem={availableDrivers.find(elem => elem.id === details.driver)}
              label="Chofer"
              onChange={value => value ? inputCallback(value.id, 'driver', true) : ''}
              placeholder="Chofer"
              itemToString={item => item ? `${item.name} (${item.id})` : ''}
            />
          </FormField>

          )}
          {assign === "vehicle" && (
          <FormField
            width={'65vh'}
            marginBottom={20}
            label="Vehiculo"
            description="El vehiculo ya debe existir en el sistema"
            validationMessage={showErrors && errors.vehicle ? "Campo Requerido" : null}
          >
            <Combobox
              disabled={disableTravel(details.status)}
              items={availableVehicles}
              selectedItem={availableVehicles.find(elem => elem.id === details.vehicle)}
              onChange={value => value ? inputCallback(value.id, 'vehicle', true) : ''}
              placeholder="Vehiculo"
              itemToString={item => item ? `${item.name} (${item.id})` : ''}
            />
          </FormField>
          )}
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
