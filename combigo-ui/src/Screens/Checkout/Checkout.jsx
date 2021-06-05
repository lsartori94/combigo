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
  Checkbox, 
  Alert,
  Text, 
  Strong
} from 'evergreen-ui';

import { TRAVEL_STATES } from '../../constants.js';

import {
  getAvailableAditionals,
  getAvailableRoutes
} from '../Travels/travelsStore';

import {
  getRouteDetails,
  getTravelDetails,
} from './checkoutStore';

export default function Checkout() {
  let { travelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    dateAndTime: "",
    route: "",
    availableAdditionals: []
  });
  const [availableAdditionals, setAvailableAdditionals] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [routeDetails, setRouteDetails] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const additionals = await getAvailableAditionals();
      const routes = await getAvailableRoutes();
      //const rdet = await getRouteDetails(details.route);
      setAvailableAdditionals(additionals);
      setAvailableRoutes(routes);
    }
    async function initialize() {
      try {
        setLoading(true);
        const response = await getTravelDetails(travelId);
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

  const backCallback = () => {
    history.push(history.goBack());
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

  const mapRoute = () => {
    const route = availableRoutes.find(elem => elem.id === details.route) || {};
    return `${route.origin} / ${route.destination}`;
  };

  const bookCallback = async () => {
  }

  const renderDetails = (details) => {
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
        <div>
        <div>
          <div>
            <Strong size={400}>Fecha y hora de salida: </Strong>
            <Text>{details.dateAndTime}</Text>
          </div>
          <div>
            <Strong size={400}>Ruta: </Strong>
            <Text>{mapRoute()}</Text>
          </div>
          <div>
            <Strong size={400}>Duracion estimada: </Strong>
            <Text>{}</Text>
          </div>
          <div>
            <Strong size={400}>Adicionales disponibles: </Strong>
            <Pane display="flex" flexWrap="wrap">
              <ul>{renderAdditionals()}</ul>
            </Pane>
          </div>
        </div>
          <Button
            width={'65vh'}
            display="flex"
            justifyContent="center"
            appearance="primary"
            intent="success"
            iconBefore={SavedIcon}
            onClick={() => bookCallback()}
          >
            Reservar
          </Button>
        </div>
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

