import './Bookings.css';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  Pane,
  TextInputField,
  Spinner,
  BackButton,
  Button,
  Dialog,
  EditIcon,
  Text, 
  Strong
} from 'evergreen-ui';

import { LEGAL_STATUS, TRAVEL_STATES } from '../../constants.js';
import { useAuth } from "../../utils/use-auth"; 

import {
  getTravelDetails,
  getAvailableRoutes,
  getBookings,
  cancelBooking
} from './BookingsStore';

export const BookingDetails = () => {
  let { travelId } = useParams();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({
    travelId: "",
    status: "",
    boughtAdditionals: [],
  });
 
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [noTravel, setNoTravel] = useState(true);
  const [travel, setTravel] = useState([]);
  const [showRefound, setShowRefound] = useState(false);
  const history = useHistory();

  useEffect(() => {
    async function initializeExtras() {
      const routes = await getAvailableRoutes();
      const travelResponse = await getTravelDetails(travelId);
      setAvailableRoutes(routes);
      setTravel(travelResponse)
    };
    async function initialize() {
      try {
        const booksResponse = await getBookings(auth.user);
        const book = booksResponse.find(b => b.travelId === travelId)
        setNoTravel(false);
        setDetails(book);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initialize();
    initializeExtras();
  }, [travelId]); // eslint-disable-line

  const backCallback = () => {
    history.push('/bookings');
  }

  const ticketCallback = () => {
    history.push(`/bookingDetails/${travelId}/ticket`);
  }

  const declarationCallback = () => {
    history.push(`/bookingDetails/${travelId}/declaration`);
  }


  const promptCancel = () => {
    setShowRefound(true);
  }

  const fullRefoundCallback = async () => {
    try {
      setLoading(true);
      await cancelBooking(travelId, auth.user.id);
      history.push('/bookings');
    } catch (e) {
      console.log(e);
    } finally {
      setShowRefound(false);
      setLoading(false);
    }
  }

  const mapRoute = () => {
    const route = availableRoutes.find(elem => elem.id === travel.route) || {};
    return `${route.origin}/${route.destination}`;
  };

  const isFullRefund = () => {
    const time = travel.dateAndTime;
    const ms = new Date(time).getTime();
    const now = Date.now();
    const diff = 48 * 60 * 60 * 1000;

    if (ms - now >= diff)
      return true
    else 
      return false
  }

  const renderDetails = (details) => {
    if (noTravel) {
      return (<div>No existe la reserva</div>)
    }

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    return (
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={20}
      >
        <Dialog
          isShown={showRefound}
          title="Confirmar Eliminacion"
          intent="danger"
          onConfirm={() => fullRefoundCallback()}
          onCloseComplete={() => setShowRefound(false)}
          confirmLabel="Aceptar"
          cancelLabel="Cancelar"
        > {isFullRefund() ? 'Faltan mas de 48hs para el viaje, se devolverá la totalidad del dinero ¿Está seguro que quiere cancelar?'
            : 'Faltan menos de 48hs para el viaje, se devolverá la mitad del dinero ¿Está seguro que quiere cancelar?'}
          
        </Dialog>
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
          label="Fecha y hora de salida"
          value={new Date(travel.dateAndTime).toLocaleDateString("es-AR", options)}
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
          label="Estado de la reserva"
          value={details.status}
          disabled
        />

        <TextInputField
          width={'65vh'}
          label="Estado de la declaracion jurada"
          value={details.legalStatus}
          disabled
        />

        <Pane display="flex" justifyContent="space-around">

          <Button 
            marginRight={16} 
            intent="none"
            iconBefore={EditIcon}
            onClick={declarationCallback}
            disabled={details.legalStatus !== LEGAL_STATUS.PENDING}
          > Declaracion jurada
          </Button>

          <Button 
            marginRight={16} 
            intent="success"
            onClick={ticketCallback}
          > Ver ticket
          </Button>
      
        </Pane>

        <Button 
            display="flex-end"
            marginTop={16} 
            intent="danger"
            onClick={promptCancel}
            disabled={details.status !== TRAVEL_STATES.NOT_STARTED}
            visible={false}
          > Cancelar Reserva
          </Button>
      
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
