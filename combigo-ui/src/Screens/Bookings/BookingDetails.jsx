import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  FormField,
  Checkbox,
  BackButton
} from 'evergreen-ui';

import { TRAVEL_STATES } from '../../constants.js';
import { useAuth } from "../../utils/use-auth"; //For bookings

import {
  getTravelDetails,
  getAvailableAditionals,
  getAvailableRoutes
} from './BookingsStore';

export const BookingDetails = () => {
  let { travelId } = useParams();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    dateAndTime: "",
    route: {
      origin: "",
      destination: ""
    },
    passengers: [],
    status: TRAVEL_STATES.NOT_STARTED,
    availableAdditionals: []
  });
  const [availableAdditionals, setAvailableAdditionals] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [noTravel, setNoTravel] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const additionals = await getAvailableAditionals();
      const routes = await getAvailableRoutes();
      setAvailableAdditionals(additionals);
      setAvailableRoutes(routes);
    }
    if (travelId === 'add') {
      setNoTravel(false);
      setLoading(false);
      return;
    };
    async function initialize() {
      try {
        setLoading(true);
        const response = await getTravelDetails(travelId);
        setNoTravel(false);
        setDetails(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId]);

  const backCallback = () => {
    history.push('/Bookings');
  }

  const renderAdditionals = () => {
    return availableAdditionals.map(elem => {
      const checked = (auth.user.travelHistory.boughtAdditionals).find(
        el => el === elem.id
      );
      return (
        <li key={elem.id}>
          <Checkbox
            label={elem.name}
            marginLeft={10}
            id={elem.id}
            checked={checked ? true : false}
            disabled
          />
        </li>)
      });
  }

  const mapRoute = () => {
    const route = availableRoutes.find(elem => elem.id === details.route) || {};
    return `${route.origin}/${route.destination}`;
  };

  const renderDetails = (details) => {
    if (noTravel) {
      return (<div>No existe la reserva</div>)
    }
    return (
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={100}
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
        <TextInputField
          width={'65vh'}
          label="Tiempo de salida"
          value={details.dateAndTime}
          disabled
        />
        <TextInputField
          width={'65vh'}
          label="Ruta"
          value={mapRoute()} 
          disabled
        />
        <TextInputField
          width={'65vh'}
          label="Chofer"
          value={details.driver}
          disabled
        />
        <TextInputField
          width={'65vh'}
          label="Vehiculo"
          value={details.vehicle}
          disabled
        />
        <TextInputField
          width={'65vh'}
          label="Estado de la reserva"
          value={auth.user.travelHistory.find(th => th.travelId === details.id).status}
          disabled
        />
        <FormField
            width={'65vh'}
            marginBottom={20}
            label="Adicionales"
          description="Adicionales comprados" //Cambiar a los adicionales comprados
          required
        >
          <Pane display="flex" flexWrap="wrap">
            <ul>
              {renderAdditionals()}
            </ul>
          </Pane>
          </FormField>
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
